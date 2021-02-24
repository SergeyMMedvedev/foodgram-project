import { API_BASE_URL } from './constants';

class Auth {
  constructor(options) {
    this.baseUrl = options.baseUrl;
    this.headers = options.headers;
  }

  async register(name, username, email, password) {
    const loadingRegisterInfo = fetch(`${this.baseUrl}/signup/`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({
        first_name: name,
        username,
        email,
        password,
      }),
    });
    const response = await loadingRegisterInfo;
    const newUserRegistrationData = await response.json();
    if (!response.ok) {
      return Promise.reject(`Ошибка: ${newUserRegistrationData.message}`);
    }
    return new Promise((resolve) => {
      resolve(newUserRegistrationData);
    });
  }

  async authorize(username, password) {
    const loadingAuthorizeInfo = fetch(`${this.baseUrl}/signin/`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({ username, password }),
    });
    const response = await loadingAuthorizeInfo;
    const authorizeData = await response.json();
    if (!response.ok) {
      return Promise.reject(`Ошибка: ${authorizeData.message}`);
    }
    return new Promise((resolve) => {
      resolve(authorizeData);
    });
  }

  async getContent(token) {
    const contentInfo = fetch(`${this.baseUrl}/users/me/`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
    });
    const response = await contentInfo;
    const selfData = await response.json();
    if (!response.ok) {
      return Promise.reject(`Ошибка: ${selfData.message}`);
    }
    return new Promise((resolve) => {
      resolve(selfData);
    });
  }
}

const auth = new Auth({
  baseUrl: API_BASE_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

export default auth;
