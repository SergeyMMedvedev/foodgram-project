import React from 'react';
import './ShopList.css';
import CardList from '../CardList/CardList';
import ShopListItem from '../ShopListItem/ShopListItem';
import Button from '../Button/Button';

function ShopList() {
  return (
    <>
      <CardList column>
        <ul className="shopping-list">
          <ShopListItem />
          <ShopListItem />
          <ShopListItem />
        </ul>
        <a className="shopping-list__link" href="#">
          <Button
            blue
            text="Скачать список"
          />
        </a>
      </CardList>
    </>
  );
}

export default ShopList;
