import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Card.css';
import testCardImg from '../../images/testCardImg.png';
import renderTags from '../../utils/renderTags';
import IconFavorite from '../../ui/iconFavorite/iconFavorite';
import { CurrentFavoriteRecipes, CurrentFavoritesData } from '../../context/CurrentFavoriteRecipesContext';

function Card({
  allRecipes,
  recipeId,
  recipeName,
  tags,
  cookingTime,
  author,
  onAddToFavorites,
  onDeleteFromFavorites,
  onAddPurchase,
}) {
  const favoriteRecipes = useContext(CurrentFavoriteRecipes);
  const favoriteData = useContext(CurrentFavoritesData);

  const [isCardFavorite, setIsCardFavorite] = useState(false);

  function handleAddToPurchase() {
    onAddPurchase(recipeId);
  }

  function handleAddToFavorites() {
    onAddToFavorites(recipeId);
  }

  function handleRemoveFromFavorites() {
    const favoriteDataItem = favoriteData.find((item) => (
      item.favorite.id === recipeId
    ));
    onDeleteFromFavorites(favoriteDataItem.id);
  }

  useEffect(() => {
    if (allRecipes) {
      const favoriteIds = [];
      favoriteRecipes.forEach((item) => (
        favoriteIds.push(item.id)
      ));
      if (favoriteIds.includes(recipeId)) {
        setIsCardFavorite(true);
      } else {
        setIsCardFavorite(false);
      }
    } else {
      setIsCardFavorite(true);
    }
  }, [favoriteRecipes]);

  return (
    <div className="card" data-id={`recipe__${recipeId}`}>
      <Link to={`/single-page/${recipeId}`} className="link">
        <img src={testCardImg} alt={recipeName} className="card__image" />
      </Link>
      <div className="card__body">
        <Link className="card__title link" to={`/single-page/${recipeId}`}>{recipeName}</Link>
        <ul className="card__items">
          {renderTags(tags)}
        </ul>
        <div className="card__items card__items_column">
          <p className="card__text">
            <span className="icon-time" />
            {` ${cookingTime} мин.`}
          </p>
          <p className="card__text">
            <span className="icon-user" />
            <Link to="/" className="card__name-link">{` ${author}`}</Link>
          </p>
        </div>
      </div>
      <div className="card__footer">
        <button onClick={handleAddToPurchase} type="button" className="button button_style_light-blue" name="purchases" data-out>
          <span className="icon-plus button__icon" />
          Добавить в покупки
        </button>
        <button onClick={isCardFavorite ? handleRemoveFromFavorites : handleAddToFavorites} type="button" className="button cnbutton_style_none" name="favorites" data-out>
          <IconFavorite
            active={isCardFavorite}
          />
        </button>
      </div>
    </div>
  );
}

export default Card;
