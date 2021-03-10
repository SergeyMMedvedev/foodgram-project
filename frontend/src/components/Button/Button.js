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
  sizeSubscribe,
  styleNone,
  lightOrange,
  underline,
  loading,
  favorite,
}) {
  const buttonClassBame = cn(
    'button',
    { 'button_style_light-blue': lightBlue },
    { button_size_auto: sizeAuto },
    { button_style_blue: blue },
    { button_disabled: (disabled && !favorite) },
    { button_size_subscribe: sizeSubscribe },
    { button_style_none: styleNone },
    { 'button_style_light-orange': lightOrange },
    { button_style_underline: underline },
    { button_saving: loading },
  );
  return (
    <button onClick={onClick} type="button" className={buttonClassBame} name="subscribe" disabled={disabled}>
      {text}
    </button>
  );
}

export default Button;
