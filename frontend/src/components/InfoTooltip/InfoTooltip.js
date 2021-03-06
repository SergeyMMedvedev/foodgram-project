import React from 'react';
import './InfoTooltip.css';
import Popup from '../Popup/Popup';

function InfoTooltip({
  isOpen,
  onClose,
  responseError,
  setResponseError,
}) {
  function handleClose() {
    onClose();
    setTimeout(() => {
      setResponseError('');
    }, 400);
  }

  return (
    <Popup
      isOpen={isOpen}
      title="Ошибка!"
      message={responseError}
      onClose={handleClose}
    />
  );
}

export default InfoTooltip;
