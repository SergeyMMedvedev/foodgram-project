import React from 'react';
import './ShopListItem.css';
import testCardImg from '../../images/testCardImg.png';

function ShopListItem() {
  return (
    <li className="shopping-list__item" data-id="111">
      <div className="recipe recipe_reverse">
        <img src={testCardImg} alt="какой-то текст" className="recipe__image recipe__image_big" />
        <h3 className="recipe__title">Французские тосты</h3>
        <p className="recipe__text">
          <span className="icon-time" />
          {' 20 мин.'}
        </p>
      </div>
      <a href="#" className="shopping-list__button link">Удалить</a>
    </li>
  );
}

export default ShopListItem;
