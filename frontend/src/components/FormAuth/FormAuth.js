import React, { useState } from 'react';
import './FormAuth.css';
import cn from 'classnames';
import SubmitButton from '../SubmitButton/SubmitButton';
import Form from '../Form/Form';

function FormAuth({ onSubmit, serverError }) {
  const [username, setUsername] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  function handleUsernameChange(e) {
    setUsername(e.target.value);
    setUsernameError(e.target.validationMessage);
  }

  function handlePasswordChange(e) {
    setPassword(e.target.value);
    setPasswordError(e.target.validationMessage);
  }

  function handleLoginSubmit(e) {
    e.preventDefault();
    onSubmit(username, password);
  }

  console.log(usernameError || passwordError || (!username || !password));

  return (
    <Form
      onSubmit={handleLoginSubmit}
    >
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
          <span className={cn('form__error', { form__error_active: usernameError })}>{usernameError}</span>
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
          <span className={cn('form__error', { form__error_active: passwordError })}>{passwordError}</span>
        </div>
      </div>
      <span className={cn('form__error form__error_server', { form__error_server_active: serverError })}>{serverError}</span>
      <div className="form__footer">
        <SubmitButton
          lightBlue
          text="Войти"
          disabled={usernameError || passwordError || (!username || !password)}
        />
        <a href="/reset-password" className="form__forgot-link">Забыли пароль?</a>
      </div>
    </Form>
  );
}

export default FormAuth;
