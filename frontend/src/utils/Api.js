import { API_BASE_URL } from './constants';

class Api {
  constructor(options) {
    this.baseUrl = options.baseUrl;
    this.headers = options.headers;
  }

  async getRecipes(author) {
    let urlParams;
    if (author) {
      urlParams = `/recipes?author=${author}`;
    } else {
      urlParams = '/recipes';
    }
    const loadingRecipes = fetch((`${this.baseUrl}${urlParams}`), {
      headers: this.headers,
    });
    const response = await loadingRecipes;
    const recipes = await response.json();
    if (!response.ok) {
      return Promise.reject(`Ошибка: ${recipes.message}`);
    }
    return new Promise((resolve) => {
      resolve(recipes);
    });
  }

  async getRecipe(recipeId) {
    const loadingRecipe = fetch((`${this.baseUrl}/recipes/${recipeId}`), {
      headers: this.headers,
    });
    const response = await loadingRecipe;
    const recipe = await response.json();
    if (!response.ok) {
      return Promise.reject(`Ошибка: ${recipe.message}`);
    }
    return new Promise((resolve) => {
      resolve(recipe);
    });
  }

  async getIngredients(startsWith) {
    const loadingIngredients = fetch((`${this.baseUrl}/ingredients?search=${startsWith}`), {
      headers: this.headers,
    });
    const response = await loadingIngredients;
    const ingredients = await response.json();
    if (!response.ok) {
      return Promise.reject(`Ошибка: ${ingredients.message}`);
    }
    return new Promise((resolve) => {
      resolve(ingredients);
    });
  }

  async postRecipe(recipe, formElem, token) {
    const loadingResponse = fetch((`${this.baseUrl}/recipes2/`), {
      method: 'POST',
      headers: {
        Authorization: `Token ${token}`,
      },
      body: formElem,
    });
    const response = await loadingResponse;
    const responseData = await response.json();
    if (!response.ok) {
      const errors = [];
      Object.keys(responseData).forEach((key) => {
        errors.push(`${key}: ${responseData[key]}`);
      });
      return Promise.reject(`Ошибка! ${errors.join('\n')}`);
    }
    return new Promise((resolve) => {
      resolve(responseData);
    });
  }

  async getSubscriptions() {
    const loadingResponse = fetch((`${this.baseUrl}/subscriptions/`), {
      method: 'GET',
      headers: this.headers,
    });
    const response = await loadingResponse;
    const responseData = await response.json();
    if (!response.ok) {
      const errors = [];
      Object.keys(responseData).forEach((key) => {
        errors.push(`${key}: ${responseData[key]}`);
      });
      return Promise.reject(`Ошибка! ${errors.join('\n')}`);
    }
    return new Promise((resolve) => {
      resolve(responseData);
    });
  }

  async subscribe(author) {
    const loadingResponse = fetch((`${this.baseUrl}/subscriptions/`), {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({
        author,
      }),
    });
    const response = await loadingResponse;
    const responseData = await response.json();
    if (!response.ok) {
      const errors = [];
      Object.keys(responseData).forEach((key) => {
        errors.push(`${key}: ${responseData[key]}`);
      });
      return Promise.reject(`Ошибка! ${errors.join('\n')}`);
    }
    return new Promise((resolve) => {
      resolve(responseData);
    });
  }

  async unsubscribe(id) {
    const loadingResponse = fetch((`${this.baseUrl}/subscriptions/${id}/`), {
      method: 'DELETE',
      headers: this.headers,
    });
    const response = await loadingResponse;
    if (!response.status === 204) {
      return Promise.reject(`Ошибка! ${response}`);
    }
    return new Promise((resolve) => {
      resolve(response.status);
    });
  }

  async getFavoritesRecipes() {
    const loadingResponse = fetch((`${this.baseUrl}/favorites/`), {
      method: 'GET',
      headers: this.headers,
    });
    const response = await loadingResponse;
    const responseData = await response.json();
    if (!response.ok) {
      const errors = [];
      Object.keys(responseData).forEach((key) => {
        errors.push(`${key}: ${responseData[key]}`);
      });
      return Promise.reject(`Ошибка! ${errors.join('\n')}`);
    }
    return new Promise((resolve) => {
      resolve(responseData);
    });
  }

  async addToFavoritesRecipes(recipeId) {
    const loadingResponse = fetch((`${this.baseUrl}/favorites/`), {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({
        favorite: recipeId,
      }),
    });
    const response = await loadingResponse;
    const responseData = await response.json();
    if (!response.ok) {
      const errors = [];
      Object.keys(responseData).forEach((key) => {
        errors.push(`${key}: ${responseData[key]}`);
      });
      return Promise.reject(`Ошибка! ${errors.join('\n')}`);
    }
    return new Promise((resolve) => {
      resolve(responseData);
    });
  }

  async deleteFromFavoritesRecipes(id) {
    const loadingResponse = fetch((`${this.baseUrl}/favorites/${+id}/`), {
      method: 'DELETE',
      headers: this.headers,
    });
    const response = await loadingResponse;
    if (!response.status === 204) {
      return Promise.reject(`Ошибка! ${response}`);
    }
    return new Promise((resolve) => {
      resolve(response.status);
    });
  }
}

const api = new Api({
  baseUrl: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
