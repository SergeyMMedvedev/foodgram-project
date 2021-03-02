import React from 'react';
import './ShopList.css';
import CardList from '../CardList/CardList';
import ShopListItem from '../ShopListItem/ShopListItem';
import Button from '../Button/Button';

function ShopList({
  purchasesRecipes,
  purchases,
  onDeletePurchase,
  onDownload,
  header,
  renderMainHeader,
}) {
  function handleDownload() {
    onDownload(purchases);
  }

  return (
    <>
      {renderMainHeader(header)}
      <CardList column>
        <ul className="shopping-list">
          {purchasesRecipes.map((recipe, i) => (
            <ShopListItem
              key={purchases[i] && purchases[i].id}
              recipe={recipe}
              purchaseId={purchases[i] && purchases[i].id}
              onDeletePurchase={onDeletePurchase}
            />
          ))}
        </ul>

        <Button
          blue
          text="Скачать список"
          onClick={handleDownload}
          disabled={purchasesRecipes.length < 1}
        />

      </CardList>
    </>
  );
}

export default ShopList;
