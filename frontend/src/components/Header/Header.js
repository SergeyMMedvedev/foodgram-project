import React from 'react';
import Nav from '../Nav/Nav';

function Header({ isLoggedIn, onExit, purchasesRecipes }) {
  return (
    <header className="header">
      <Nav
        isLoggedIn={isLoggedIn}
        onExit={onExit}
        purchasesRecipes={purchasesRecipes}
      />
    </header>
  );
}

export default Header;
