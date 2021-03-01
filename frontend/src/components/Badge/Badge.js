import React from 'react';
import './Badge.css';

function Badge({ className, tagName }) {
  return (
    <li key={tagName} className="card__item"><span className={`badge ${className}`}>{tagName}</span></li>
  );
}

export default Badge;
