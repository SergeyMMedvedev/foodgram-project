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
  const [serverError, setServerError] = useState('');
  const [subscriptions, setSubscriptions] = useState([]);

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
          auth.headers.Authorization = `Token ${newUserInfo.token}`;
          setCurrentUser({
            name: newUserInfo.first_name,
            username: newUserInfo.username,
            email: newUserInfo.email,
          });
          setIsLoggedIn(true);
          setServerError('');
          history.push('/');
        }
      })
      .catch((err) => {
        setServerError(err);
        console.log(err);
      });
  }

  function handlePasswordChange(oldPassword, newPassword, newPasswordAgain) {
    auth.changePassword(oldPassword, newPassword, newPasswordAgain)
      .then(() => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        setCurrentUser({});
        setServerError('');
        history.push('/signin');
      })
      .catch((err) => {
        console.log(err);
        setServerError(err);
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
            setServerError('');
            api.headers.Authorization = `Token ${token}`;
            auth.headers.Authorization = `Token ${token}`;
            setIsLoggedIn(true);
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
    setIsLoggedIn(false);
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
              auth.headers.Authorization = `Token ${data.token}`;
              setCurrentUser({
                name: user.first_name,
                username: user.username,
                email: user.email,
              });
              setIsLoggedIn(true);
              setServerError('');
              history.push('/');
            });
        }
      })
      .catch((e) => {
        console.log(e);
        setServerError(e);
      });
  }

  function handleRecipeSubmit(recipe, formElem, token) {
    formElem.append('ingredient', JSON.stringify(recipe.ingredient));
    formElem.append('tag', JSON.stringify(recipe.tag));
    api.postRecipe(recipe, formElem, token)
      .then((respose) => {
        console.log('respose', respose);
        setServerError('');
        window.location.assign('/');
      })
      .catch((err) => {
        console.log('handleRecipeSubmit', err);
        setServerError(err);
      });
  }

  function getSubscriptions() {
    api.getSubscriptions()
      .then((subscriptionsData) => {
        setSubscriptions(subscriptionsData);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleSubscribe(author, setIsUserisSubscribed) {
    api.subscribe(author)
      .then(() => {
        setIsUserisSubscribed(true);
        getSubscriptions();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleUnsubscribe(subscriptionId, setIsUserisSubscribed) {
    api.unsubscribe(subscriptionId)
      .then(() => {
        getSubscriptions();
        setIsUserisSubscribed(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  useEffect(() => {
    api.getRecipes()
      .then((data) => {
        setRecipes(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [isLoggedIn]);

  useEffect(() => {
    if (isLoggedIn) {
      getSubscriptions();
    }
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
                serverError={serverError}
              />
            </Route>

            <Route path="/signin">
              {renderMainHeader('Войти на сайт')}
              <FormAuth
                onSubmit={handleLoginSubmit}
                serverError={serverError}
              />
            </Route>

            <Route path="/reset-password">
              {renderMainHeader('Сброс пароля')}
              <FormResetPassword />
            </Route>

            <Route path="/change-password">
              {renderMainHeader('Изменить пароль')}
              <FormChangePassword
                onSubmit={handlePasswordChange}
                serverError={serverError}
              />
            </Route>

            <Route path="/my-follow">
              {renderMainHeader('Мои подписки')}
              <MyFollow
                subscriptions={subscriptions}
                getSubscriptions={getSubscriptions}
              />
            </Route>

            <Route path="/form-recipe">
              {renderMainHeader('Создание рецепта')}
              <FormRecipe
                onSubmit={handleRecipeSubmit}
                serverError={serverError}
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
              <SingleRecipePage
                onSubscribe={handleSubscribe}
                onUnsubscribe={handleUnsubscribe}
                subscriptions={subscriptions}
              />
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
