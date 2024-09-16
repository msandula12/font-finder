import { BiLinkExternal } from "react-icons/bi";

import { GOOGLE_FONTS_FONT_URL } from "@/constants";

import styles from "./FontDisplay.module.scss";

type Props = {
  font: string;
};

function FontDisplay({ font }: Props) {
  return (
    <section className={styles.fontDisplay}>
      <h4 className={styles.fontDisplayName}>
        {font}
        <a
          className={styles.fontDisplayLink}
          href={`${GOOGLE_FONTS_FONT_URL}/${font}`}
          target="_blank"
        >
          <BiLinkExternal />
        </a>
      </h4>
      <p style={{ fontFamily: font }}>
        Everyone has the right to freedom of thought, conscience and religion;
        this right includes freedom to change his religion or belief, and
        freedom, either alone or in community with others and in public or
        private, to manifest his religion or belief in teaching, practice,
        worship and observance.
      </p>
    </section>
  );
}

export default FontDisplay;
