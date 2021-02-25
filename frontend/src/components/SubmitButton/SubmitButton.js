import React from 'react';
import './SubmitButton.css';
import cn from 'classnames';

function SubmitButton({
  text,
  blue,
  lightBlue,
  sizeAuto,
  disabled,
}) {
  const buttonClassBame = cn(
    'submit-button',
    { 'submit-button_style_light-blue': lightBlue },
    { 'submit-button_size_auto': sizeAuto },
    { 'submit-button_style_blue': blue },
    { 'submit-button_disabled': disabled },
  );
  return (
    <input type="submit" className={buttonClassBame} name="subscribe" value={text} disabled={disabled} />
  );
}

export default SubmitButton;
