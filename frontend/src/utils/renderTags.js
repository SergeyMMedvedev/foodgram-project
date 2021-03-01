import React from 'react';
import Badge from '../components/Badge/Badge';

export default function renderTags(tags) {
  let className;
  if (tags) {
    return tags.map((tag) => {
      if (tag.name === 'завтрак') {
        className = 'badge_style_orange';
      } else if (tag.name === 'обед') {
        className = 'badge_style_green';
      } else {
        className = 'badge_style_purple';
      }
      return (
        <Badge
          key={tag.name}
          className={className}
          tagName={tag.name}
        />
      );
    });
  }
  return '';
}
