import React from 'react';
import './iconFavorite.css';
import cn from 'classnames';

function IconFavorite({ active, big }) {
  return (
    <span className={cn('icon-favorite', { 'icon-favorite_big': big }, { 'icon-favorite_active': active })} />
  );
}

export default IconFavorite;
