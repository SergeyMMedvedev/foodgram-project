import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import './SingleRecipePage.css';
import api from '../../utils/Api';
import renderTags from '../../utils/renderTags';
import CurrentUserContext from '../../context/CurrentUserContext';
import IconFavorite from '../../ui/iconFavorite/iconFavorite';
import Button from '../Button/Button';
import IconPlus from '../../ui/iconPlus/iconPlus';
import IconMinus from '../../ui/iconMinus/iconMinus';
import IconTime from '../../ui/iconTime/iconTime';
import IconUser from '../../ui/iconUser/iconUser';
import Preloader from '../Preloader/Preloader';
import DefaultImage from '../../images/defaultImage.jpg';

function SingleRecipePage({
  onSubscribe,
  subscriptions,
  onUnsubscribe,
  onAddToFavorites,
  onDeleteFromFavorites,
  onAddPurchase,
  onDeletePurchase,
  purchases,
  setResponseError,
  setIsOpenInfoTooltip,
}) {
  const { recipeId } = useParams();
  const [recipeLoaded, setRecipeLoaded] = useState(false);
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(true);
  const [recipe, setRecipe] = useState({});
  const [isUserIsSubscribed, setIsUserIsSubscribed] = useState(null);
  const currentUser = useContext(CurrentUserContext);
  const [isCardFavorite, setIsCardFavorite] = useState(false);
  const [purchaseId, setPurchaseId] = useState('');

  function getRecipeData(id) {
    api.getRecipe(id)
      .then((data) => {
        setRecipe(data);
      })
      .catch((err) => {
        setResponseError(err);
        setIsOpenInfoTooltip(true);
      });
  }

  function handleAddToPurchase() {
    setPurchaseLoading(true);
    onAddPurchase(recipeId);
  }

  function handlePurchaseDelete() {
    setPurchaseLoading(true);
    onDeletePurchase(purchaseId);
  }

  function handleAddToFavorites() {
    if (!isCardFavorite) {
      setSaveLoading(true);
      onAddToFavorites({ recipeId, getRecipeData });
      // getRecipeData(recipeId);
    }
  }

  function handleRemoveFromFavorites() {
    if (isCardFavorite) {
      setSaveLoading(true);
      onDeleteFromFavorites({ recipeId, getRecipeData });
      // getRecipeData(recipeId);
    }
  }

  function handleSubscribe() {
    onSubscribe(recipe.author, setIsUserIsSubscribed);
  }

  function handleUnSubscribe() {
    api.getSubscriptions({ author: `&author=${recipe.author}` })
      .then((data) => {
        if (data.results) {
          onUnsubscribe({
            subscriptionId: data.results[0].id,
            setIsUserIsSubscribed,
          });
        }
      })
      .catch((err) => {
        setResponseError(err);
        setIsOpenInfoTooltip(true);
      });
  }

  useEffect(() => {
    getRecipeData(recipeId);
  }, [recipeId]);

  useEffect(() => {
    if (purchases) {
      if (purchases.length === 0) {
        setPurchaseId('');
      } else {
        const purchase = purchases.find((item) => (
          item.purchase.id.toString() === recipeId.toString()
        ));
        if (purchase) {
          setPurchaseId(purchase.id);
        } else {
          setPurchaseId('');
        }
      }
    }
    setPurchaseLoading(false);
  }, [purchases, recipeId]);

  useEffect(() => {
    if (currentUser.username) {
      if (recipe.subscribers) {
        const isSaved = recipe.subscribers.some((item) => (
          item.username === currentUser.username
        ));
        setIsCardFavorite(isSaved);
      }
    }
    setSaveLoading(false);
  }, [recipe, currentUser.username]);

  useEffect(() => {
    if (currentUser.username) {
      api.getSubscriptions({ author: `&author=${recipe.author}` })
        .then((data) => {
          if (data.results) setIsUserIsSubscribed(data.results.length > 0);
          setSaveLoading(false);
          setRecipeLoaded(true);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [currentUser, subscriptions, recipe.author]);

  function renderIngredients(ingredients) {
    if (ingredients) {
      return ingredients.map((ingredient) => (
        <p className=" single-card__section-item" key={ingredient.id}>
          {`${ingredient.name} - ${ingredient.amount} ${ingredient.units}.`}
        </p>
      ));
    }
    return <p className=" single-card__section-item">загрузка</p>;
  }

  function renderSubscribeButton() {
    if (currentUser.username && currentUser.username !== recipe.author) {
      if (isUserIsSubscribed === null) {
        return (
          <li className="single-card__item">
            <Button
              text="Загрузка..."
              type="button"
              lightBlue
              sizeSubscribe
              disabled
            />
          </li>
        );
      }
      if (isUserIsSubscribed) {
        return (
          <li className="single-card__item">
            <Button
              text="Отписаться"
              lightBlue
              sizeSubscribe
              onClick={handleUnSubscribe}
            />
          </li>
        );
      }
      return (
        <li className="single-card__item">
          <Button
            text="Подписаться на автора"
            onClick={handleSubscribe}
            lightBlue
            sizeSubscribe
          />
        </li>
      );
    }
    return <li className="single-card__item"><div className="button_size_subscribe" /></li>;
  }

  return (
    recipeLoaded ? (
      <div className="single-card" data-id={`recipe__${recipeId}`} data-author={recipe.author}>
        <img src={recipe.image_url || DefaultImage} alt={recipe.name} className="single-card__image" />
        <div className="single-card__info">
          <div className="single-card__header-info">
            <h1 className="single-card__title">{recipe.name}</h1>
            <div className="single-card__favorite">
              <Button
                onClick={isCardFavorite ? handleRemoveFromFavorites : handleAddToFavorites}
                styleNone
                favorite
                loading={saveLoading}
                disabled={saveLoading}
                text={(
                  <IconFavorite
                    big
                    active={isCardFavorite || saveLoading}
                  />
                )}
              />
              <div className="single-card__favorite-tooltip tooltip">Добавить в избранное</div>
            </div>
          </div>
          <ul className="single-card__items">
            {renderTags(recipe.tag)}
          </ul>
          <div className="single-card__items single-card__items_column">
            <p className="single-card__text">
              <IconTime />
              {` ${recipe.cooking_time} мин.`}
            </p>
            <ul className="single-card__items">
              <li className="single-card__item">
                <Link to={`/recipes/${recipe.author}`} className="single-card__name-link">
                  <IconUser />
                  {` ${recipe.author}`}
                </Link>
              </li>
              <li className="single-card__item">
                {recipe.author === currentUser.username && (
                  <Link type="button" to={`/form-recipe/${recipeId}`} className="single-card__button">
                    Редактировать рецепт
                  </Link>
                )}
              </li>
            </ul>
          </div>
          <ul className="single-card__items">
            <li className="single-card__item">
              {purchaseId ? (
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
                  blue
                  disabled={!currentUser.username || purchaseLoading}
                />
              )}
            </li>
            {renderSubscribeButton()}
          </ul>
          <div className="single-card__section">
            <h3 className="single-card__section-title">Ингридиенты:</h3>
            <div className="single-card__items single-card__items_column">
              {renderIngredients(recipe.ingredient)}
            </div>
          </div>
          <div className="single-card__section">
            <h3 className="single-card__section-title">Описание:</h3>
            <p className=" single-card__section-text">{recipe.description}</p>
          </div>
        </div>
      </div>
    ) : (
      <Preloader />
    )
  );
}

export default SingleRecipePage;
