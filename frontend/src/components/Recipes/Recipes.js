import React from 'react';
import './Recipes.css';
import CardList from '../CardList/CardList';
import Card from '../Card/Card';
import Pagination from '../Pagination/Pagination';

function Recipes({
  recipes,
  favoriteRecipes,
  onAddToFavorites,
  onDeleteFromFavorites,
  onAddPurchase,
  recipesPagination,
  getRecipes,
}) {
  return (
    <>
      <CardList>
        {recipes.map((recipe) => (
          <Card
            key={`card__${recipe.id}`}
            allRecipes
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
          />
        ))}
      </CardList>
      <Pagination
        pagination={recipesPagination}
        getItems={getRecipes}
      />
    </>
  );
}

export default Recipes;
