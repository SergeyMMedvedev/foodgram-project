import React from 'react';
import './FormAuth.css';
import Form from '../Form/Form';

function FormAuth({ onSubmit }) {
  return (
    <Form
      formAuth
      onSubmit={onSubmit}
    />
  );
}

export default FormAuth;
