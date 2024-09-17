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
import { MAX_INPUT_LENGTH } from "@/constants";
import { getGoogleFontStyles, getGptResponse } from "@/services";
import { Message } from "@/types";

import styles from "./FontFinderForm.module.scss";

type Props = {
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  setMessages: Dispatch<SetStateAction<Message[]>>;
};

function FontFinderForm({ setIsLoading, setMessages }: Props) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const [userPrompt, setUserPrompt] = useState<string>("");

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
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

        if (textareaRef.current) {
          textareaRef.current.focus();
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

      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }
  }

  function handleKeyPress(event: KeyboardEvent<HTMLTextAreaElement>) {
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
  }: SyntheticEvent<HTMLTextAreaElement>) {
    setUserPrompt(value);
  }

  return (
    <form className={styles.fontFinderForm} onSubmit={handleSubmit}>
      <textarea
        className={styles.textarea}
        maxLength={MAX_INPUT_LENGTH}
        onChange={updateUserPrompt}
        onKeyDown={handleKeyPress}
        placeholder="Show me some bold, rounded, sort-of cartoonish fonts that look good in all caps."
        ref={textareaRef}
        rows={3}
        value={userPrompt}
      />
      <div className={styles.toolbar}>
        <span>
          {userPrompt.length} / {MAX_INPUT_LENGTH}
        </span>
        <button className={styles.button} disabled={!userPrompt.length}>
          <BiSolidBinoculars />
        </button>
      </div>
    </form>
  );
}

export default FontFinderForm;
