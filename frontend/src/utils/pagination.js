import React from 'react';
import cn from 'classnames';
import { SERVER_INTERNAL_URL } from './constants';
import '../components/appearAnimation/appearAnimation.css';

// для изменения количества выдачи элементов на страницу поменять здесь и в settings.py
// REST_FRAMEWORK, PAGE_SIZE
export const PAGE_SIZE = 6;

// принимает страницу, которую надо запросить (в формате page=...),
// автора для фильтрации рецептов по его авторству (в формате &author__username=..., т.к. в джанго
// чтобы работал встроенный filter_fields, нужно указать username модели User, к которой относится поле автора рецепта),
// paginatorElements - это уже массив детей текущего рефа на ul со всеми эдементами пагинатора (кнопки страниц и стрелочки)
// для того, чтобы найти среди них активный и плавно снять активность (добавив класс декативации),
// containerWithLoadableItems - это контейнер в котором ul в котором будут все запрашиваемые элементы. Контейнер плавно исчезает
// добавлением класса disappearAnimation, затем передается в getItems. Там у него в дальшейшем после ответа базы данных
// убиарется класс disappearAnimation и добавляется appearAnimation для плавного появления уже новых элементов
function animatedGetItem(page, author, paginatorElements, containerWithLoadableItems, getItems) {
  const elem = paginatorElements.find((item) => (
    item.classList.contains('pagination__item_active')
  ));
  const promise = new Promise((resolve) => {
    if (containerWithLoadableItems) {
      containerWithLoadableItems.classList.add('disappearAnimation');
    }
    if (elem) {
      elem.classList.add('pagination__item_deactive');
    }
    setTimeout(() => (
      resolve('done')
    ), 100);
  });
  promise.then(() => {
    getItems({ page, author, loadedElementsContainer: containerWithLoadableItems });
  });
}

// возвращает количество символов номера предыдущей станицы
function getLengthOfPreviousPageNumber(pagination) {
  return (
    pagination.previous.slice(
      pagination.previous.indexOf('page=') + 5,
      (pagination.previous.indexOf('&', pagination.previous.indexOf('page=') + 5) !== -1) ? (pagination.previous.indexOf('&')) : pagination.previous.length,
    ).length
  );
}

// возвращает количество символов номера следующей станицы
function getLengthOfNextPageNumber(pagination) {
  return (
    pagination.next.slice(
      pagination.next.indexOf('page=') + 5,
      (pagination.next.indexOf('&', pagination.next.indexOf('page=') + 5) !== -1) ? (pagination.next.indexOf('&')) : pagination.next.length,
    ).length
  );
}

// вырезает из url номер страницы
function cutPageNumberFromUrl(page, lengthOfPageNumber) {
  return page.substr(page.indexOf('page=', SERVER_INTERNAL_URL.length) + 5, lengthOfPageNumber);
}

// вырезает из url параметр запроса страницы (кусок page=...)
function cutPageFromUrl(page, lengthOfPageNumber) {
  return page.substr(page.indexOf('page=', SERVER_INTERNAL_URL.length), 5 + lengthOfPageNumber);
}

// возвращает текущую страницу, на которой сейчас пользователь
export function getCurrentPageNumber(pagination) {
  if (pagination.previous) {
    if (!pagination.previous.includes('page=')) {
      return 'page=2';
    }
    const lengthOfPageNumber = getLengthOfPreviousPageNumber(pagination);
    return `page=${+cutPageNumberFromUrl(pagination.previous, lengthOfPageNumber) + 1}`;
  }
  if (pagination.next) {
    const lengthOfPageNumber = getLengthOfNextPageNumber(pagination);
    return `page=${+cutPageNumberFromUrl(pagination.next, lengthOfPageNumber) - 1}`;
  }
  return 'page=1';
}

// возвращает текущую страницу, на которой сейчас пользователь
// но учитывает случаи, когда удаляется последний элемент со страницы и нужно вернуть уже предыдущую
export function getCurrentPageNumberWithRemovingItems(pagination) {
  let currentPage = +getCurrentPageNumber(pagination).replace('page=', '');
  if ((currentPage === Math.ceil(pagination.count / PAGE_SIZE)) && (pagination.count - Math.floor(pagination.count / PAGE_SIZE) * PAGE_SIZE) === 1) {
    currentPage -= 1;
    if (currentPage === 0) currentPage = 1;
  }
  return `page=${currentPage}`;
}

// удаляет из строки page=... и возвращает только число
function getOnlyNumOfPage(page) {
  return +page.replace('page=', '');
}

