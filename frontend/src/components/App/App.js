import React, { useState, useEffect } from 'react';

import {
  Route,
  Switch,
  Redirect,
  useHistory,
} from 'react-router-dom';

import './App.css';
import '../appearAnimation/appearAnimation.css';
import Header from '../Header/Header';
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
import ProtectedRoute from '../ProtectedRoute/ProtectedRoute';
import InfoTooltip from '../InfoTooltip/InfoTooltip';

import api from '../../utils/Api';
import auth from '../../utils/Auth';

import CurrentUserContext from '../../context/CurrentUserContext';
import downloadAsFile from '../../utils/downloadFile';

function App() {
  const history = useHistory();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const [authorRecipes, setAuthorRecipes] = useState([]);
  const [authorRecipesPagination, setAuthorRecipesPagination] = useState({});
  const [selectedAuthor, setSelectedAuthor] = useState('');
  const [resetPasswordResponse, setResetPasswordResponse] = useState('');
  const [recipesPagination, setRecipesPagination] = useState({});
  const [favoritesPagination, setFavoritesPagination] = useState({});
  const [currentUser, setCurrentUser] = useState({});
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);
  const [serverError, setServerError] = useState('');
  const [subscriptions, setSubscriptions] = useState([]);
  const [subscriptionsPagination, setSubscriptionsPagination] = useState({});
  const [purchases, setPurchases] = useState([]);

  const [tagBreakfast, setTagBreakfast] = useState('');
  const [tagDinner, setTagDinner] = useState('');
  const [tagSupper, setTagSupper] = useState('');

  const [isOpenInfoTooltip, setIsOpenInfoTooltip] = useState(false);
  const [responseError, setResponseError] = useState('');

  function closeAllPopups() {
    setIsOpenInfoTooltip(false);
  }

  useEffect(() => {
    function handleEscClose(evt) {
      if (evt.key === 'Escape') {
        closeAllPopups();
      }
    }
    document.addEventListener('keydown', handleEscClose);
    return () => {
      document.removeEventListener('keydown', handleEscClose);
    };
  }, []);

  // Users
  function tokenCheck() {
    const token = localStorage.getItem('token');
    if (token) {
      auth.getContent(token)
        .then((user) => {
          if (user) {
            api.headers.Authorization = `Token ${token}`;
            auth.headers.Authorization = `Token ${token}`;
            setCurrentUser({
              name: user.first_name,
              username: user.username,
              email: user.email,
            });
            setServerError('');
            setIsLoggedIn(true);
          }
        })
        .catch((err) => {
          localStorage.removeItem('jwt');
          setCurrentUser({});
          setIsLoggedIn(false);
          history.push('/signin');
          // setResponseError(err);
          // setIsOpenInfoTooltip(true);
          console.log(err);
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

  function handleRegistrationSubmit(name, username, email, password, setLoading) {
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
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function handleLoginSubmit(username, password, setLoading) {
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
        setServerError(e);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function handlePasswordChange(oldPassword, newPassword, newPasswordAgain, setLoading) {
    auth.changePassword(oldPassword, newPassword, newPasswordAgain)
      .then(() => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        setCurrentUser({});
        setServerError('');
        history.push('/signin');
      })
      .catch((err) => {
        setServerError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function handlePasswordReset(email, setLoading) {
    auth.resetPassword(email)
      .then((data) => {
        setResetPasswordResponse(data);
        setServerError('');
      })
      .catch((err) => {
        setServerError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function handleExit() {
    localStorage.removeItem('token');
    setCurrentUser({});
    setIsLoggedIn(false);
    history.push('/signin');
  }
  // End users

  // Recipes

  function getRecipes(params) {
    const {
      page,
      author,
      loadedElementsContainer,
    } = params;
    api.getRecipes({
      page,
      author,
      tagBreakfast,
      tagDinner,
      tagSupper,
    })
      .then((data) => {
        if (author) {
          setAuthorRecipes(data.results);
          setAuthorRecipesPagination({
            count: data.count,
            next: data.next,
            previous: data.previous,
          });
        } else {
          setRecipes(data.results);
          setRecipesPagination({
            count: data.count,
            next: data.next,
            previous: data.previous,
          });
        }
        if (loadedElementsContainer) {
          loadedElementsContainer.classList.remove('disappearAnimation');
          loadedElementsContainer.classList.add('appearAnimation');
        }
      })
      .catch((err) => {
        setResponseError(err);
        setIsOpenInfoTooltip(true);
      });
  }

  function handleDeleteRecipe(recipeId) {
    api.deleteRecipe(recipeId)
      .then(() => {
        window.location.assign('/');
        setServerError('');
      })
      .catch((err) => {
        setServerError(err);
      });
  }

  function handleRecipeSubmit(recipe, formElem, token) {
    formElem.append('ingredient', JSON.stringify(recipe.ingredient));
    formElem.append('tag', JSON.stringify(recipe.tag));
    api.postRecipe(recipe, formElem, token)
      .then(() => {
        setServerError('');
        window.location.assign('/');
      })
      .catch((err) => {
        setServerError(err);
      });
  }

  function handleRecipeUpdate(recipe, formElem, token, recipeId, setLoading) {
    formElem.append('ingredient', JSON.stringify(recipe.ingredient));
    formElem.append('tag', JSON.stringify(recipe.tag));
    api.updateRecipe(formElem, token, recipeId)
      .then(() => {
        setServerError('');
        window.location.assign('/');
      })
      .catch((err) => {
        setServerError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function getSubscriptions(params) {
    const { page, loadedElementsContainer } = params;
    api.getSubscriptions({ page })
      .then((subscriptionsData) => {
        setSubscriptions(subscriptionsData.results);
        setSubscriptionsPagination({
          count: subscriptionsData.count,
          next: subscriptionsData.next,
          previous: subscriptionsData.previous,
        });
        if (loadedElementsContainer) {
          loadedElementsContainer.classList.remove('disappearAnimation');
          loadedElementsContainer.classList.add('appearAnimation');
        }
      })
      .catch((err) => {
        setResponseError(err);
        setIsOpenInfoTooltip(true);
      });
  }

  function handleSubscribe(author, setIsUserisSubscribed) {
    api.subscribe(author)
      .then(() => {
        setIsUserisSubscribed(true);
        getSubscriptions({});
      })
      .catch((err) => {
        setResponseError(err);
        setIsOpenInfoTooltip(true);
      });
  }

  function handleUnsubscribe(params) {
    const { subscriptionId, setIsUserisSubscribed, page } = params;
    api.unsubscribe(subscriptionId)
      .then(() => {
        getSubscriptions({ page });
        if (setIsUserisSubscribed) {
          setIsUserisSubscribed(false);
        }
      })
      .catch((err) => {
        setResponseError(err);
        setIsOpenInfoTooltip(true);
      });
  }

  function getFavoritesRecipes(params) {
    const {
      page,
      loadedElementsContainer,
    } = params;
    api.getFavoritesRecipes({
      page,
      tagBreakfast,
      tagDinner,
      tagSupper,
    })
      .then((favorites) => {
        const favoriteRiceps = [];
        favorites.results.forEach((item) => (
          favoriteRiceps.push(item.favorite)
        ));
        setFavoriteRecipes(favorites.results);
        setFavoritesPagination({
          count: favorites.count,
          next: favorites.next,
          previous: favorites.previous,
        });
        if (loadedElementsContainer) {
          loadedElementsContainer.classList.remove('disappearAnimation');
          loadedElementsContainer.classList.add('appearAnimation');
        }
      });
  }

  useEffect(() => {
    if (isLoggedIn) {
      getFavoritesRecipes({});
    }
  }, [isLoggedIn]);

  function getPurchases() {
    api.getPurchases()
      .then((purchasesData) => {
        setPurchases(purchasesData);
      })
      .catch((err) => {
        setResponseError(err);
        setIsOpenInfoTooltip(true);
      });
  }

  useEffect(() => {
    if (isLoggedIn) {
      getPurchases();
    }
  }, [isLoggedIn]);

  function handleAuthorClick(authorName) {
    getRecipes({ author: authorName });
  }

  function handleSetTagBreakfast() {
    setTagBreakfast(tagBreakfast ? '' : '&tag__name=завтрак');
  }

  function handleSetTagDinner() {
    setTagDinner(tagDinner ? '' : '&tag__name=обед');
  }

  function handleSetTagSupper() {
    setTagSupper(tagSupper ? '' : '&tag__name=ужин');
  }

  useEffect(() => {
    // запрашиваем отвильтрованные по тегам рецепты,
    // как для конкретного автора, так и для страницы со всеми рецептами и сохраненные рецепты
    // тогда установленный фильтр работает по всем страницам и выделенные теги актуальны
    if (selectedAuthor) {
      getRecipes({ author: selectedAuthor });
    }
    getRecipes({});
    if (isLoggedIn) {
      getFavoritesRecipes({});
    }
  }, [tagBreakfast, tagDinner, tagSupper]);

  function handleAddToPurchase(recipeId) {
    api.addPurchase(recipeId)
      .then(() => {
        getPurchases();
      })
      .catch((err) => {
        setResponseError(err);
        setIsOpenInfoTooltip(true);
      });
  }

  function handleDeletePurchase(purchaseId) {
    api.deletePurchase(purchaseId)
      .then(() => {
        getPurchases();
      })
      .catch((err) => {
        setResponseError(err);
        setIsOpenInfoTooltip(true);
      });
  }

  function handleAddToFavorites(recipeId, page, author, allRecipesPage, favoriteRecipesPage) {
    api.addToFavoritesRecipes(recipeId)
      .then(() => {
        getRecipes(allRecipesPage ? { page, author } : {});
        getFavoritesRecipes(favoriteRecipesPage ? { page } : {});
      })
      .catch((err) => {
        setResponseError(err);
        setIsOpenInfoTooltip(true);
      });
  }

  function handleRemoveFromFavorites(recipeId, page, author, allRecipesPage, favoriteRecipesPage) {
    api.deleteFromFavoritesRecipes(recipeId)
      .then(() => {
        getRecipes(allRecipesPage ? { page, author } : {});
        getFavoritesRecipes(favoriteRecipesPage ? { page } : {});
      })
      .catch((err) => {
        setResponseError(err);
        setIsOpenInfoTooltip(true);
      });
  }

  useEffect(() => {
    if (selectedAuthor) {
      getRecipes({ author: selectedAuthor });
    } else {
      getRecipes({});
    }
  }, [isLoggedIn, selectedAuthor]);

  useEffect(() => {
    if (isLoggedIn) {
      getSubscriptions({});
    }
  }, [isLoggedIn]);

  function handleDownloadClick(downloadPurchases) {
    api.download(downloadPurchases)
      .then((response) => {
        downloadAsFile(response);
      })
      .catch((err) => {
        setResponseError(err);
        setIsOpenInfoTooltip(true);
      });
  }

  function renderTitleName(currentAuthor) {
    return ` ${currentAuthor.replace('&author__username=', '')}`;
  }

  function renderMainHeader(header, currentAuthor) {
    return (
      <div className="main__header appearAnimation">
        <h1 className="main__title">
          {currentAuthor ? renderTitleName(currentAuthor) : header}
        </h1>
        {(['Рецепты', 'Избранное'].includes(header)) && (
          <Tags
            main
            onSetTagBreakfast={handleSetTagBreakfast}
            onSetTagTagDinner={handleSetTagDinner}
            onSetTagTagSupper={handleSetTagSupper}
            tagBreakfast={tagBreakfast}
            tagDinner={tagDinner}
            tagSupper={tagSupper}
          />
        )}
      </div>
    );
  }

  return (
    <>

      <CurrentUserContext.Provider value={currentUser}>
        <Header
          isLoggedIn={isLoggedIn}
          onExit={handleExit}
          purchases={purchases}
        />
        <main className="container main">

          <Switch>

            <Route exact path="/">
              {renderMainHeader('Рецепты')}
              <Recipes
                recipes={recipes}
                favoriteRecipes={favoriteRecipes}
                onAddToFavorites={handleAddToFavorites}
                onDeleteFromFavorites={handleRemoveFromFavorites}
                onAddPurchase={handleAddToPurchase}
                recipesPagination={recipesPagination}
                getRecipes={getRecipes}
                onAuthorClick={handleAuthorClick}
                setSelectedAuthor={setSelectedAuthor}
                onDeletePurchase={handleDeletePurchase}
                purchases={purchases}
                setResponseError={setResponseError}
                setIsOpenInfoTooltip={setIsOpenInfoTooltip}
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
              <FormResetPassword
                onSubmit={handlePasswordReset}
                serverError={serverError}
                resetPasswordResponse={resetPasswordResponse}
                setServerError={setServerError}
                setResetPasswordResponse={setResetPasswordResponse}
              />
            </Route>

            <Route path="/change-password">
              {renderMainHeader('Изменить пароль')}
              <FormChangePassword
                onSubmit={handlePasswordChange}
                serverError={serverError}
              />
            </Route>

            <ProtectedRoute
              path="/my-follow"
              header="Мои подписки"
              renderMainHeader={renderMainHeader}
              component={MyFollow}
              onUnsubscribe={handleUnsubscribe}
              subscriptions={subscriptions}
              getSubscriptions={getSubscriptions}
              subscriptionsPagination={subscriptionsPagination}
              setResponseError={setResponseError}
              setIsOpenInfoTooltip={setIsOpenInfoTooltip}
            />

            <ProtectedRoute
              path="/form-recipe/:recipeId"
              header="Редактирование рецепта"
              renderMainHeader={renderMainHeader}
              component={FormRecipe}
              onSubmit={handleRecipeUpdate}
              serverError={serverError}
              onDelete={handleDeleteRecipe}
            />

            <ProtectedRoute
              path="/form-recipe/"
              header="Создание рецепта"
              renderMainHeader={renderMainHeader}
              component={FormRecipe}
              onSubmit={handleRecipeSubmit}
              serverError={serverError}
              setResponseError={setResponseError}
              setIsOpenInfoTooltip={setIsOpenInfoTooltip}
            />

            <ProtectedRoute
              path="/favorite/"
              header="Избранное"
              renderMainHeader={renderMainHeader}
              component={Favorite}
              onAddToFavorites={handleAddToFavorites}
              onDeleteFromFavorites={handleRemoveFromFavorites}
              onAddPurchase={handleAddToPurchase}
              favoritesPagination={favoritesPagination}
              recipes={favoriteRecipes}
              getFavoritesRecipes={getFavoritesRecipes}
              onDeletePurchase={handleDeletePurchase}
              purchases={purchases}
            />

            <ProtectedRoute
              path="/shop-list"
              header="Список покупок"
              renderMainHeader={renderMainHeader}
              component={ShopList}
              purchases={purchases}
              onDeletePurchase={handleDeletePurchase}
              onDownload={handleDownloadClick}
            />

            <Route path="/single-page/:recipeId">
              <SingleRecipePage
                onSubscribe={handleSubscribe}
                onUnsubscribe={handleUnsubscribe}
                subscriptions={subscriptions}
                onAddToFavorites={handleAddToFavorites}
                onDeleteFromFavorites={handleRemoveFromFavorites}
                onAddPurchase={handleAddToPurchase}
                favoriteRecipes={favoriteRecipes}
                onDeletePurchase={handleDeletePurchase}
                purchases={purchases}
                setResponseError={setResponseError}
                setIsOpenInfoTooltip={setIsOpenInfoTooltip}
              />
            </Route>

            <Route path="/recipes/:author">
              {renderMainHeader('Рецепты', selectedAuthor)}
              <Recipes
                recipes={authorRecipes}
                favoriteRecipes={favoriteRecipes}
                onAddToFavorites={handleAddToFavorites}
                onDeleteFromFavorites={handleRemoveFromFavorites}
                onAddPurchase={handleAddToPurchase}
                recipesPagination={authorRecipesPagination}
                getRecipes={getRecipes}
                onAuthorClick={handleAuthorClick}
                selectedAuthor={selectedAuthor}
                setSelectedAuthor={setSelectedAuthor}
                onSubscribe={handleSubscribe}
                onUnsubscribe={handleUnsubscribe}
                subscriptions={subscriptions}
                onDeletePurchase={handleDeletePurchase}
                purchases={purchases}
              />
            </Route>

            <Route>
              <Redirect to="/" />
            </Route>

          </Switch>

          <InfoTooltip
            isOpen={isOpenInfoTooltip}
            onClose={closeAllPopups}
            responseError={responseError}
            setResponseError={setResponseError}
          />

        </main>
        <Footer />
      </CurrentUserContext.Provider>
    </>
  );
}

export default App;
