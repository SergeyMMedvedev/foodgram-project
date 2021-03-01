import React from 'react';
import { Route, useHistory } from 'react-router-dom';

const ProtectedRout = ({ component: Component, ...props }) => {
  const { path } = props;
  const history = useHistory();

  return (
    <Route exact path={path}>
      {
        // eslint-disable-next-line
        () => (localStorage.getItem('token') ? <Component {...props} /> : history.push('/', {noAuthRedirect: true}))
      }
    </Route>
  );
};

export default ProtectedRout;
