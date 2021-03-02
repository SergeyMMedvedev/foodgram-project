import React, { useState } from 'react';
import cn from 'classnames';
import './FormReg.css';
import Form from '../Form/Form';
import SubmitButton from '../SubmitButton/SubmitButton';

function FormReg({ onSubmit, serverError }) {
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState('');
  const [username, setUsername] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  function handleNameChange(e) {
    setName(e.target.value);
    setNameError(e.target.validationMessage);
  }

  function handleUsernameChange(e) {
    setUsername(e.target.value);
    setUsernameError(e.target.validationMessage);
  }

  function handleEmailChange(e) {
    setEmail(e.target.value);
    setEmailError(e.target.validationMessage);
  }

  function handlePasswordChange(e) {
    setPassword(e.target.value);
    setPasswordError(e.target.validationMessage);
  }

  function handleRegistrationSubmit(e) {
    e.preventDefault();
    onSubmit(name, username, email, password);
  }

  return (
    <Form
      onSubmit={handleRegistrationSubmit}
    >
      <div className="form__group">
        <span htmlFor="id_first_name" className="form__label">
          Имя
        </span>
        <div className="form__field-group">
          <input
            value={name}
            onChange={handleNameChange}
            type="text"
            name="first_name"
            id="id_first_name"
            className="form__input"
            minLength="2"
            required
          />
          <span className={cn('form__error', { form__error_active: nameError })}>{nameError}</span>
        </div>
      </div>

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
            required
          />
          <span className={cn('form__error', { form__error_active: usernameError })}>{usernameError}</span>
        </div>
      </div>

      <div className="form__group">
        <span htmlFor="id_email" className="form__label">
          Адрес электронной почты
        </span>
        <div className="form__field-group">
          <input
            value={email}
            onChange={handleEmailChange}
            type="email"
            name="email"
            id="id_email"
            className="form__input"
            required
          />
          <span className={cn('form__error', { form__error_active: emailError })}>{emailError}</span>
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
          text="Создать аккаунт"
          disabled={nameError || usernameError || emailError || passwordError || (!name || !username || !email || !password)}
        />
      </div>
    </Form>
  );
}

export default FormReg;
