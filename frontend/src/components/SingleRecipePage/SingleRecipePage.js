import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import './SingleRecipePage.css';
import testCardImg from '../../images/testCardImg.png';
import api from '../../utils/Api';
import renderTags from '../../utils/renderTags';
import CurrentUserContext from '../../context/CurrentUserContext';

function SingleRecipePage({
  onSubscribe,
  subscriptions,
  onUnsubscribe,
}) {
  const { recipeId } = useParams();
  const [recipe, setRecipe] = useState({});
  const [isUserisSubscribed, setIsUserisSubscribed] = useState(false);
  const currentUser = useContext(CurrentUserContext);

  function handleSubscribe() {
    onSubscribe(recipe.author, setIsUserisSubscribed);
  }

  function handleUnSubscribe() {
    const currentSubscription = subscriptions.find((subscription) => (
      subscription.author === recipe.author
    ));
    onUnsubscribe(currentSubscription.id, setIsUserisSubscribed);
  }

  useEffect(() => {
    api.getRecipe(recipeId)
      .then((data) => {
        setRecipe(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [recipeId]);

  useEffect(() => {
    if (recipe.author) {
      const userFavoriteAuthorsNames = subscriptions.map((author) => (
        author.author
      ));
      setIsUserisSubscribed(userFavoriteAuthorsNames.includes(recipe.author));
    }
  }, [recipe, subscriptions]);

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
    if (currentUser.name !== recipe.author) {
      if (isUserisSubscribed) {
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
            <button type="button" className="button button_style_none" name="favorites" data-out>
              <span className="icon-favorite icon-favorite_big" />
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
              <a style={{ marginLeft: '2.5em' }} href="#" className="single-card__text">Редактировать рецепт</a>
            </li>
          </ul>
        </div>
        <ul className="single-card__items">
          <li className="single-card__item">
            <button type="button" className="button button_style_blue" name="purchases" data-out>
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
