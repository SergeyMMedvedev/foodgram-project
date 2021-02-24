import React from 'react';
import './Form.css';
import FromRegFields from '../FormRegFields/FromRegFields';
import FromRecipeFields from '../FromRecipeFields/FromRecipeFields';
import FormAuthFields from '../FormAuthFields/FormAuthFields';
import FormResetPasswordFields from '../FormResetPasswordFields/FormResetPasswordFields';
import FormChangePasswordFields from '../FormChangePasswordFields/FormChangePasswordFields';

function Form({
  onSubmit,
  formReg,
  formRecipe,
  formAuth,
  formResetPassword,
  formChangePassword,
}) {
  return (
    <div className="form-container">

      {formReg && (
        <FromRegFields
          onSubmit={onSubmit}
        />
      )}
      {formRecipe && (
        <FromRecipeFields
          onSubmit={onSubmit}
        />
      )}
      {formAuth && (
        <FormAuthFields
          onSubmit={onSubmit}
        />
      )}
      {formResetPassword && (
        <FormResetPasswordFields
          onSubmit={onSubmit}
        />
      )}
      {formChangePassword && (
        <FormChangePasswordFields
          onSubmit={onSubmit}
        />
      )}

    </div>
  );
}

export default Form;
