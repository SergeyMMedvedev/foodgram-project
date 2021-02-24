import React from 'react';
import './Favorite.css';
import CardList from '../CardList/CardList';
import Card from '../Card/Card';
import Pagination from '../Pagination/Pagination';

function Favorite() {
  return (
    <>
      <CardList>
        <Card
          dataId="120"
        />
        <Card
          dataId="121"
        />
        <Card
          dataId="122"
        />
        <Card
          dataId="123"
        />
        <Card
          dataId="124"
        />
      </CardList>
      <Pagination />
    </>
  );
}

export default Favorite;
