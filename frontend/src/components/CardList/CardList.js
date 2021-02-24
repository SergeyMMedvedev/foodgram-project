import React from 'react';
import './CardList.css';
import cn from 'classnames';

function CardList({ children, column }) {
  const className = cn('card-list', { 'card-list_column': column });
  return (
    <div className={className}>
      {children}
    </div>
  );
}

export default CardList;
