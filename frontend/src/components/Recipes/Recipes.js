import React from 'react';
import './Recipes.css';
import CardList from '../CardList/CardList';
import Card from '../Card/Card';
import Pagination from '../Pagination/Pagination';

function Recipes({ recipes }) {
  return (
    <>
      <CardList>
        {recipes.map((recipe) => (
          <Card
            key={`card__${recipe.id}`}
            recipe={recipe}
            recipeId={recipe.id}
            recipeName={recipe.name}
            tags={recipe.tag}
            cookingTime={recipe.cooking_time}
            author={recipe.author}
          />
        ))}
      </CardList>
      <Pagination />
    </>
  );
}

export default Recipes;
