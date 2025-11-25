import "../styles/Footer.css";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__bottom">
          <p className="footer__copyright">
            &copy; {currentYear} Project KomiKita. All rights reserved.
          </p>
          <p className="footer__credit">Created by Tim Kata Luthfi Sikat Aja</p>
        </div>
      </div>
    </footer>
  );
}
