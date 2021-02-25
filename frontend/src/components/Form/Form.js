import React from 'react';
import './Form.css';

function Form({
  formRef,
  children,
  onSubmit,
}) {
  return (
    <div className="form-container">
      <form ref={formRef} className="form" onSubmit={onSubmit}>
        {children}
      </form>
    </div>
  );
}

export default Form;
