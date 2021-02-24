import React from 'react';
import './FormRecipeDropdownBlock.css';
import cn from 'classnames';

function FormRecipeDropdownBlock({
  ingredientList,
  onItemClick,
}) {
  const className = cn('form__dropdown-items', { 'form__dropdown-items_active': ingredientList.length > 0 });

  function handleClick(name, units) {
    console.log('name', name);
    console.log('units', units);
    onItemClick(name, units);
  }

  return (
    <ul className={className}>
      {ingredientList.map((ingredient) => (
        <li key={ingredient.id} className="form__dropdown-item">
          <button type="button" className="form__dropdown-item-btn" onClick={handleClick.bind(this, ingredient.name, ingredient.units)}>{ingredient.name}</button>
        </li>
      ))}
    </ul>
  );
}

export default FormRecipeDropdownBlock;
