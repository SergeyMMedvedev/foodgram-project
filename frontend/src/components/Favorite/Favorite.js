import React, { useRef } from 'react';
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
  onDeletePurchase,
  purchases,
}) {
  const favoriteRecipesRef = useRef();
  return (
    <>
      {renderMainHeader(header)}
      <div ref={favoriteRecipesRef}>
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
              onDeletePurchase={onDeletePurchase}
              purchases={purchases}
            />
          ))}
        </CardList>
      </div>
      <Pagination
        pagination={favoritesPagination}
        getItems={getFavoritesRecipes}
        containerWithLoadableItemsRef={favoriteRecipesRef}
      />
    </>
  );
}

export default Favorite;
