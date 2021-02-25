import React from 'react';
import { Link } from 'react-router-dom';
import './Card.css';
import testCardImg from '../../images/testCardImg.png';
import renderTags from '../../utils/renderTags';

function Card({
  recipeId,
  recipeName,
  tags,
  cookingTime,
  author,
}) {
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
        <button type="button" className="button button_style_light-blue" name="purchases" data-out>
          <span className="icon-plus button__icon" />
          Добавить в покупки
        </button>
        <button type="button" className="button button_style_none" name="favorites" data-out>
          <span className="icon-favorite" />
        </button>
      </div>
    </div>
  );
}

export default Card;
