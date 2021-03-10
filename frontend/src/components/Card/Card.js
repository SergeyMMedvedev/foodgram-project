import React, {
  useContext,
  useEffect,
  useState,
  useRef,
} from 'react';
import { Link } from 'react-router-dom';
import cn from 'classnames';
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
  image,
  author,
  onAddToFavorites,
  onDeleteFromFavorites,
  onAddPurchase,
  pagination,
  selectedAuthor,
  onDeletePurchase,
  purchases,
}) {
  const [saveLoading, setSaveLoading] = useState(true);
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [isCardFavorite, setIsCardFavorite] = useState(false);
  const [purchaseId, setPurchaseId] = useState('');
  const currentUser = useContext(CurrentUserContext);
  const cardRef = useRef();

  function handleAddToPurchase() {
    setPurchaseLoading(true);
    onAddPurchase(recipeId);
  }

  function handlePurchaseDelete() {
    onDeletePurchase(purchaseId);
    setPurchaseLoading(true);
  }

  function handleAddToFavorites() {
    setSaveLoading(true);
    onAddToFavorites({
      recipeId,
      page: getCurrentPageNumber(pagination),
      author: selectedAuthor,
      allRecipesPage,
      favoriteRecipesPage,
    });
  }

  function handleRemoveFromFavorites() {
    setDeleting(true);
    setSaveLoading(true);
    onDeleteFromFavorites({
      recipeId,
      page: allRecipesPage ? getCurrentPageNumber(pagination) : getCurrentPageNumberWithRemovingItems(pagination),
      author: selectedAuthor,
      allRecipesPage,
      favoriteRecipesPage,
    });
  }

  useEffect(() => {
    if (allRecipesPage) {
      const isSaved = subscribers.some((item) => (
        item.username === currentUser.username
      ));
      setIsCardFavorite(isSaved);
      setSaveLoading(false);
    } else {
      setIsCardFavorite(true);
      setSaveLoading(false);
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
    setPurchaseLoading(false);
  }, [purchases]);

  return (
    <div ref={cardRef} className={cn('card', 'appearAnimation', { disappearAnimationLong: (deleting && !allRecipesPage) })} data-id={`recipe__${recipeId}`}>
      <Link to={`/single-page/${recipeId}`} className="link card__image-link">
        <img src={image || testCardImg} alt={recipeName} className="card__image" />
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
        {(purchaseId && currentUser.username) ? (
          <Button
            text={(
              <>
                <IconMinus />
                Убрать из покупок
              </>
            )}
            onClick={handlePurchaseDelete}
            lightOrange
            disabled={!currentUser.username || purchaseLoading}
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
            disabled={!currentUser.username || purchaseLoading}
          />
        )}

        {currentUser.username && (
          <Button
            onClick={isCardFavorite ? handleRemoveFromFavorites : handleAddToFavorites}
            loading={saveLoading}
            favorite
            disabled={saveLoading}
            text={(
              <IconFavorite
                active={isCardFavorite || saveLoading}
              />
            )}
          />
        )}

      </div>
    </div>
  );
}

export default React.memo(Card);
