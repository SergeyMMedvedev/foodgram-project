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

  async getFavoriteAuthors() {
    const loadingResponse = fetch((`${this.baseUrl}/follow/`), {
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
}

const api = new Api({
  baseUrl: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
