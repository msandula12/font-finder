import { useState } from "react";
import { BiSolidBinoculars } from "react-icons/bi";

import FontFinderForm from "@/components/FontFinderForm";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Messages from "@/components/Messages";
import { Message } from "@/types";

import styles from "./App.module.scss";

function App() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);

  return (
    <div className={styles.app}>
      <Header />
      <main className={styles.main}>
        {messages.length > 0 ? (
          <Messages isLoading={isLoading} messages={messages} />
        ) : (
          <BiSolidBinoculars className={styles.placeholder} />
        )}
      </main>
      <div className={styles.bottom}>
        <FontFinderForm setIsLoading={setIsLoading} setMessages={setMessages} />
        <Footer />
      </div>
    </div>
  );
}

export default App;
