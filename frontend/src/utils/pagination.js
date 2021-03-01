export function getCurrentPageNumber(pagination) {
  if (pagination.previous) {
    if (!pagination.previous.includes('page=')) {
      return 'page=2';
    }
    return `page=${(+pagination.previous.substr(pagination.previous.indexOf('page=') + 5, 1) + 1)}`;
  }
  if (pagination.next) {
    return `page=${(+pagination.next.substr(pagination.next.indexOf('page=') + 5, 1) - 1)}`;
  }
  return 'page=1';
}

export function getCurrentPageNumberWithRemovingItems(pagination) {
  let currentPage = +getCurrentPageNumber(pagination).replace('page=', '');
  if ((currentPage === Math.ceil(pagination.count / 6)) && (pagination.count - Math.floor(pagination.count / 6) * 6) === 1) {
    currentPage -= 1;
    if (currentPage === 0) currentPage = 1;
  }
  return `page=${currentPage}`;
}
