import {
  Dispatch,
  FormEvent,
  KeyboardEvent,
  SetStateAction,
  SyntheticEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { BiSolidBinoculars } from "react-icons/bi";

import FontDisplay from "@/components/FontDisplay";
import { getGoogleFontStyles, getGptResponse } from "@/services";
import { Message } from "@/types";

import styles from "./FontFinderForm.module.scss";

type Props = {
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  setMessages: Dispatch<SetStateAction<Message[]>>;
};

function FontFinderForm({ setIsLoading, setMessages }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [userPrompt, setUserPrompt] = useState<string>("");

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  async function findFonts() {
    if (!userPrompt.length) return;

    setMessages((prevMessages) => [
      ...prevMessages,
      {
        message: <p>{userPrompt}</p>,
        type: "user",
      },
    ]);
    setIsLoading(true);
    setUserPrompt("");

    try {
      const gptData = await getGptResponse(userPrompt);
      const fontNames: string[] = JSON.parse(
        gptData.choices[0]?.message?.content
      );

      const fontCss = await getGoogleFontStyles(fontNames);
      const googleFontStyles = document.getElementById("google-font-styles");

      if (googleFontStyles) {
        googleFontStyles.textContent += fontCss;

        setMessages((prevMessages) => [
          ...prevMessages,
          {
            message: (
              <>
                {fontNames.map((fontName) => (
                  <FontDisplay font={fontName} key={fontName} />
                ))}
              </>
            ),
            type: "app",
          },
        ]);
        setIsLoading(false);

        if (inputRef.current) {
          inputRef.current.focus();
        }
      }
    } catch (error) {
      console.error(error);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          message: <p>Sorry, something went wrong! Please try again later.</p>,
          type: "app",
        },
      ]);
      setIsLoading(false);

      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  }

  function handleKeyPress(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      findFonts();
    }
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    findFonts();
  }

  function updateUserPrompt({
    currentTarget: { value },
  }: SyntheticEvent<HTMLInputElement>) {
    setUserPrompt(value);
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        className={styles.input}
        onChange={updateUserPrompt}
        onKeyDown={handleKeyPress}
        placeholder="Show me fonts that are fun but professional"
        ref={inputRef}
        value={userPrompt}
      />
      <button
        aria-label="Send"
        className={styles.button}
        disabled={!userPrompt.length}
      >
        <BiSolidBinoculars />
      </button>
    </form>
  );
}

export default FontFinderForm;
