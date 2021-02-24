import React from 'react';
import './Pagination.css';

function Pagination() {
  return (
    <nav className="pagination" aria-label="Search results pages">
      <ul className="pagination__container">
        <li className="pagination__item"><a className="pagination__link link" href="#"><span className="icon-left" /></a></li>
        <li className="pagination__item pagination__item_active"><a className="pagination__link link" href="#">1</a></li>
        <li className="pagination__item"><a className="pagination__link link" href="#">2</a></li>
        <li className="pagination__item"><a className="pagination__link link" href="#">3</a></li>
        <li className="pagination__item"><a className="pagination__link link" href="#">4</a></li>
        <li className="pagination__item"><a className="pagination__link link" href="#">5</a></li>
        <li className="pagination__item"><a className="pagination__link link" href="#"><span className="icon-right" /></a></li>
      </ul>
    </nav>
  );
}

export default Pagination;
