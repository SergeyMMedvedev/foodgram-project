import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import './ShopListItem.css';
import '../appearAnimation/appearAnimation.css';
import testCardImg from '../../images/testCardImg.png';

function ShopListItem({
  recipe,
  onDeletePurchase,
  purchaseId,
}) {
  const shopItemRef = useRef();
  function handlePurchaseDelete() {
    const promise = new Promise((resolve) => {
      if (shopItemRef.current) {
        shopItemRef.current.classList.add('disappearAnimation');
      }
      setTimeout(() => (
        resolve('done')
      ), 100);
    });
    promise.then(() => {
      onDeletePurchase(purchaseId);
    });
  }

  return (
    <li key={purchaseId} ref={shopItemRef} className="shopping-list__item" data-id="111">
      <div className="recipe recipe_reverse">
        <Link to={`/single-page/${recipe.id}`} className="recipe__image-link link">
          <img src={testCardImg} alt={recipe.name} className="recipe__image recipe__image_big" />
        </Link>
        <Link to={`/single-page/${recipe.id}`} className="recipe__title-link link">
          <h3 className="recipe__title">{recipe.name}</h3>
        </Link>
        <p className="recipe__text">
          <span className="icon-time" />
          {` ${recipe.cooking_time} мин.`}
        </p>
      </div>
      <button onClick={handlePurchaseDelete} type="button" className="shopping-list__button link">Удалить</button>
    </li>
  );
}

export default ShopListItem;
