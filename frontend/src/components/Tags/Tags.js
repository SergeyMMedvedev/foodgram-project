import React from 'react';
import './Tags.css';

function Tags({ onTagClick }) {
  function handleClick(e) {
    if (e.target.classList.contains('tags__checkbox_active')) {
      const remove = true;
      onTagClick(remove, e.target.value);
      e.target.classList.remove('tags__checkbox_active');
    } else {
      const remove = false;
      onTagClick(remove, e.target.value);
      e.target.classList.add('tags__checkbox_active');
    }
  }

  return (
    <ul className="tags">
      <li className="tags__item">
        <button value="завтрак" onClick={handleClick} type="button" id="breakfast" className="tags__checkbox tags__checkbox_style_orange" />
        <span className="tags__label">Завтрак</span>
      </li>
      <li className="tags__item">
        <button value="обед" onClick={handleClick} type="button" id="lunch" className="tags__checkbox tags__checkbox_style_green" />
        <span htmlFor="lunch" className="tags__label">Обед</span>
      </li>
      <li className="tags__item">
        <button value="ужин" onClick={handleClick} type="button" id="dinner" className="tags__checkbox tags__checkbox_style_purple" />
        <span htmlFor="dinner" className="tags__label">Ужин</span>
      </li>
    </ul>
  );
}

export default Tags;
