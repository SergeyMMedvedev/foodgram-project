import React from 'react';
import './Recipes.css';
import CardList from '../CardList/CardList';
import Card from '../Card/Card';
import Pagination from '../Pagination/Pagination';

function Recipes({
  recipes,
  onAddToFavorites,
  onDeleteFromFavorites,
  // favoriteData,
}) {
  return (
    <>
      <CardList>
        {recipes.map((recipe) => (
          <Card
            key={`card__${recipe.id}`}
            allRecipes
            recipeId={recipe.id}
            recipeName={recipe.name}
            tags={recipe.tag}
            cookingTime={recipe.cooking_time}
            author={recipe.author}
            onAddToFavorites={onAddToFavorites}
            onDeleteFromFavorites={onDeleteFromFavorites}
            // favoriteData={favoriteData}
          />
        ))}
      </CardList>
      <Pagination />
    </>
  );
}

export default Recipes;
