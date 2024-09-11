import { useState } from "react";

import FontDisplay from "@/components/FontDisplay";
import FontFinderForm from "@/components/FontFinderForm";
import Loader from "@/components/Loader";

import styles from "./App.module.scss";

function App() {
  const [fonts, setFonts] = useState<string[]>([]);
  const [isLoading] = useState<boolean>(false);

  return (
    <main className={styles.app}>
      <FontFinderForm setFonts={setFonts} />
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
