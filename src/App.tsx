import { FormEvent, SyntheticEvent, useState } from "react";

import styles from "./App.module.scss";

const GOOGLE_FONTS_API = "https://www.googleapis.com/webfonts/v1/webfonts";
const GOOGLE_FONTS_KEY = import.meta.env.VITE_GOOGLE_FONTS_API_KEY;

const fontFamily = "Roboto";

function App() {
  const [searchValue, setSearchValue] = useState<string>("");

  async function fetchFonts() {
    const response = await fetch(
      `${GOOGLE_FONTS_API}?key=${GOOGLE_FONTS_KEY}&family=${fontFamily}`
    );

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const data = await response.json();

    console.log("data: ", data.items);
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    console.log(`Search: ${searchValue}`);
    fetchFonts();
  }

  function updateSearchValue({
    currentTarget: { value },
  }: SyntheticEvent<HTMLTextAreaElement>) {
    setSearchValue(value);
  }

  return (
    <div className={styles.app}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h1>FontFinder</h1>
        <textarea
          onChange={updateSearchValue}
          placeholder={`Describe the kind of font(s) you're looking for (e.g., "A bold, rounded font that looks good in all caps")`}
          rows={4}
          value={searchValue}
        />
        <button>Submit</button>
      </form>
    </div>
  );
}

export default App;
