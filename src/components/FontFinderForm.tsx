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
import { getGoogleFonts, getFontDescriptorsFromGpt } from "@/services";
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
      const descriptors = await getFontDescriptorsFromGpt(userPrompt);
      const fonts = await getGoogleFonts(descriptors);

      for (const font of fonts) {
        try {
          // Create a <link> for each font
          const link = document.createElement("link");
          link.href = `https://fonts.googleapis.com/css?family=${encodeURIComponent(
            font.family
          )}`;
          link.rel = "stylesheet";
          document.head.appendChild(link);

          // Proceed even if a font fails to load
          await new Promise((resolve) => {
            link.onload = resolve;
            link.onerror = resolve;
          });
        } catch (error) {
          console.error(`Error loading font ${font.family}:`, error);
        }
      }

      setMessages((prevMessages) => [
        ...prevMessages,
        {
          message: (
            <>
              {fonts.map(({ family }) => (
                <FontDisplay font={family} key={family} />
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
        placeholder="Describe the font you're looking for..."
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
