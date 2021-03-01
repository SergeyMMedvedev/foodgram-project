import React from 'react';
import './MyFollow.css';
import CardList from '../CardList/CardList';
import CardUser from '../CardUser/CardUser';
import Pagination from '../Pagination/Pagination';
// import api from '../../utils/Api';

function MyFollow({
  onUnsubscribe,
  subscriptions,
  getSubscriptions,
  subscriptionsPagination,
  header,
  renderMainHeader,
}) {
  console.log('subscriptions', subscriptions);
  return (
    <>
      {renderMainHeader(header)}
      <CardList>
        {subscriptions.map((subscription) => (
          <CardUser
            key={subscription.id}
            onUnsubscribe={onUnsubscribe}
            subscription={subscription}
            pagination={subscriptionsPagination}
          />
        ))}
      </CardList>
      <Pagination
        pagination={subscriptionsPagination}
        getItems={getSubscriptions}
      />
    </>
  );
}

export default MyFollow;
