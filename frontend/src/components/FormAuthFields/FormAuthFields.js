import React, { useState } from 'react';
import './FormAuthFields.css';
import SubmitButton from '../SubmitButton/SubmitButton';

function FormAuthFields({ onSubmit }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  function handleUsernameChange(e) {
    setUsername(e.target.value);
  }

  function handlePasswordChange(e) {
    setPassword(e.target.value);
  }

  function handleLoginSubmit(e) {
    e.preventDefault();
    onSubmit(username, password);
  }

  return (
    <form className="form" onSubmit={handleLoginSubmit}>

      <div className="form__group">
        <span htmlFor="id_username" className="form__label">
          Имя пользователя
        </span>
        <div className="form__field-group">
          <input
            value={username}
            onChange={handleUsernameChange}
            type="text"
            name="username"
            id="id_username"
            className="form__input"
            minLength="2"
            maxLength="30"
            required
          />
          <span className="form__error">
            Имя пользователя и пароль не совпадают. Введите правильные данные.
          </span>
        </div>
      </div>

      <div className="form__group">
        <span htmlFor="id_password" className="form__label">
          Пароль
        </span>
        <div className="form__field-group">
          <input
            value={password}
            onChange={handlePasswordChange}
            type="password"
            name="password"
            id="id_password"
            className="form__input"
            minLength="8"
            required
          />
          <span className="form__error" />
        </div>
      </div>

      <div className="form__footer">
        <SubmitButton
          lightBlue
          text="Войти"
        />
        <a href="/reset-password" className="form__forgot-link">Забыли пароль?</a>
      </div>

    </form>
  );
}

export default FormAuthFields;
