import React, { useState } from 'react';
import cn from 'classnames';
import './FormChangePassword.css';
import Form from '../Form/Form';
import SubmitButton from '../SubmitButton/SubmitButton';

function FormChangePassword({ onSubmit, serverError }) {
  const [loading, setLoading] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [oldPasswordError, setOldPasswordError] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordError, setNewPasswordError] = useState('');
  const [newPasswordAgain, setNewPasswordAgain] = useState('');
  const [newPasswordAgainError, setNewPasswordAgainError] = useState('');

  function handleOldPasswordChange(e) {
    setOldPassword(e.target.value);
    setOldPasswordError(e.target.validationMessage);
  }

  function handleNewPasswordChange(e) {
    setNewPassword(e.target.value);
    setNewPasswordError(e.target.validationMessage);
  }

  function handleNewPasswordAgainChange(e) {
    setNewPasswordAgain(e.target.value);
    setNewPasswordAgainError(e.target.validationMessage);
  }

  function handleChangePassword(e) {
    setLoading(true);
    e.preventDefault();
    onSubmit(oldPassword, newPassword, newPasswordAgain, setLoading);
  }

  return (
    <Form
      onSubmit={handleChangePassword}
    >
      <div className="form__group">
        <span htmlFor="id_oldPassword" className="form__label">
          Старый пароль
        </span>
        <div className="form__field-group">
          <input
            value={oldPassword}
            onChange={handleOldPasswordChange}
            type="text"
            name="old_password"
            id="id_oldPassword"
            className="form__input"
            minLength="8"
            required
          />
          <span className={cn('form__error', { form__error_active: oldPasswordError })}>{oldPasswordError}</span>
        </div>
      </div>
      <div className="form__group">
        <span htmlFor="id_newPassword" className="form__label">Новый пароль</span>
        <div className="form__field-group">
          <input
            value={newPassword}
            onChange={handleNewPasswordChange}
            type="password"
            name="new_password"
            id="id_newPassword"
            className="form__input"
            minLength="8"
            required
          />
          <span className="form__input-info">Ваш пароль не должен совпадать с вашим именем или другой персональной информацией или быть слишком похожим на неё.</span>
          <span className="form__input-info">Ваш пароль должен содержать как минимум 8 символов.</span>
          <span className="form__input-info">Ваш пароль не может быть одним из широко распространённых паролей.</span>
          <span className="form__input-info">Ваш пароль не может состоять только из цифр.</span>
          <span className={cn('form__error', { form__error_active: newPasswordError })}>{newPasswordError}</span>
        </div>
      </div>
      <div className="form__group">
        <span htmlFor="id_confirmPassword" className="form__label">Подтверждение нового пароля</span>
        <div className="form__field-group">
          <input
            value={newPasswordAgain}
            onChange={handleNewPasswordAgainChange}
            type="password"
            name="confirm_password"
            id="id_confirmPassword"
            className="form__input"
            minLength="8"
            required
          />
          <span className={cn('form__error', { form__error_active: newPasswordAgainError })}>{newPasswordAgainError}</span>
        </div>
      </div>
      <span className={cn('form__error form__error_server', { form__error_server_active: serverError })}>{serverError}</span>
      <SubmitButton
        lightBlue
        text="Изменить пароль"
        disabled={loading || oldPasswordError || newPasswordError || newPasswordAgainError || (!oldPassword || !newPassword || !newPasswordAgain)}
        loading={loading}
      />
    </Form>
  );
}

export default FormChangePassword;
