import React from 'react';
import './FormChangePasswordFields.css';
import Button from '../Button/Button';

function FormChangePasswordFields({ onSubmit }) {
  return (
    <form className="form">
      <div className="form__group">
        <span htmlFor="id_oldPassword" className="form__label">
          Старый пароль
        </span>
        <div className="form__field-group">
          <input type="text" name="old_password" id="id_oldPassword" className="form__input" />
          <span classNamess="form__error" />
        </div>
      </div>
      <div className="form__group">
        <span htmlFor="id_newPassword" className="form__label">Новый пароль</span>
        <div className="form__field-group">
          <input type="password" name="new_password" id="id_newPassword" className="form__input" />
          <span className="form__input-info">Ваш пароль не должен совпадать с вашим именем или другой персональной информацией или быть слишком похожим на неё.</span>
          <span className="form__input-info">Ваш пароль должен содержать как минимум 8 символов.</span>
          <span className="form__input-info">Ваш пароль не может быть одним из широко распространённых паролей.</span>
          <span className="form__input-info">Ваш пароль не может состоять только из цифр.</span>
          <span className="form__error" />
        </div>
      </div>
      <div className="form__group">
        <span htmlFor="id_confirmPassword" className="form__label">Подтверждение нового пароля</span>
        <div className="form__field-group">
          <input type="password" name="confirm_password" id="id_confirmPassword" className="form__input" />
          <span className="form__error" />
        </div>
      </div>
      <Button
        onSubmit={onSubmit}
        lightBlue
        text="Изменить пароль"
      />
    </form>
  );
}

export default FormChangePasswordFields;
