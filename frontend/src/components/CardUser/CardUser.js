import React from 'react';
import './CardUser.css';
import testCardImg from '../../images/testCardImg.png';
import Recipe from '../Recipe/Recipe';

function CardUser({ dataAuthor }) {
  return (
    <>
      <div className="card-user" data-author={dataAuthor}>
        <div className="card-user__header">
          <h2 className="card-user__title">Вероника Чернова</h2>
        </div>
        <div className="card-user__body">
          <ul className="card-user__items">
            <li className="card-user__item">
              <Recipe />
            </li>
            <li className="card-user__item">
              <div className="recipe">
                <img src={testCardImg} alt="какой-то-текст" className="recipe__image" />
                <h3 className="recipe__title">Французские тосты</h3>
                <p className="recipe__text">
                  <span className="icon-time" />
                  20 мин.
                </p>
              </div>
            </li>
            <li className="card-user__item">
              <div className="recipe">
                <img src={testCardImg} alt="какой-то-текст" className="recipe__image" />
                <h3 className="recipe__title">Французские тосты</h3>
                <p className="recipe__text">
                  <span className="icon-time" />
                  20 мин.
                </p>
              </div>
            </li>
            <li className="card-user__item">
              <a href="#" className="card-user__link link">Еще 7 рецептов...</a>
            </li>
          </ul>
        </div>
        <div className="card-user__footer">
          <button type="button" className="button button_style_light-blue button_size_auto" name="subscribe">
            Отписаться
          </button>
        </div>
      </div>
    </>
  );
}

export default CardUser;
