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
import {
  GOOGLE_FONTS_CSS_API,
  MAX_INPUT_LENGTH,
  OPENAI_URL,
  PROMPT_TEXT,
} from "@/constants";
import { Message } from "@/types";

import styles from "./FontFinderForm.module.scss";

const GOOGLE_FONTS_KEY = import.meta.env.VITE_GOOGLE_FONTS_API_KEY;
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

type Props = {
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  setMessages: Dispatch<SetStateAction<Message[]>>;
};

function FontFinderForm({ setIsLoading, setMessages }: Props) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const [searchValue, setSearchValue] = useState<string>("");

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  async function findFonts() {
    if (!searchValue.length) return;

    setMessages((prevMessages) => [
      ...prevMessages,
      {
        message: searchValue,
        type: "user",
      },
    ]);
    setIsLoading(true);
    setSearchValue("");

    const gptResponse = await fetch(OPENAI_URL, {
      body: JSON.stringify({
        messages: [
          {
            content: `${PROMPT_TEXT}: ${searchValue}`,
            role: "user",
          },
        ],
        model: "gpt-3.5-turbo",
      }),
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    if (!gptResponse.ok) {
      const error = await gptResponse.json();
      throw new Error(`Response status: ${error.error?.message}`);
    }

    const gptData = await gptResponse.json();
    const fontNames: string[] = JSON.parse(
      gptData.choices[0]?.message?.content
    );
    const fontsQueryString = fontNames
      .map((font) => `family=${font.replace(/\s/g, "+")}`)
      .join("&");
    const fontsResponse = await fetch(
      `${GOOGLE_FONTS_CSS_API}?key=${GOOGLE_FONTS_KEY}&${fontsQueryString}`
    );

    if (!fontsResponse.ok) {
      throw new Error(`Response status: ${fontsResponse.status}`);
    }

    const fontCss = await fontsResponse.text();
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
  }

  function handleKeyPress({ key }: KeyboardEvent<HTMLTextAreaElement>) {
    if (key === "Enter") {
      findFonts();
    }
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    findFonts();
  }

  function updateSearchValue({
    currentTarget: { value },
  }: SyntheticEvent<HTMLTextAreaElement>) {
    setSearchValue(value);
  }

  return (
    <form className={styles.fontFinderForm} onSubmit={handleSubmit}>
      <textarea
        className={styles.textarea}
        maxLength={MAX_INPUT_LENGTH}
        onChange={updateSearchValue}
        onKeyDown={handleKeyPress}
        placeholder="Show me some bold, rounded, sort-of cartoonish fonts that look good in all caps."
        ref={textareaRef}
        rows={3}
        value={searchValue}
      />
      <div className={styles.toolbar}>
        <span>
          {searchValue.length} / {MAX_INPUT_LENGTH}
        </span>
        <button className={styles.button} disabled={!searchValue.length}>
          <BiSolidBinoculars />
        </button>
      </div>
    </form>
  );
}

export default FontFinderForm;
