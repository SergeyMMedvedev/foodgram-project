import React, { useEffect, useRef } from 'react';
import './Tags.css';

function Tags({
  main,
  selectedTags,
  onTagClick,
  onSetTagBreakfast,
  onSetTagTagDinner,
  onSetTagTagSupper,
  tagBreakfast,
  tagDinner,
  tagSupper,
}) {
  const tagListRef = useRef();
  function handleClick(e) {
    if (main) {
      if (e.target.value === 'завтрак') {
        e.target.classList.toggle('tags__checkbox_active');
        onSetTagBreakfast();
      }
      if (e.target.value === 'обед') {
        e.target.classList.toggle('tags__checkbox_active');
        onSetTagTagDinner();
      }
      if (e.target.value === 'ужин') {
        e.target.classList.toggle('tags__checkbox_active');
        onSetTagTagSupper();
      }
    } else if (e.target.classList.contains('tags__checkbox_active')) {
      const remove = true;
      onTagClick(remove, e.target.value);
      e.target.classList.remove('tags__checkbox_active');
    } else {
      const remove = false;
      onTagClick(remove, e.target.value);
      e.target.classList.add('tags__checkbox_active');
    }
  }

  useEffect(() => {
    if (selectedTags) {
      if (selectedTags.length > 0 && tagListRef.current) {
        Array.prototype.slice.call(tagListRef.current.children).forEach((li) => {
          if (selectedTags.includes(li.firstChild.value)) li.firstChild.classList.add('tags__checkbox_active');
        });
      }
    }
  }, [selectedTags]);

  // проверка, какие теги отмечены
  useEffect(() => {
    if (main && tagListRef.current) {
      const elems = Array.prototype.slice.call(tagListRef.current.children);
      const tags = [tagBreakfast, tagDinner, tagSupper].map((tag) => (
        tag.replace('&tag__name=', '')
      ));
      elems.forEach((item) => {
        if (tags.includes(item.firstChild.value)) {
          item.firstChild.classList.add('tags__checkbox_active');
        }
      });
    }
  }, [tagBreakfast, tagDinner, tagSupper]);

  return (
    <ul ref={tagListRef} className="tags">
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
