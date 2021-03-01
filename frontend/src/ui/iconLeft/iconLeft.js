import React from 'react';
import './iconLeft.css';
import cn from 'classnames';

function IconLeft({ inactive }) {
  return (
    <span className={cn('icon-left', { 'icon-left_inactive': inactive })} />
  );
}

export default IconLeft;
