import React from 'react';
import { Link } from 'react-router-dom';
import './Recipe.css';
import testCardImg from '../../images/testCardImg.png';

function Recipe({ recipe }) {
  return (
    <div className="recipe">
      <Link to={`/single-page/${recipe.id}`} className="recipe__image-link link">
        <img src={testCardImg} alt={recipe.name} className="recipe__image" />
      </Link>
      <Link to={`/single-page/${recipe.id}`} className="recipe__title-link link">
        <h3 className="recipe__title">{recipe.name}</h3>
      </Link>
      <p className="recipe__text">
        <span className="icon-time" />
        {recipe.cooking_time}
      </p>
    </div>
  );
}

export default React.memo(Recipe);
