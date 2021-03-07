import React, { useRef } from 'react';
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
  setResponseError,
  setIsOpenInfoTooltip,
}) {
  const followsRef = useRef();
  return (
    <>
      {renderMainHeader(header)}
      <div ref={followsRef}>
        <CardList>
          {subscriptions.map((subscription) => (
            <CardUser
              key={subscription.id}
              onUnsubscribe={onUnsubscribe}
              subscription={subscription}
              pagination={subscriptionsPagination}
              setResponseError={setResponseError}
              setIsOpenInfoTooltip={setIsOpenInfoTooltip}
            />
          ))}
        </CardList>
      </div>
      <Pagination
        pagination={subscriptionsPagination}
        getItems={getSubscriptions}
        containerWithLoadableItemsRef={followsRef}
      />
    </>
  );
}

export default MyFollow;
