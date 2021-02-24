import React from 'react';
import Nav from '../Nav/Nav';

function Header({ isLoggedIn, onExit }) {
  return (
    <header className="header">
      <Nav
        isLoggedIn={isLoggedIn}
        onExit={onExit}
      />
    </header>
  );
}

export default Header;
