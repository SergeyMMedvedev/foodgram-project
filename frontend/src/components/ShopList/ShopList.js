import React, { useEffect } from 'react';
import './ShopList.css';
import CardList from '../CardList/CardList';
import ShopListItem from '../ShopListItem/ShopListItem';
import Button from '../Button/Button';

function ShopList({
  purchasesRecipes,
  purchases,
  onDeletePurchase,
  onDownload,
}) {
  useEffect(() => {
    console.log(purchases);
    console.log(purchasesRecipes);
    purchasesRecipes.forEach((recipe, i) => {
      console.log('recipe', recipe);
      console.log('i', i);
      console.log('purchases[i]', purchases[i]);
      const purchaseId = purchases[i] && purchases[i].id;
      console.log('purchaseId', purchaseId);
    });
  }, [purchases]);

  function handleDownload() {
    console.log('handleDownload from ShopList');
    onDownload(purchases);
  }

  return (
    <>
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
