import { FormEvent, SyntheticEvent, useState } from "react";

import styles from "./App.module.scss";

function App() {
  const [searchValue, setSearchValue] = useState<string>("");

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    console.log(`Search: ${searchValue}`);
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
