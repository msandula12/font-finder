import { BiSolidBinoculars } from "react-icons/bi";

import styles from "./Header.module.scss";

function Header() {
  return (
    <header className={styles.header}>
      <BiSolidBinoculars />
      <h1>FontFinder</h1>
    </header>
  );
}

export default Header;
