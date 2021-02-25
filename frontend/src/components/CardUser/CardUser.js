import React, { useEffect, useState } from 'react';
import './CardUser.css';
import Recipe from '../Recipe/Recipe';
import api from '../../utils/Api';
import getNumberEnding from '../../utils/getEndingsOfNumber';

function CardUser({ subscription }) {
  const [recipesList, setRecipesList] = useState([]);

  useEffect(() => {
    api.getRecipes(subscription.author)
      .then((recipes) => {
        setRecipesList(recipes);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <>
      {recipesList.length > 0 && (
        <div className="card-user" data-author={subscription.id}>
          <div className="card-user__header">
            <h2 className="card-user__title">{subscription.author}</h2>
          </div>
          <div className="card-user__body">
            <ul className="card-user__items">
              {recipesList.slice(0, 3).map((recipe) => (
                <li className="card-user__item" key={recipe.id}>
                  <Recipe
                    recipe={recipe}
                  />
                </li>
              ))}
              {recipesList.slice(3).length > 0 && (
                <li className="card-user__item">
                  <a href="#" className="card-user__link link">{`Еще ${recipesList.slice(3).length} ${getNumberEnding(recipesList.slice(3).length)}...`}</a>
                </li>
              )}
            </ul>
          </div>
          <div className="card-user__footer">
            <button type="button" className="button button_style_light-blue button_size_auto" name="subscribe">
              Отписаться
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default React.memo(CardUser);
