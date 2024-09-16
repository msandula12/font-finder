import { useEffect, useRef } from "react";
import { BiSolidBinoculars } from "react-icons/bi";

import { Message } from "@/types";

import styles from "./Messages.module.scss";

type Props = {
  isLoading: boolean;
  messages: Message[];
};

function Messages({ isLoading, messages }: Props) {
  const messagesRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    setTimeout(() => {
      if (messagesRef.current) {
        messagesRef.current.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      }
    }, 100);
  }, [messages.length]);

  return (
    <section className={styles.messages} ref={messagesRef}>
      {messages.map((message, index) => (
        <div
          className={`${styles.message} ${
            message.type === "app" ? styles.appMessage : styles.userMessage
          }`}
          key={index + 1}
        >
          {message.type === "app" && (
            <BiSolidBinoculars className={styles.messageLogo} />
          )}
          <div className={styles.chat}>{message.message}</div>
        </div>
      ))}
      {isLoading && (
        <div className={`${styles.message} ${styles.appMessage}`}>
          <BiSolidBinoculars
            className={`${styles.messageLogo} ${styles.loading}`}
          />
          <div className={styles.chat}>...</div>
        </div>
      )}
    </section>
  );
}

export default Messages;
