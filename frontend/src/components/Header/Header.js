import React from 'react';
import Nav from '../Nav/Nav';

function Header({ isLoggedIn, onExit, purchases }) {
  return (
    <header className="header">
      <Nav
        isLoggedIn={isLoggedIn}
        onExit={onExit}
        purchases={purchases}
      />
    </header>
  );
}

export default Header;
