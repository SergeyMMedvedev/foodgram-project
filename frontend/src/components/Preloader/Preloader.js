import React from 'react';
import './Preloader.css';

function Preloader() {
  return (
    <div className="circle-preloader">
      <div className="circle-preloader__body spinner-box">
        <div className="circle-preloader__border">
          <div className="circle-preloader__core" />
        </div>
      </div>
      <p className="circle-preloader__text">Загрузка рецепта...</p>
    </div>
  );
}

export default Preloader;
