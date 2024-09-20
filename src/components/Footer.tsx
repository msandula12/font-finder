import styles from "./Footer.module.scss";

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      View the{" "}
      <a href="https://github.com/msandula12/font-finder" target="_blank">
        source code
      </a>
      . Copyright &copy;{year} Mike Sandula.
    </footer>
  );
}

export default Footer;
