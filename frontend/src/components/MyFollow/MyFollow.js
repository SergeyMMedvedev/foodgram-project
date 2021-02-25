import React from 'react';
import './MyFollow.css';
import CardList from '../CardList/CardList';
import CardUser from '../CardUser/CardUser';
import Pagination from '../Pagination/Pagination';
// import api from '../../utils/Api';

function MyFollow({ subscriptions }) {
  return (
    <>
      <CardList>
        {subscriptions.map((subscription) => (
          <CardUser
            key={subscription.id}
            subscription={subscription}
          />
        ))}
      </CardList>
      <Pagination />
    </>
  );
}

export default MyFollow;
