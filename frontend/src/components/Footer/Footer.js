import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__container container">
        <Link to="/" className="footer__brand link">Продуктовый помощник</Link>
        <ul className="footer__items">
          <li className="footer__item"><Link to="/about" className="footer__link link">Об авторе </Link></li>
          <li className="footer__item"><Link to="/technologies" className="footer__link link">Технологии</Link></li>
        </ul>
      </div>
    </footer>
  );
}

export default Footer;
