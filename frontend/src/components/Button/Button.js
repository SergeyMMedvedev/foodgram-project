import React from 'react';
import './Button.css';
import cn from 'classnames';

function Button({
  text,
  blue,
  lightBlue,
  sizeAuto,
  onSubmit,
}) {
  const buttonClassBame = cn(
    'button',
    { 'button_style_light-blue': lightBlue },
    { button_size_auto: sizeAuto },
    { button_style_blue: blue },
  );
  return (
    <button onClick={onSubmit} type="button" className={buttonClassBame} name="subscribe">
      {text}
    </button>
  );
}

export default Button;
