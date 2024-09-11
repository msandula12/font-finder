import styles from "./Footer.module.scss";

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      View the source code at{" "}
      <a href="https://github.com/msandula12/font-finder" target="_blank">
        github.com/msandula12/font-finder
      </a>
      . Copyright &copy;{year} Mike Sandula.
    </footer>
  );
}

export default Footer;
