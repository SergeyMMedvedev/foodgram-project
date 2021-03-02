import React from 'react';
import cn from 'classnames';
import { API_BASE_URL } from './constants';

export const PAGE_SIZE = 6;

export function getCurrentPageNumber(pagination) {
  if (pagination.previous) {
    if (!pagination.previous.includes('page=')) {
      return 'page=2';
    }

    const lengthOfPageNumber = (
      pagination.previous.slice(
        pagination.previous.indexOf('page=') + 5,
        (pagination.previous.indexOf('&') !== -1) ? (pagination.previous.indexOf('&')) : pagination.previous.length,
      )).length;
    return `page=${(+pagination.previous.substr(pagination.previous.indexOf('page=') + 5, lengthOfPageNumber) + 1)}`;
  }
  if (pagination.next) {
    const lengthOfPageNumber = (
      pagination.next.slice(
        pagination.next.indexOf('page=') + 5,
        (pagination.next.indexOf('&') !== -1) ? (pagination.next.indexOf('&')) : pagination.next.length,
      )).length;
    return `page=${(+pagination.next.substr(pagination.next.indexOf('page=') + 5, lengthOfPageNumber) - 1)}`;
  }
  return 'page=1';
}

export function getCurrentPageNumberWithRemovingItems(pagination) {
  let currentPage = +getCurrentPageNumber(pagination).replace('page=', '');
  if ((currentPage === Math.ceil(pagination.count / PAGE_SIZE)) && (pagination.count - Math.floor(pagination.count / PAGE_SIZE) * PAGE_SIZE) === 1) {
    currentPage -= 1;
    if (currentPage === 0) currentPage = 1;
  }
  return `page=${currentPage}`;
}

function getOnlyNumOfPage(page) {
  return +page.replace('page=', '');
}

export function handlePreviousClick(pagination, getItems, selectedAuthor) {
  if (pagination.previous) {
    if (pagination.previous.includes('page=')) {
      const lengthOfPageNumber = (
        pagination.previous.slice(
          pagination.previous.indexOf('page=') + 5,
          (pagination.previous.indexOf('&') !== -1) ? (pagination.previous.indexOf('&')) : pagination.previous.length,
        )).length;
      const page = pagination.previous.substr(pagination.previous.indexOf('page=', API_BASE_URL.length), 5 + lengthOfPageNumber);
      getItems({ page, author: selectedAuthor });
    } else {
      const page = 'page=1';
      getItems({ page, author: selectedAuthor });
    }
  }
}

export function handleNextClick(pagination, getItems, selectedAuthor) {
  if (pagination.next) {
    const lengthOfPageNumber = (
      pagination.next.slice(
        pagination.next.indexOf('page=') + 5,
        (pagination.next.indexOf('&') !== -1) ? (pagination.next.indexOf('&')) : pagination.next.length,
      )).length;
    const page = pagination.next.substr(pagination.next.indexOf('page=', API_BASE_URL.length), 5 + lengthOfPageNumber);
    getItems({ page, author: selectedAuthor });
  }
}

