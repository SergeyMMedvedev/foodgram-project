import React, { useRef } from 'react';
import './Pagination.css';
// import cn from 'classnames';
// import { API_BASE_URL } from '../../utils/constants';
import IconLeft from '../../ui/iconLeft/iconLeft';
import IconRight from '../../ui/iconRight/iconRight';
import {
  PAGE_SIZE,
  renderPaginationItem,
  handlePreviousClick,
  handleNextClick,
} from '../../utils/pagination';

function Pagination({
  pagination,
  getItems,
  selectedAuthor,
  containerWithLoadableItemsRef,
}) {
  const paginatorRef = useRef();

  return (
    <>
      {pagination.count > PAGE_SIZE && (
        <nav className="pagination" aria-label="Search results pages">
          <ul ref={paginatorRef} className="pagination__container">
            <li className="pagination__item">
              <button
                onClick={() => {
                  handlePreviousClick({
                    pagination,
                    getItems,
                    selectedAuthor,
                    paginatorRef,
                    containerWithLoadableItemsRef,
                  });
                }}
                type="button"
                className="pagination__link link"
              >
                <IconLeft
                  inactive={pagination.previous === null}
                />
              </button>
            </li>
            {renderPaginationItem({
              pagination,
              getItems,
              selectedAuthor,
              paginatorRef,
              containerWithLoadableItemsRef,
            }).map((item) => item)}
            <li className="pagination__item">
              <button
                onClick={() => {
                  handleNextClick({
                    pagination,
                    getItems,
                    selectedAuthor,
                    paginatorRef,
                    containerWithLoadableItemsRef,
                  });
                }}
                type="button"
                className="pagination__link link"
              >
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
