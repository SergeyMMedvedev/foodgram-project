import React from 'react';

export default function renderTags(tags) {
  if (tags) {
    return tags.map((tag) => {
      let className;
      if (tag.name === 'Завтрак') {
        className = 'badge_style_orange';
      } else if (tag.name === 'Обед') {
        className = 'badge_style_green';
      } else {
        className = 'badge_style_purple';
      }
      return <li key={tag.name} className="card__item"><span className={`badge ${className}`}>{tag.name}</span></li>;
    });
  }
  return '';
}