export function handlePreviousClick(params) {
  const {
    pagination,
    getItems,
    selectedAuthor,
    paginatorRef,
    containerWithLoadableItemsRef,
  } = params;
  const paginatorItems = Array.prototype.slice.call(paginatorRef.current.children);
  let containerWithLoadableItems;
  if (containerWithLoadableItemsRef) {
    containerWithLoadableItems = containerWithLoadableItemsRef.current;
  }
  if (pagination.previous) {
    if (pagination.previous.includes('page=')) {
      const lengthOfPageNumber = getLengthOfPreviousPageNumber(pagination);
      const page = cutPageFromUrl(pagination.previous, lengthOfPageNumber);
      animatedGetItem(page, selectedAuthor, paginatorItems, containerWithLoadableItems, getItems);
    } else {
      const page = 'page=1';
      animatedGetItem(page, selectedAuthor, paginatorItems, containerWithLoadableItems, getItems);
    }
  }
}

export function handleNextClick(params) {
  const {
    pagination,
    getItems,
    selectedAuthor,
    paginatorRef,
    containerWithLoadableItemsRef,
  } = params;
  const paginatorItems = Array.prototype.slice.call(paginatorRef.current.children);
  let containerWithLoadableItems;
  if (containerWithLoadableItemsRef) {
    containerWithLoadableItems = containerWithLoadableItemsRef.current;
  }
  if (pagination.next) {
    const lengthOfPageNumber = getLengthOfNextPageNumber(pagination);
    const page = cutPageFromUrl(pagination.next, lengthOfPageNumber);
    animatedGetItem(page, selectedAuthor, paginatorItems, containerWithLoadableItems, getItems);
  }
}

function getPaginationItem(key, onClick, pagination) {
  return (
    <li key={key} className={cn('pagination__item', { pagination__item_active: `page=${key}` === (getCurrentPageNumber(pagination)) })}>
      <button onClick={onClick} type="button" className="pagination__link link" value={`page=${key}`}>
        {key}
      </button>
    </li>
  );
}

function getPaginationItemPlug(key) {
  return (
    <li key={key} className="pagination__item">
      <button disabled type="button" className="pagination__link link">
        ...
      </button>
    </li>
  );
}

export function renderPaginationItem(params) {
  const {
    pagination,
    getItems,
    selectedAuthor,
    paginatorRef,
    containerWithLoadableItemsRef,
  } = params;
  function handlePageClick(e) {
    const page = e.target.value;
    const paginatorItems = Array.prototype.slice.call(paginatorRef.current.children);
    let containerWithLoadableItems;
    if (containerWithLoadableItemsRef) {
      containerWithLoadableItems = containerWithLoadableItemsRef.current;
    }
    animatedGetItem(page, selectedAuthor, paginatorItems, containerWithLoadableItems, getItems);
  }
  const items = [];
  const currentPage = getOnlyNumOfPage(getCurrentPageNumber(pagination));
  const lastPage = Math.ceil(pagination.count / PAGE_SIZE);

  if (lastPage <= 7) {
    for (let i = 1; i <= Math.ceil(pagination.count / PAGE_SIZE); i += 1) {
      items.push(getPaginationItem(i, handlePageClick, pagination));
    }
    return items;
  }
  if (currentPage >= 1 && currentPage <= 3) {
    items.push(getPaginationItem(1, handlePageClick, pagination));
    for (let i = 2; i <= 5; i += 1) {
      items.push(getPaginationItem(i, handlePageClick, pagination));
    }
    items.push(getPaginationItemPlug('...'));
    items.push(getPaginationItem(lastPage, handlePageClick, pagination));
    return items;
  }

  if (currentPage - 3 === 1) {
    for (let i = 1; i <= currentPage + 2; i += 1) {
      items.push(getPaginationItem(i, handlePageClick, pagination));
    }
    items.push(getPaginationItemPlug('...'));
    items.push(getPaginationItem(lastPage, handlePageClick, pagination));
    return items;
  }

  if (currentPage + 3 >= lastPage) {
    items.push(getPaginationItem(1, handlePageClick, pagination));
    items.push(getPaginationItemPlug('...'));
    for (let i = lastPage - 5; i <= lastPage; i += 1) {
      items.push(getPaginationItem(i, handlePageClick, pagination));
    }
    return items;
  }
  items.push(getPaginationItem(1, handlePageClick, pagination));
  items.push(getPaginationItemPlug('...'));
  for (let i = currentPage - 2; i <= currentPage + 2; i += 1) {
    items.push(getPaginationItem(i, handlePageClick, pagination));
  }
  items.push(getPaginationItemPlug('...2'));
  items.push(getPaginationItem(lastPage, handlePageClick, pagination));
  return items;
}
