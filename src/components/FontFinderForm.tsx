import {
  Dispatch,
  FormEvent,
  SetStateAction,
  SyntheticEvent,
  useState,
} from "react";
import { BiSolidBinoculars } from "react-icons/bi";

import {
  GOOGLE_FONTS_CSS_API,
  MAX_INPUT_LENGTH,
  OPENAI_URL,
  PROMPT_TEXT,
} from "@/constants";

import styles from "./FontFinderForm.module.scss";

const GOOGLE_FONTS_KEY = import.meta.env.VITE_GOOGLE_FONTS_API_KEY;
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

type Props = {
  setFonts: Dispatch<SetStateAction<string[]>>;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
};

function FontFinderForm({ setFonts, setIsLoading }: Props) {
  const [searchValue, setSearchValue] = useState<string>("");

  async function fetchFonts() {
    setFonts([]);
    setIsLoading(true);

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
      googleFontStyles.textContent = fontCss;
      setFonts(fontNames);
      setIsLoading(false);
    }
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    fetchFonts();
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
        placeholder={`Describe the kind of fonts you're looking for (e.g., "Bold, rounded fonts that look good in all caps")`}
        rows={4}
        value={searchValue}
      />
      <div className={styles.toolbar}>
        <span>
          {searchValue.length} / {MAX_INPUT_LENGTH}
        </span>
        <button className={styles.button} disabled={!searchValue.length}>
          <BiSolidBinoculars /> Find
        </button>
      </div>
    </form>
  );
}

export default FontFinderForm;
