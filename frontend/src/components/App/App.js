import React, { useState, useEffect } from 'react';

import {
  Route,
  Switch,
  Redirect,
  useHistory,
} from 'react-router-dom';

import './App.css';
import Header from '../Header/Header';
// import Main from '../Main/Main';
import Footer from '../Footer/Footer';
import Tags from '../Tags/Tags';
import Recipes from '../Recipes/Recipes';
import FormReg from '../FromReg/FormReg';
import FormAuth from '../FormAuth/FormAuth';
import FormResetPassword from '../FormResetPassword/FormResetPassword';
import FormChangePassword from '../FormChangePassword/FormChangePassword';
import MyFollow from '../MyFollow/MyFollow';
import FormRecipe from '../FormRecipe/FormRecipe';
import Favorite from '../Favorite/Favorite';
import ShopList from '../ShopList/ShopList';
import SingleRecipePage from '../SingleRecipePage/SingleRecipePage';

import api from '../../utils/Api';
import auth from '../../utils/Auth';

import CurrentUserContext from '../../context/CurrentUserContext';

function App() {
  const history = useHistory();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const [currentUser, setCurrentUser] = useState({});

  function renderMainHeader(header) {
    return (
      <div className="main__header">
        <h1 className="main__title">{header}</h1>
        {(['Рецепты', 'Избранное'].includes(header)) && <Tags />}
      </div>
    );
  }

  function handleRegistrationSubmit(name, username, email, password) {
    auth.register(name, username, email, password)
      .then((newUserInfo) => {
        if (newUserInfo.token) {
          localStorage.setItem('token', newUserInfo.token);
          api.headers.Authorization = `Token ${newUserInfo.token}`;
          setCurrentUser({
            name: newUserInfo.first_name,
            username: newUserInfo.username,
            email: newUserInfo.email,
          });
          setIsLoggedIn(true);
          history.push('/');
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleExit() {
    localStorage.removeItem('token');
    setCurrentUser({});
    setIsLoggedIn(false);
    history.push('/signin');
  }

  function tokenCheck() {
    const token = localStorage.getItem('token');
    if (token) {
      auth.getContent(token)
        .then((user) => {
          if (user) {
            setCurrentUser({
              name: user.first_name,
              username: user.username,
              email: user.email,
            });
            setIsLoggedIn(true);
            api.headers.Authorization = `Token ${token}`;
          }
        })
        .catch((e) => {
          localStorage.removeItem('jwt');
          setCurrentUser({});
          setIsLoggedIn(false);
          history.push('/signin');
          console.log(e);
        });
    } else {
      localStorage.removeItem('jwt');
      setCurrentUser({});
      setIsLoggedIn(false);
    }
  }

  useEffect(() => {
    tokenCheck();
  }, []);

  function handleLoginSubmit(username, password) {
    auth.authorize(username, password)
      .then((data) => {
        if (data.token) {
          auth.getContent(data.token)
            .then((user) => {
              localStorage.setItem('token', data.token);
              api.headers.Authorization = `Token ${data.token}`;
              setCurrentUser({
                name: user.first_name,
                username: user.username,
                email: user.email,
              });
              setIsLoggedIn(true);
              history.push('/');
            });
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }

  function handleRecipeSubmit(recipe, formElem) {
    console.log('app handleRecipeSubmit');
    console.log('recipe.ingredient', recipe.ingredient);
    formElem.append('ingredient', JSON.stringify(recipe.ingredient));
    formElem.append('tag', JSON.stringify(recipe.tag));
    api.postRecipe(recipe, formElem)
      .then((respose) => {
        console.log(respose);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  useEffect(() => {
    api.getRecipes()
      .then((data) => {
        setRecipes(data);
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [isLoggedIn]);

  return (
    <>
      <CurrentUserContext.Provider value={currentUser}>
        <Header
          isLoggedIn={isLoggedIn}
          onExit={handleExit}
        />
        <main className="main container">

          <Switch>
            <Route exact path="/">
              {renderMainHeader('Рецепты')}
              <Recipes
                recipes={recipes}
              />
            </Route>

            <Route path="/signup">
              {renderMainHeader('Регистрация')}
              <FormReg
                onSubmit={handleRegistrationSubmit}
              />
            </Route>

            <Route path="/signin">
              {renderMainHeader('Войти на сайт')}
              <FormAuth
                onSubmit={handleLoginSubmit}
              />
            </Route>

            <Route path="/reset-password">
              {renderMainHeader('Сброс пароля')}
              <FormResetPassword />
            </Route>

            <Route path="/change-password">
              {renderMainHeader('Изменить пароль')}
              <FormChangePassword />
            </Route>

            <Route path="/my-follow">
              {renderMainHeader('Мои подписки')}
              <MyFollow />
            </Route>

            <Route path="/form-recipe">
              {renderMainHeader('Создание рецепта')}
              <FormRecipe
                onSubmit={handleRecipeSubmit}
              />
            </Route>

            <Route path="/favorite">
              {renderMainHeader('Избранное')}
              <Favorite />
            </Route>

            <Route path="/shop-list">
              {renderMainHeader('Список покупок')}
              <ShopList />
            </Route>

            <Route path="/single-page/:recipeId">
              <SingleRecipePage />
            </Route>

            <Route>
              <Redirect to="/" />
            </Route>

          </Switch>
        </main>
        <Footer />
      </CurrentUserContext.Provider>
    </>
  );
}

export default App;
