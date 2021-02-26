import React from 'react';
import './Button.css';
import cn from 'classnames';

function Button({
  text,
  blue,
  lightBlue,
  sizeAuto,
  onClick,
  disabled,
}) {
  const buttonClassBame = cn(
    'button',
    { 'button_style_light-blue': lightBlue },
    { button_size_auto: sizeAuto },
    { button_style_blue: blue },
    { button_disabled: disabled },
  );
  return (
    <button onClick={onClick} type="button" className={buttonClassBame} name="subscribe" disabled={disabled}>
      {text}
    </button>
  );
}

export default Button;
