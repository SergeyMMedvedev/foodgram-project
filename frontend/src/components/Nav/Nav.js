import React from 'react';
import './Nav.css';
import { NavLink } from 'react-router-dom';

function Nav({ isLoggedIn, onExit, purchasesRecipes }) {
  return (
    <nav className="nav">
      <div className="nav__container container">
        {isLoggedIn ? (
          <ul className="nav__items list">
            <li className="nav__item"><NavLink exact to="/" activeClassName="nav__link_active" className="nav__link link">Рецепты</NavLink></li>
            <li className="nav__item"><NavLink to="/my-follow" activeClassName="nav__link_active" className="nav__link link">Мои подписки</NavLink></li>
            <li className="nav__item"><NavLink to="/form-recipe" activeClassName="nav__link_active" className="nav__link link">Создать рецепт</NavLink></li>
            <li className="nav__item"><NavLink to="/favorite" activeClassName="nav__link_active" className="nav__link link">Избранное</NavLink></li>
            <li className="nav__item">
              <NavLink to="/shop-list" activeClassName="nav__link_active" className="nav__link link">Список покупок</NavLink>
              <span className="badge badge_style_blue nav__badge" id="counter">
                {purchasesRecipes.length || ''}
              </span>
            </li>
          </ul>
        ) : (
          <ul className="nav__items list">
            <li className="nav__item nav__item_disabled"><NavLink exact to="/" activeClassName="nav__link_active" className="nav__link link">Рецепты</NavLink></li>
            <li className="nav__item nav__item_disabled"><NavLink to="/shop-list" activeClassName="nav__link_active" className="nav__link link">Список покупок</NavLink></li>
          </ul>
        )}
        {isLoggedIn ? (
          <ul className="nav__items list">
            <li className="nav__item"><NavLink to="/change-password" activeClassName="nav__link_active" className="nav__link link">Изменить пароль</NavLink></li>
            <li className="nav__item"><NavLink to="/signin" onClick={onExit} activeClassName="nav__link_active" className="nav__link link">Выход</NavLink></li>
          </ul>
        ) : (
          <ul className="nav__items list">
            <li className="nav__item"><NavLink activeClassName="nav__link_active" to="/signin" className="nav__link link">Войти</NavLink></li>
            <li className="nav__item"><NavLink activeClassName="nav__link_active" to="/signup" className="button button_style_blue">Создать аккаунт</NavLink></li>
          </ul>
        )}
      </div>
    </nav>
  );
}

export default Nav;
