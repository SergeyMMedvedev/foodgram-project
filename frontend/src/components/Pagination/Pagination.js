import React from 'react';
import './Pagination.css';
import { API_BASE_URL } from '../../utils/constants';

function Pagination({ pagination, getItems }) {
  function handlePageClick(e) {
    getItems(e.target.value);
  }

  function renderPaginationItem() {
    const items = [];
    for (let i = 1; i <= Math.ceil(pagination.count / 6); i += 1) {
      items.push(
        <li key={i} className="pagination__item">
          <button onClick={handlePageClick} type="button" className="pagination__link link" value={`page=${i}`}>
            {i}
          </button>
        </li>,
      );
    }
    return items;
  }

  function handlePreviousClick() {
    console.log(pagination);
    if (pagination.previous) {
      const page = pagination.previous.substr(pagination.previous.indexOf('page=', API_BASE_URL.length), 6);
      getItems(page);
    }
  }

  function handleNextClick() {
    console.log(pagination);
    if (pagination.next) {
      const page = pagination.next.substr(pagination.next.indexOf('page=', API_BASE_URL.length), 6);
      console.log(page);
      getItems(page);
    }
  }

  return (
    <nav className="pagination" aria-label="Search results pages">
      <ul className="pagination__container">
        <li className="pagination__item">
          <button onClick={handlePreviousClick} type="button" className="pagination__link link">
            <span className="icon-left" />
          </button>
        </li>
        {renderPaginationItem().map((item) => item)}
        <li className="pagination__item">
          <button onClick={handleNextClick} type="button" className="pagination__link link">
            <span className="icon-right" />
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default Pagination;
