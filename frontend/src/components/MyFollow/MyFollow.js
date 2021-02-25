import React from 'react';
import './MyFollow.css';
import CardList from '../CardList/CardList';
import CardUser from '../CardUser/CardUser';
import Pagination from '../Pagination/Pagination';
// import api from '../../utils/Api';

function MyFollow({ userFavoriteAuthors }) {
  return (
    <>
      <CardList>
        {userFavoriteAuthors.map((author) => (
          <CardUser
            key={author.id}
            author={author}
          />
        ))}
      </CardList>
      <Pagination />
    </>
  );
}

export default MyFollow;
