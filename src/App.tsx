import { FormEvent, SyntheticEvent, useState } from "react";
import { BiSolidBinoculars } from "react-icons/bi";

import FontDisplay from "@/components/FontDisplay";
import Loader from "@/components/Loader";
import { GOOGLE_FONTS_CSS_API } from "@/constants";

import styles from "./App.module.scss";

const GOOGLE_FONTS_KEY = import.meta.env.VITE_GOOGLE_FONTS_API_KEY;
const MAX_INPUT_LENGTH = 250;

const TEST_FONTS = [
  "Roboto",
  "Noto Serif",
  "Protest Guerrilla",
  "Sevillana",
  "Inconsolata",
];

function App() {
  const [fonts] = useState<string[]>(TEST_FONTS);
  const [isLoading] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>("");

  async function fetchFonts() {
    const fontsQueryString = fonts
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
    <main className={styles.app}>
      <form className={styles.form} onSubmit={handleSubmit}>
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
      {isLoading && <Loader />}
      <div className={styles.fontDisplays}>
        {fonts.map((font) => (
          <FontDisplay font={font} key={font} />
        ))}
      </div>
    </main>
  );
}

export default App;
