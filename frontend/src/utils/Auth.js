import { API_BASE_URL } from './constants';

class Auth {
  constructor(options) {
    this.baseUrl = options.baseUrl;
    this.headers = options.headers;
  }

  async register(name, username, email, password) {
    const loadingRegisterInfo = fetch(`${this.baseUrl}/users/signup/`, {
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
      const errors = [];
      Object.keys(newUserRegistrationData).forEach((key) => {
        errors.push(`${key}: ${newUserRegistrationData[key]}`);
      });
      return Promise.reject(`Ошибка! ${errors.join('\n')}`);
    }
    return new Promise((resolve) => {
      resolve(newUserRegistrationData);
    });
  }

  async authorize(username, password) {
    const loadingAuthorizeInfo = fetch(`${this.baseUrl}/users/signin/`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({ username, password }),
    });
    const response = await loadingAuthorizeInfo;
    const authorizeData = await response.json();
    if (!response.ok) {
      const errors = [];
      Object.keys(authorizeData).forEach((key) => {
        errors.push(`${key}: ${authorizeData[key]}`);
      });
      return Promise.reject(`Ошибка! ${errors.join('\n')}`);
    }
    return new Promise((resolve) => {
      resolve(authorizeData);
    });
  }

  async changePassword(oldPassword, newPassword, newPasswordAgain) {
    const loadingPasswordChangeInfo = fetch(`${this.baseUrl}/users/change-password/`, {
      method: 'PATCH',
      headers: this.headers,
      body: JSON.stringify({
        old_password: oldPassword,
        new_password: newPassword,
        new_password_again: newPasswordAgain,
      }),
    });
    const response = await loadingPasswordChangeInfo;
    const changingPasswordData = await response.json();
    if (!response.ok) {
      const errors = [];
      Object.keys(changingPasswordData).forEach((key) => {
        errors.push(`${key}: ${changingPasswordData[key]}`);
      });
      return Promise.reject(`Ошибка! ${errors.join('\n')}`);
    }
    return new Promise((resolve) => {
      resolve(changingPasswordData);
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
