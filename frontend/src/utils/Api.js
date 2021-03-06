import { API_BASE_URL } from './constants';

class Api {
  constructor(options) {
    this.baseUrl = options.baseUrl;
    this.headers = options.headers;
  }

  async getRecipes(params) {
    const {
      page = 'page=1',
      author = '',
      tagBreakfast = '',
      tagDinner = '',
      tagSupper = '',
    } = params;
    const loadingRecipes = fetch((`${this.baseUrl}/recipes/?${page}${author}${tagBreakfast}${tagDinner}${tagSupper}`), {
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
    const loadingResponse = fetch((`${this.baseUrl}/recipes/`), {
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

  async updateRecipe(formElem, token, recipeId) {
    const image = formElem.get('image');
    // если фотография не передается при редактировании рецепта, то надо исключить
    // это поле полностью, чтобы оно не передавалось пустым и не возникала ошибка сериализации
    // фотография останется, какая было до редактирования
    if (!image.name || !image.size) {
      formElem.delete('image');
    }
    // токен передаем отдельно, т.к. this.headers не подходит из-за того, что body не json
    const loadingResponse = fetch((`${this.baseUrl}/recipes/${recipeId}/`), {
      method: 'PATCH',
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

  async getSubscriptions(params) {
    const { page = 'page=1', author = '' } = params;
    const loadingResponse = fetch((`${this.baseUrl}/subscriptions/?${page}${author}`), {
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
    if (!(response.status === 204)) {
      return Promise.reject(`Ошибка! ${response.status}`);
    }
    return new Promise((resolve) => {
      resolve(response.status);
    });
  }

  async getFavoritesRecipes(params) {
    const {
      page = 'page=1',
      tagBreakfast = '',
      tagDinner = '',
      tagSupper = '',
    } = params;
    const loadingResponse = fetch((`${this.baseUrl}/favorites/?${page}${tagBreakfast}${tagDinner}${tagSupper}`), {
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
    if (!(response.status === 204)) {
      return Promise.reject(`Ошибка! ${response.status}`);
    }
    return new Promise((resolve) => {
      resolve(response.status);
    });
  }

  async getPurchases() {
    const loadingResponse = fetch((`${this.baseUrl}/purchases/`), {
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

  async addPurchase(recipeId) {
    const loadingResponse = fetch((`${this.baseUrl}/purchases/`), {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({
        purchase: recipeId,
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

  async deletePurchase(id) {
    const loadingResponse = fetch((`${this.baseUrl}/purchases/${+id}/`), {
      method: 'DELETE',
      headers: this.headers,
    });
    const response = await loadingResponse;
    if (!(response.status === 204)) {
      return Promise.reject(`Ошибка! ${response.status}`);
    }
    return new Promise((resolve) => {
      resolve(response.status);
    });
  }

  async download(purchases) {
    const loadingResponse = fetch((`${this.baseUrl}/download/`), {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(purchases),
    });
    const response = await loadingResponse;
    const responseData = await response.blob();
    if (!response.ok) {
      return Promise.reject('Ошибка!');
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
