import { useEffect } from "react";
import { BiSolidBinoculars } from "react-icons/bi";

import { Message } from "@/types";
import { cx } from "@/utils";

import styles from "./Messages.module.scss";

type Props = {
  isLoading: boolean;
  messages: Message[];
};

function Messages({ isLoading, messages }: Props) {
  useEffect(() => {
    setTimeout(() => {
      window.scrollTo({
        behavior: "smooth",
        top: document.body.scrollHeight,
      });
    }, 250);
  }, [messages.length]);

  return (
    <section className={styles.messages}>
      {messages.map((message, index) => (
        <div
          className={cx(styles.message, {
            [styles.fromThem]: message.type === "app",
            [styles.fromMe]: message.type === "user",
          })}
          key={index + 1}
        >
          {message.type === "app" && (
            <BiSolidBinoculars className={styles.avatar} />
          )}
          <div className={styles.chat}>{message.message}</div>
        </div>
      ))}
      {isLoading && (
        <div className={cx(styles.message, styles.fromThem)}>
          <BiSolidBinoculars className={cx(styles.avatar, styles.loading)} />
          <div className={styles.chat}>...</div>
        </div>
      )}
    </section>
  );
}

export default Messages;
