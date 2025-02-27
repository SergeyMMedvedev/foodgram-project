import React from 'react';
import { Link } from 'react-router-dom';
import './ShopList.css';
import CardList from '../CardList/CardList';
import ShopListItem from '../ShopListItem/ShopListItem';
import Button from '../Button/Button';

function ShopList({
  // purchasesRecipes,
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
      {purchases.length < 1 ? (
        <Link to="/" className="shopping-list__return-button">
          Добавить покупки
        </Link>
      ) : (

        <CardList column>
          <ul className="shopping-list">
            {purchases.map((purchaseData) => (
              <ShopListItem
                key={purchaseData.id}
                recipe={purchaseData.purchase}
                purchaseId={purchaseData.id}
                onDeletePurchase={onDeletePurchase}
              />
            ))}
          </ul>

          <Button
            blue
            text="Скачать список"
            onClick={handleDownload}
            disabled={purchases.length < 1}
          />

        </CardList>

      )}
    </>
  );
}

export default React.memo(ShopList);
