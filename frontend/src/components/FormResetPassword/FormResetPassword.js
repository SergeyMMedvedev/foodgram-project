import React, { useState } from 'react';
import cn from 'classnames';
import './FormResetPassword.css';
import Form from '../Form/Form';
import SubmitButton from '../SubmitButton/SubmitButton';

function FormResetPassword({
  onSubmit,
  serverError,
  resetPasswordResponse,
  setServerError,
  setResetPasswordResponse,
}) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  function handleChange(e) {
    setEmail(e.target.value);
    setEmailError(e.target.validationMessage);
    setServerError('');
    setResetPasswordResponse('');
  }

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    onSubmit(email, setLoading);
    setServerError('');
  }

  return (
    <Form
      onSubmit={handleSubmit}
    >
      <p className="form__info-text">
        Чтобы сбросить старый пароль — введите адрес электронной почты, под которым вы регистрировались.
      </p>
      <div className="form__group">
        <span htmlFor="id_email" className="form__label">
          Адрес электронной почты
        </span>
        <div className="form__field-group">
          <input
            value={email}
            onChange={handleChange}
            type="email"
            name="email"
            id="id_email"
            className="form__input"
          />
          <span className={cn('form__error', { form__error_active: emailError })}>{emailError}</span>
        </div>
      </div>
      <span className={cn('form__error form__error_server', { form__error_server_active: serverError })}>{serverError}</span>
      <span className={cn('form__reset-info', { 'form__reset-info_active': resetPasswordResponse.status === 'OK' })}>
        {`Проверьте Ваш почтовый ящик. На указанный адрес ${email} было отправлено письмо для подтверждения сброса пароля.`}
      </span>
      <div className="form__footer">
        <SubmitButton
          lightBlue
          text="Сбросить пароль"
          disabled={loading || emailError || !email}
          loading={loading}
        />
      </div>
    </Form>
  );
}

export default FormResetPassword;
