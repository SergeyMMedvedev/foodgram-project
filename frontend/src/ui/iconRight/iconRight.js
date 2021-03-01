import React from 'react';
import './iconRight.css';
import cn from 'classnames';

function IconRight({ inactive }) {
  return (
    <span className={cn('icon-right', { 'icon-right_inactive': inactive })} />
  );
}

export default IconRight;
