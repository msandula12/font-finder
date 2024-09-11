import { useState } from "react";

import FontDisplay from "@/components/FontDisplay";
import FontFinderForm from "@/components/FontFinderForm";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Loader from "@/components/Loader";

import styles from "./App.module.scss";

function App() {
  const [fonts, setFonts] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <main className={styles.app}>
      <div className={styles.appBody}>
        <Header />
        <FontFinderForm setFonts={setFonts} setIsLoading={setIsLoading} />
        {isLoading && <Loader />}
        {fonts.length > 0 && (
          <div className={styles.fontDisplays}>
            {fonts.map((font) => (
              <FontDisplay font={font} key={font} />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}

export default App;
