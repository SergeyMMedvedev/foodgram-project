import React from 'react';
import './Favorite.css';
import CardList from '../CardList/CardList';
import Card from '../Card/Card';
import Pagination from '../Pagination/Pagination';

function Favorite({
  onAddToFavorites,
  onDeleteFromFavorites,
  onAddPurchase,
  favoritesPagination,
  recipes,
  getFavoritesRecipes,
  header,
  renderMainHeader,
}) {
  return (
    <>
      {renderMainHeader(header)}
      <CardList>
        {recipes.map((recipe) => (
          <Card
            key={`card__${recipe.id}`}
            favoriteRecipesPage
            subscribers={recipe.subscribers}
            recipeId={recipe.id}
            recipeName={recipe.name}
            tags={recipe.tag}
            cookingTime={recipe.cooking_time}
            author={recipe.author}
            onAddToFavorites={onAddToFavorites}
            onDeleteFromFavorites={onDeleteFromFavorites}
            onAddPurchase={onAddPurchase}
            pagination={favoritesPagination}
          />
        ))}
      </CardList>
      <Pagination
        pagination={favoritesPagination}
        getItems={getFavoritesRecipes}
      />
    </>
  );
}

export default Favorite;
