import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './CardUser.css';
import Recipe from '../Recipe/Recipe';
import api from '../../utils/Api';
import getNumberEnding from '../../utils/getEndingsOfNumber';
import { getCurrentPageNumberWithRemovingItems } from '../../utils/pagination';

function CardUser({
  onUnsubscribe,
  subscription,
  pagination,
}) {
  const [recipesList, setRecipesList] = useState([]);
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    api.getRecipes({ author: `&author__username=${subscription.author}` })
      .then((data) => {
        setRecipesList(data.results);
        setRecipes(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  function handleUnSubscribe() {
    onUnsubscribe({
      subscriptionId: subscription.id,
      page: getCurrentPageNumberWithRemovingItems(pagination),
    });
  }

  return (
    <>
      <div className="card-user" data-author={subscription.id}>
        <div className="card-user__header">
          <Link to={`/recipes/${subscription.author}`} className="card-user__title">{subscription.author}</Link>
        </div>
        <div className="card-user__body">
          <ul className="card-user__items">
            {recipesList.length > 0 ? (
              <>
                <>
                  {recipesList.slice(0, 3).map((recipe) => (
                    <li className="card-user__item" key={recipe.id}>
                      <Recipe
                        recipe={recipe}
                      />
                    </li>
                  ))}
                </>
                <>
                  {recipesList.slice(3).length > 0 && (
                    <li className="card-user__item">
                      <Link to={`/recipes/${subscription.author}`} className="card-user__link link">{`Еще ${(recipes.count - 3 > 0) && `${recipes.count - 3} ${getNumberEnding((recipes.count - 3))}`}...`}</Link>
                    </li>
                  )}
                </>
              </>
            ) : (
              <p className="card-user__text">у автора пока нет рецептов</p>
            )}
          </ul>
        </div>
        <div className="card-user__footer">
          <button onClick={handleUnSubscribe} type="button" className="button button_style_light-blue button_size_auto" name="subscribe">
            Отписаться
          </button>
        </div>
      </div>

    </>
  );
}

export default React.memo(CardUser);
