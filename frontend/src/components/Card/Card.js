import React, {
  useContext,
  // useContext,
  useEffect,
  useState,
} from 'react';
import { Link } from 'react-router-dom';
import './Card.css';
import testCardImg from '../../images/testCardImg.png';
import renderTags from '../../utils/renderTags';
import IconFavorite from '../../ui/iconFavorite/iconFavorite';
import CurrentUserContext from '../../context/CurrentUserContext';

function Card({
  allRecipes,
  subscribers,
  recipeId,
  recipeName,
  tags,
  cookingTime,
  author,
  onAddToFavorites,
  onDeleteFromFavorites,
  onAddPurchase,
}) {
  const [isCardFavorite, setIsCardFavorite] = useState(false);
  const currentUser = useContext(CurrentUserContext);

  function handleAddToPurchase() {
    onAddPurchase(recipeId);
  }

  function handleAddToFavorites() {
    onAddToFavorites(recipeId);
  }

  function handleRemoveFromFavorites() {
    onDeleteFromFavorites(recipeId);
  }

  useEffect(() => {
    console.log('THIS IS', recipeId);
    console.log('subscribers', subscribers);
    console.log('currentUser.username', currentUser.username);
    const isSaved2 = subscribers.some((item) => (
      item.username === currentUser.username
    ));
    console.log('isSaved2', isSaved2);
    if (allRecipes) {
      const isSaved = subscribers.some((item) => (
        item.username === currentUser.username
      ));
      setIsCardFavorite(isSaved);
    } else {
      setIsCardFavorite(true);
    }
  }, [subscribers]);

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
