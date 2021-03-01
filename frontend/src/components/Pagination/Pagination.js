import React from 'react';
import './Pagination.css';
import cn from 'classnames';
import { API_BASE_URL } from '../../utils/constants';
import IconLeft from '../../ui/iconLeft/iconLeft';
import IconRight from '../../ui/iconRight/iconRight';
import { getCurrentPageNumber } from '../../utils/pagination';

function Pagination({ pagination, getItems, selectedAuthor }) {
  function handlePageClick(e) {
    getItems({ page: e.target.value, author: selectedAuthor });
  }

  function renderPaginationItem() {
    const items = [];
    for (let i = 1; i <= Math.ceil(pagination.count / 6); i += 1) {
      items.push(
        <li key={i} className={cn('pagination__item', { pagination__item_active: `page=${i}` === getCurrentPageNumber(pagination) })}>
          <button onClick={handlePageClick} type="button" className="pagination__link link" value={`page=${i}`}>
            {i}
          </button>
        </li>,
      );
    }
    return items;
  }

  function handlePreviousClick() {
    if (pagination.previous) {
      const page = pagination.previous.substr(pagination.previous.indexOf('page=', API_BASE_URL.length), 6);
      getItems({ page, author: selectedAuthor });
    }
  }

  function handleNextClick() {
    if (pagination.next) {
      const page = pagination.next.substr(pagination.next.indexOf('page=', API_BASE_URL.length), 6);
      console.log(page);
      getItems({ page, author: selectedAuthor });
    }
  }

  return (
    <>
      {pagination.count > 6 && (
        <nav className="pagination" aria-label="Search results pages">
          <ul className="pagination__container">
            <li className="pagination__item">
              <button onClick={handlePreviousClick} type="button" className="pagination__link link">
                <IconLeft
                  inactive={pagination.previous === null}
                />
              </button>
            </li>
            {renderPaginationItem().map((item) => item)}
            <li className="pagination__item">
              <button onClick={handleNextClick} type="button" className="pagination__link link">
                <IconRight
                  inactive={pagination.next === null}
                />
              </button>
            </li>
          </ul>
        </nav>
      )}
    </>
  );
}

export default React.memo(Pagination);
