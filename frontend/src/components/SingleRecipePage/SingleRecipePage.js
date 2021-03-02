import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import './SingleRecipePage.css';
import testCardImg from '../../images/testCardImg.png';
import api from '../../utils/Api';
import renderTags from '../../utils/renderTags';
import CurrentUserContext from '../../context/CurrentUserContext';
import IconFavorite from '../../ui/iconFavorite/iconFavorite';

function SingleRecipePage({
  onSubscribe,
  subscriptions,
  onUnsubscribe,
  onAddToFavorites,
  onDeleteFromFavorites,
  onAddPurchase,
}) {
  const { recipeId } = useParams();
  const [recipe, setRecipe] = useState({});
  const [isUserIsSubscribed, setIsUserIsSubscribed] = useState(null);
  const currentUser = useContext(CurrentUserContext);
  const [isCardFavorite, setIsCardFavorite] = useState(false);

  function getRecipeData(id) {
    api.getRecipe(id)
      .then((data) => {
        setRecipe(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleAddToPurchase() {
    onAddPurchase(recipeId);
  }

  function handleAddToFavorites() {
    onAddToFavorites(recipeId);
    getRecipeData(recipeId);
  }

  function handleRemoveFromFavorites() {
    onDeleteFromFavorites(recipeId);
    getRecipeData(recipeId);
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
        console.log(err);
      });
  }

  useEffect(() => {
    getRecipeData(recipeId);
  }, [recipeId]);

  useEffect(() => {
    if (currentUser.name) {
      if (recipe.subscribers) {
        const isSaved = recipe.subscribers.some((item) => (
          item.username === currentUser.username
        ));
        setIsCardFavorite(isSaved);
      }
    }
  }, [recipe, currentUser.username]);

  useEffect(() => {
    if (currentUser.name) {
      api.getSubscriptions({ author: `&author=${recipe.author}` })
        .then((data) => {
          if (data.results) setIsUserIsSubscribed(data.results.length > 0);
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
    if (currentUser.name && currentUser.name !== recipe.author) {
      if (isUserIsSubscribed === null) {
        return (
          <li className="single-card__item">
            <button
              type="button"
              className="button button_style_light-blue button_size_subscribe"
              name="subscribe"
              data-out
              disabled
            >
              Загрузка...
            </button>
          </li>
        );
      }
      if (isUserIsSubscribed) {
        return (
          <li className="single-card__item">
            <button
              type="button"
              className="button button_style_light-blue button_size_subscribe"
              name="subscribe"
              data-out
              onClick={handleUnSubscribe}
            >
              Отписаться
            </button>
          </li>
        );
      }
      return (
        <li className="single-card__item">
          <button
            type="button"
            className="button button_style_light-blue button_size_subscribe"
            name="subscribe"
            data-out
            onClick={handleSubscribe}
          >
            Подписаться на автора
          </button>
        </li>
      );
    }
    return <li className="single-card__item"><div className="button_size_subscribe" /></li>;
  }

  return (
    <div className="single-card" data-id={`recipe__${recipeId}`} data-author={recipe.author}>
      <img src={testCardImg} alt={recipe.name} className="single-card__image" />
      <div className="single-card__info">
        <div className="single-card__header-info">
          <h1 className="single-card__title">{recipe.name}</h1>
          <div className="single-card__favorite">
            <button onClick={isCardFavorite ? handleRemoveFromFavorites : handleAddToFavorites} type="button" className="button button_style_none" name="favorites" data-out>
              <IconFavorite
                big
                active={isCardFavorite}
              />
            </button>
            <div className="single-card__favorite-tooltip tooltip">Добавить в избранное</div>
          </div>
        </div>
        <ul className="single-card__items">
          {renderTags(recipe.tags)}
        </ul>
        <div className="single-card__items single-card__items_column">
          <p className="single-card__text">
            <span className="icon-time" />
            {` ${recipe.cooking_time} мин.`}
          </p>
          <ul className="single-card__items">
            <li className="single-card__item">
              <p className="single-card__text">
                <span className="icon-user" />
                {recipe.author}
              </p>
            </li>
            <li className="single-card__item">
              {recipe.author === currentUser.name && (
                <Link type="button" to={`/form-recipe/${recipeId}`} className="single-card__button">
                  Редактировать рецепт
                </Link>
              )}
            </li>
          </ul>
        </div>
        <ul className="single-card__items">
          <li className="single-card__item">
            <button onClick={handleAddToPurchase} type="button" className="button button_style_blue" name="purchases" data-out>
              <span className="icon-plus" />
              Добавить в покупки
            </button>
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
  );
}

export default SingleRecipePage;
