import React from 'react';
import './Popup.css';

function Popup({
  isOpen,
  title,
  onClose,
  message,
}) {
  function overlayClose(evt) {
    if (
      evt.target.classList.contains('popup__close')
      || evt.target.classList.contains('popup_opened')
    ) {
      onClose();
    }
  }

  return (
    <div onMouseDown={overlayClose} className={`popup ${isOpen && 'popup_opened'}`}>
      <div className={`popup__window ${isOpen && 'popup__window_opened'}`}>
        <h3 className="popup__title">{title}</h3>
        <p className="popup__server-error popup__server-error_active">{message}</p>
        <button type="button" onClick={onClose} className="popup__close" />
      </div>
    </div>
  );
}

export default Popup;
