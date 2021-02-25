import React from 'react';
import './FormResetPassword.css';
import Form from '../Form/Form';
import SubmitButton from '../SubmitButton/SubmitButton';

function FormResetPassword() {
  return (
    <Form>
      <p className="form__info-text">
        Чтобы сбросить старый пароль — введите адрес электронной почты, под которым вы регистрировались.
      </p>
      <div className="form__group">
        <span htmlFor="id_email" className="form__label">
          Адрес электронной почты
        </span>
        <div className="form__field-group">
          <input type="email" name="email" id="id_email" className="form__input" />
          <span className="form__error" />
        </div>
      </div>

      <div className="form__footer">
        <SubmitButton
          lightBlue
          text="Сбросить пароль"
        />
      </div>
    </Form>
  );
}

export default FormResetPassword;
