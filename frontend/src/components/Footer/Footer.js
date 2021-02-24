import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__container container">
        <a href="/" className="footer__brand link">Продуктовый помощник</a>
        <ul className="footer__items">
          <li className="footer__item"><a href="/" className="footer__link link">Об авторе </a></li>
          <li className="footer__item"><a href="/" className="footer__link link">Технологии</a></li>
        </ul>
      </div>
    </footer>
  );
}

export default Footer;
