import React, {
  useContext,
  useEffect,
  useState,
  useRef,
} from 'react';
import { Link } from 'react-router-dom';
import './Card.css';
import '../appearAnimation/appearAnimation.css';
import testCardImg from '../../images/testCardImg.png';
import renderTags from '../../utils/renderTags';
import IconFavorite from '../../ui/iconFavorite/iconFavorite';
import IconPlus from '../../ui/iconPlus/iconPlus';
import IconMinus from '../../ui/iconMinus/iconMinus';
import CurrentUserContext from '../../context/CurrentUserContext';
import { getCurrentPageNumber, getCurrentPageNumberWithRemovingItems } from '../../utils/pagination';
import Button from '../Button/Button';

function Card({
  allRecipesPage,
  favoriteRecipesPage,
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
  onDeletePurchase,
  purchases,
}) {
  const [isCardFavorite, setIsCardFavorite] = useState(false);
  const [purchaseId, setPurchaseId] = useState('');
  const currentUser = useContext(CurrentUserContext);
  const cardRef = useRef();

  function handleAddToPurchase() {
    onAddPurchase(recipeId);
  }

  function handleAddToFavorites() {
    onAddToFavorites(
      recipeId,
      getCurrentPageNumber(pagination),
      selectedAuthor,
      allRecipesPage,
      favoriteRecipesPage,
    );
  }

  function handleRemoveFromFavorites() {
    onDeleteFromFavorites(
      recipeId,
      allRecipesPage ? getCurrentPageNumber(pagination) : getCurrentPageNumberWithRemovingItems(pagination),
      selectedAuthor,
      allRecipesPage,
      favoriteRecipesPage,
    );
  }

  function handlePurchaseDelete() {
    onDeletePurchase(purchaseId);
  }

  useEffect(() => {
    if (allRecipesPage) {
      const isSaved = subscribers.some((item) => (
        item.username === currentUser.username
      ));
      setIsCardFavorite(isSaved);
    } else {
      setIsCardFavorite(true);
    }
  }, [subscribers]);

  useEffect(() => {
    if (purchases) {
      if (purchases.length === 0) {
        setPurchaseId('');
      } else {
        const purchase = purchases.find((item) => (
          item.purchase.id === recipeId
        ));
        if (purchase) {
          setPurchaseId(purchase.id);
        } else {
          setPurchaseId('');
        }
      }
    }
  }, [purchases]);

  return (
    <div ref={cardRef} className="card appearAnimation" data-id={`recipe__${recipeId}`}>
      <Link to={`/single-page/${recipeId}`} className="link card__image-link">
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
            <Link to={`/recipes/${author}`} className="card__name-link">{` ${author}`}</Link>
          </p>
        </div>
      </div>
      <div className="card__footer">
        {(purchaseId && currentUser.name) ? (
          <Button
            text={(
              <>
                <IconMinus />
                Убрать из покупок
              </>
            )}
            onClick={handlePurchaseDelete}
            lightOrange
            disabled={!currentUser.name}
          />

        ) : (
          <Button
            text={(
              <>
                <IconPlus />
                Добавить в покупки
              </>
            )}
            onClick={handleAddToPurchase}
            lightBlue
            disabled={!currentUser.name}
          />
        )}

        {currentUser.name && (
          <Button
            onClick={isCardFavorite ? handleRemoveFromFavorites : handleAddToFavorites}
            text={(
              <IconFavorite
                active={isCardFavorite}
              />
            )}
          />
        )}

      </div>
    </div>
  );
}

export default React.memo(Card);
