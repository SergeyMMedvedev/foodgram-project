import React from 'react';
import './Recipe.css';
import testCardImg from '../../images/testCardImg.png';

function Recipe() {
  return (
    <div className="recipe">
      <img src={testCardImg} alt="какой-то-текст" className="recipe__image" />
      <h3 className="recipe__title">Французские тосты</h3>
      <p className="recipe__text">
        <span className="icon-time" />
        {' 20 мин'}
      </p>
    </div>
  );
}

export default Recipe;