export function renderPaginationItem(pagination, onClick) {
  const items = [];
  const currentPage = getOnlyNumOfPage(getCurrentPageNumber(pagination));
  const lastPage = Math.ceil(pagination.count / PAGE_SIZE);
  if (lastPage <= 7) {
    for (let i = 1; i <= Math.ceil(pagination.count / PAGE_SIZE); i += 1) {
      items.push(
        <li key={i} className={cn('pagination__item', { pagination__item_active: `page=${i}` === (getCurrentPageNumber(pagination)) })}>
          <button onClick={onClick} type="button" className="pagination__link link" value={`page=${i}`}>
            {i}
          </button>
        </li>,
      );
    }
    return items;
  }
  if (currentPage >= 1 && currentPage <= 3) {
    items.push(
      <li key={1} className={cn('pagination__item', { pagination__item_active: (`page=${1}` === getCurrentPageNumber(pagination)) })}>
        <button onClick={onClick} type="button" className="pagination__link link" value={`page=${1}`}>
          {1}
        </button>
      </li>,
    );
    for (let i = 2; i <= 5; i += 1) {
      items.push(
        <li key={i} className={cn('pagination__item', { pagination__item_active: (`page=${i}` === getCurrentPageNumber(pagination)) })}>
          <button onClick={onClick} type="button" className="pagination__link link" value={`page=${i}`}>
            {i}
          </button>
        </li>,
      );
    }
    items.push(
      <li key="..." className="pagination__item">
        <button disabled type="button" className="pagination__link link">
          ...
        </button>
      </li>,
    );
    items.push(
      <li key={lastPage} className={cn('pagination__item', { pagination__item_active: `page=${lastPage}` === getCurrentPageNumber(pagination) })}>
        <button disabled type="button" className="pagination__link link" value={`page=${lastPage}`}>
          {lastPage}
        </button>
      </li>,
    );
    return items;
  }

  if (currentPage - 3 === 1) {
    for (let i = 1; i <= currentPage + 2; i += 1) {
      items.push(
        <li key={i} className={cn('pagination__item', { pagination__item_active: `page=${i}` === getCurrentPageNumber(pagination) })}>
          <button onClick={onClick} type="button" className="pagination__link link" value={`page=${i}`}>
            {i}
          </button>
        </li>,
      );
    }
    items.push(
      <li key="..." className="pagination__item">
        <button disabled type="button" className="pagination__link link">
          ...
        </button>
      </li>,
    );
    items.push(
      <li key={lastPage} className={cn('pagination__item', { pagination__item_active: `page=${lastPage}` === getCurrentPageNumber(pagination) })}>
        <button disabled type="button" className="pagination__link link" value={`page=${lastPage}`}>
          {lastPage}
        </button>
      </li>,
    );
    return items;
  }

  if (currentPage + 3 >= lastPage) {
    items.push(
      <li key={1} className={cn('pagination__item', { pagination__item_active: `page=${1}` === getCurrentPageNumber(pagination) })}>
        <button onClick={onClick} type="button" className="pagination__link link" value={`page=${1}`}>
          {1}
        </button>
      </li>,
    );
    items.push(
      <li key="..." className="pagination__item">
        <button disabled type="button" className="pagination__link link">
          ...
        </button>
      </li>,
    );
    for (let i = lastPage - 5; i <= lastPage; i += 1) {
      items.push(
        <li key={i} className={cn('pagination__item', { pagination__item_active: `page=${i}` === getCurrentPageNumber(pagination) })}>
          <button onClick={onClick} type="button" className="pagination__link link" value={`page=${i}`}>
            {i}
          </button>
        </li>,
      );
    }
    return items;
  }
  items.push(
    <li key={1} className={cn('pagination__item', { pagination__item_active: `page=${1}` === getCurrentPageNumber(pagination) })}>
      <button onClick={onClick} type="button" className="pagination__link link" value={`page=${1}`}>
        {1}
      </button>
    </li>,
  );
  items.push(
    <li key="..." className="pagination__item">
      <button disabled type="button" className="pagination__link link">
        ...
      </button>
    </li>,
  );
  for (let i = currentPage - 2; i <= currentPage + 2; i += 1) {
    items.push(
      <li key={i} className={cn('pagination__item', { pagination__item_active: `page=${i}` === getCurrentPageNumber(pagination) })}>
        <button onClick={onClick} type="button" className="pagination__link link" value={`page=${i}`}>
          {i}
        </button>
      </li>,
    );
  }
  items.push(
    <li key="...2" className="pagination__item">
      <button disabled type="button" className="pagination__link link">
        ...
      </button>
    </li>,
  );
  items.push(
    <li key={lastPage} className={cn('pagination__item', { pagination__item_active: `page=${lastPage}` === getCurrentPageNumber(pagination) })}>
      <button disabled type="button" className="pagination__link link" value={`page=${lastPage}`}>
        {lastPage}
      </button>
    </li>,
  );
  return items;
}
