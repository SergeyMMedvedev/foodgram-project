import React from 'react';
import './FormReg.css';
import Form from '../Form/Form';

function FormReg({ onSubmit }) {
  return (
    <Form
      formReg
      onSubmit={onSubmit}
    />
  );
}

export default FormReg;
