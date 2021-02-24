import React from 'react';
import './SubmitButton.css';
import cn from 'classnames';

function Button({
  text,
  blue,
  lightBlue,
  sizeAuto,
}) {
  const buttonClassBame = cn(
    'button',
    { 'button_style_light-blue': lightBlue },
    { button_size_auto: sizeAuto },
    { button_style_blue: blue },
  );
  return (
    <input type="submit" className={buttonClassBame} name="subscribe" value={text} />
  );
}

export default Button;
