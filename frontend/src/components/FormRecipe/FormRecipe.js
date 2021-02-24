import React from 'react';
import './FormRecipe.css';
import Form from '../Form/Form';

function FormRecipe({ onSubmit }) {
  return (
    <Form
      onSubmit={onSubmit}
      formRecipe
    />
  );
}

export default FormRecipe;
