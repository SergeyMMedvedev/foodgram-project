import React from 'react';
import './MyFollow.css';
import CardList from '../CardList/CardList';
import CardUser from '../CardUser/CardUser';
import Pagination from '../Pagination/Pagination';

function MyFollow({
  onUnsubscribe,
  subscriptions,
  getSubscriptions,
  subscriptionsPagination,
  header,
  renderMainHeader,
}) {
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
