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
import { getCurrentPageNumber, getCurrentPageNumberWithRemovingItems } from '../../utils/pagination';

function Card({
  allRecipesPage,
  subscribers,
  recipeId,
  recipeName,
  tags,
  cookingTime,
  author,
  onAddToFavorites,
  onDeleteFromFavorites,
  onAddPurchase,
  pagination,
  selectedAuthor,
  // onAuthorClick,
}) {
  const [isCardFavorite, setIsCardFavorite] = useState(false);
  const currentUser = useContext(CurrentUserContext);

  function handleAddToPurchase() {
    onAddPurchase(recipeId);
  }

  function handleAddToFavorites() {
    onAddToFavorites(recipeId, getCurrentPageNumber(pagination), selectedAuthor);
  }

  function handleRemoveFromFavorites() {
    onDeleteFromFavorites(recipeId, allRecipesPage ? getCurrentPageNumber(pagination) : getCurrentPageNumberWithRemovingItems(pagination), selectedAuthor);
  }

  // function handleAuthorClick(e) {
  //   onAuthorClick(`&author__username=${e.target.value}`);
  // }

  useEffect(() => {
    // console.log('isSaved2', isSaved2);
    if (allRecipesPage) {
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
            {/* <button value={author} onClick={handleAuthorClick} type="button" className="card__name-link">{` ${author}`}</button> */}
            <Link to={`/recipes/${author}`} className="card__name-link">{` ${author}`}</Link>
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

export default React.memo(Card);
