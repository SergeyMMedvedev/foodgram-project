import React, {
  useEffect,
  useContext,
  useState,
  useRef,
} from 'react';
import { useParams } from 'react-router-dom';
import './Recipes.css';
import CardList from '../CardList/CardList';
import Card from '../Card/Card';
import Pagination from '../Pagination/Pagination';
import CurrentUserContext from '../../context/CurrentUserContext';
import Button from '../Button/Button';
import api from '../../utils/Api';

function Recipes({
  recipes,
  favoriteRecipes,
  onAddToFavorites,
  onDeleteFromFavorites,
  onAddPurchase,
  recipesPagination,
  getRecipes,
  onAuthorClick,
  selectedAuthor,
  setSelectedAuthor,
  onSubscribe,
  onUnsubscribe,
  subscriptions,
}) {
  const params = useParams();
  const currentUser = useContext(CurrentUserContext);
  const [isUserIsSubscribed, setIsUserIsSubscribed] = useState(null);
  const recipesRef = useRef();

  function handleSubscribe() {
    onSubscribe(params.author, setIsUserIsSubscribed);
  }

  function handleUnSubscribe() {
    api.getSubscriptions({ author: `&author=${params.author}` })
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
    if (params.author && currentUser.name) {
      api.getSubscriptions({ author: `&author=${params.author}` })
        .then((data) => {
          if (data.results) setIsUserIsSubscribed(data.results.length > 0);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [currentUser, params.author, subscriptions]);

  useEffect(() => {
    if (params.author) {
      setSelectedAuthor(`&author__username=${params.author}`);
    }
  }, [setSelectedAuthor, params, params.author]);

  return (
    <>
      {(params.author && params.author !== currentUser.name) && (
        isUserIsSubscribed ? (
          <div className="recipe__button-container">
            <Button
              lightBlue
              text="Отписаться"
              onClick={handleUnSubscribe}
            />
          </div>
        ) : (
          <div className="recipe__button-container">
            <Button
              lightBlue
              text="Подписаться на автора"
              onClick={handleSubscribe}
            />
          </div>
        )
      )}
      <div ref={recipesRef}>
        <CardList>
          {recipes.map((recipe) => (
            <Card
              key={`card__${recipe.id}`}
              allRecipesPage
              subscribers={recipe.subscribers}
              recipeId={recipe.id}
              recipeName={recipe.name}
              tags={recipe.tag}
              cookingTime={recipe.cooking_time}
              author={recipe.author}
              onAddToFavorites={onAddToFavorites}
              onDeleteFromFavorites={onDeleteFromFavorites}
              onAddPurchase={onAddPurchase}
              favoriteRecipes={favoriteRecipes}
              pagination={recipesPagination}
              onAuthorClick={onAuthorClick}
              selectedAuthor={selectedAuthor}
            />
          ))}
        </CardList>
      </div>
      <Pagination
        pagination={recipesPagination}
        getItems={getRecipes}
        selectedAuthor={selectedAuthor}
        containerWithLoadableItemsRef={recipesRef}
      />

    </>
  );
}

export default Recipes;
