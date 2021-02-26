import React, { useContext } from 'react';
import './Favorite.css';
import CardList from '../CardList/CardList';
import Card from '../Card/Card';
import Pagination from '../Pagination/Pagination';
import { CurrentFavoriteRecipes } from '../../context/CurrentFavoriteRecipesContext';

function Favorite({
  onAddToFavorites,
  onDeleteFromFavorites,
  onAddPurchase,
  favoritesPagination,
}) {
  const recipes = useContext(CurrentFavoriteRecipes);

  return (
    <>
      <CardList>
        {recipes.map((recipe) => (
          <Card
            key={`card__${recipe.id}`}
            recipeId={recipe.id}
            recipeName={recipe.name}
            tags={recipe.tag}
            cookingTime={recipe.cooking_time}
            author={recipe.author}
            onAddToFavorites={onAddToFavorites}
            onDeleteFromFavorites={onDeleteFromFavorites}
            onAddPurchase={onAddPurchase}
          />
        ))}
      </CardList>
      <Pagination
        pagination={favoritesPagination}
      />
    </>
  );
}

export default Favorite;
