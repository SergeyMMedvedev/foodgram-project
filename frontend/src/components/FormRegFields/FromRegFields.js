import React, { useState } from 'react';
import './FromRegFields.css';
import SubmitButton from '../SubmitButton/SubmitButton';

function FromRegFields({ onSubmit }) {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleNameChange(e) {
    setName(e.target.value);
  }

  function handleUsernameChange(e) {
    setUsername(e.target.value);
  }

  function handleEmailChange(e) {
    setEmail(e.target.value);
  }

  function handlePasswordChange(e) {
    setPassword(e.target.value);
  }

  function handleRegistrationSubmit(e) {
    e.preventDefault();
    console.log('handleRegistrationSubmit FromRegFields');
    onSubmit(name, username, email, password);
  }

  return (
    <form className="form" onSubmit={handleRegistrationSubmit}>

      <div className="form__group">
        <span htmlFor="id_first_name" className="form__label">
          Имя
        </span>
        <div className="form__field-group">
          <input value={name} onChange={handleNameChange} type="text" name="first_name" id="id_first_name" className="form__input" />
          <span className="form__error" />
        </div>
      </div>

      <div className="form__group">
        <span htmlFor="id_username" className="form__label">
          Имя пользователя
        </span>
        <div className="form__field-group">
          <input value={username} onChange={handleUsernameChange} type="text" name="username" id="id_username" className="form__input" />
          <span className="form__error">
            Имя пользователя и пароль не совпадают. Введите правильные данные.
          </span>
        </div>
      </div>

      <div className="form__group">
        <span htmlFor="id_email" className="form__label">
          Адрес электронной почты
        </span>
        <div className="form__field-group">
          <input value={email} onChange={handleEmailChange} type="email" name="email" id="id_email" className="form__input" />
          <span className="form__error" />
        </div>
      </div>

      <div className="form__group">
        <span htmlFor="id_password" className="form__label">
          Пароль
        </span>
        <div className="form__field-group">
          <input value={password} onChange={handlePasswordChange} type="password" name="password" id="id_password" className="form__input" />
          <span className="form__error" />
        </div>
      </div>

      <div className="form__footer">
        <SubmitButton
          lightBlue
          text="Создать аккаунт"
        />
      </div>

    </form>
  );
}

export default FromRegFields;
