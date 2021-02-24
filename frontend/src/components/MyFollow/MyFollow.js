import React from 'react';
import './MyFollow.css';
import CardList from '../CardList/CardList';
import CardUser from '../CardUser/CardUser';
import Pagination from '../Pagination/Pagination';

function MyFollow() {
  return (
    <>
      <CardList>
        <CardUser />
        <CardUser />
        <CardUser />
        <CardUser />
        <CardUser />
      </CardList>
      <Pagination />
    </>
  );
}

export default MyFollow;
