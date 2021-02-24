import React from 'react';
import './Main.css';

import Tags from '../Tags/Tags';
import CardList from '../CardList/CardList';

function Main() {
  return (
    <main className="main container">
      <div className="main__header">
        <h1 className="main__title">Рецепты</h1>
        <Tags />
      </div>
      <CardList />
    </main>
  );
}

export default Main;
