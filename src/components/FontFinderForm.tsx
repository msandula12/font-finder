import { FormEvent, SyntheticEvent, useState } from "react";
import { BiSolidBinoculars } from "react-icons/bi";

import { GOOGLE_FONTS_CSS_API, MAX_INPUT_LENGTH } from "@/constants";

import styles from "./FontFinderForm.module.scss";

const GOOGLE_FONTS_KEY = import.meta.env.VITE_GOOGLE_FONTS_API_KEY;

const TEST_FONT_NAMES = [
  "Roboto",
  "Noto Serif",
  "Protest Guerrilla",
  "Sevillana",
  "Inconsolata",
];

type Props = {
  setFonts: (fonts: string[]) => void;
};

function FontFinderForm({ setFonts }: Props) {
  const [fontNames] = useState<string[]>(TEST_FONT_NAMES);
  const [searchValue, setSearchValue] = useState<string>("");

  async function fetchFonts() {
    const fontsQueryString = fontNames
      .map((font) => `family=${font.replace(/\s/g, "+")}`)
      .join("&");

    const response = await fetch(
      `${GOOGLE_FONTS_CSS_API}?key=${GOOGLE_FONTS_KEY}&${fontsQueryString}`
    );

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const fontCss = await response.text();

    const googleFontStyles = document.getElementById("google-font-styles");

    if (googleFontStyles) {
      googleFontStyles.textContent = fontCss;
      setFonts(fontNames);
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
      <h1>FontFinder</h1>
      <textarea
        className={styles.textarea}
        maxLength={MAX_INPUT_LENGTH}
        onChange={updateSearchValue}
        placeholder={`Describe the kind of fonts you're looking for (e.g., "Bold, rounded fonts that looks good in all caps")`}
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
