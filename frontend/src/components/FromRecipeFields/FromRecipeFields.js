import React, { useState, useRef, useEffect } from 'react';
import './FromRecipeFields.css';
import Tags from '../Tags/Tags';
// import Button from '../Button/Button';
import api from '../../utils/Api';
import FormRecipeDropdownBlock from '../FormRecipeDropdownBlock/FormRecipeDropdownBlock';
import SubmitButton from '../SubmitButton/SubmitButton';

function FromRecipeFields({ onSubmit }) {
  const [recipeName, setRecipeName] = useState('');
  const [nameIngredient, setNameIngredient] = useState('');
  const [nameUnits, setNameUnits] = useState('');
  const [amountUnits, setAmountUnits] = useState('');
  const [cookingTime, setCookingTime] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState([]);
  const [ingredientChoiseList, setIngredientChoiseList] = useState([]);
  const formDropdownRef = useRef();
  const formGroupRef = useRef();
  const inputPhotoRef = useRef();
  const formRef = useRef();

  const [addedIngredients, setAddedIngredients] = useState([]);

  function handleRecipeNameChange(e) {
    setRecipeName(e.target.value);
  }

  function handleNameIngredientChange(e) {
    console.log(e.target.value);
    setNameIngredient(e.target.value);
    if (e.target.value) {
      api.getIngredients(e.target.value)
        .then((data) => {
          console.log('data ', data);
          setIngredientChoiseList(data);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setIngredientChoiseList([]);
    }
  }

  function handleAmountChange(e) {
    setAmountUnits(e.target.value);
  }

  function handleItemClick(name, units) {
    setNameIngredient(name);
    setNameUnits(units);
  }

  function handleAddIngredient() {
    if (nameIngredient && amountUnits && nameUnits) {
      addedIngredients.push({ name: nameIngredient, amount: amountUnits, units: nameUnits });
      const newAddedIngredients = addedIngredients.slice();
      setAddedIngredients(newAddedIngredients);
      setNameIngredient('');
      setNameUnits('');
      setAmountUnits('');
    } else {
      console.log('заполните все поля ингредиента');
    }
  }

  // function renderAddedIngredients() {
  //   addedIngredients.map((ingredient) => (
  //     <div className="form__field-item-ingredient" id="ing_2">
  //       <span>
  //         {ingredient.name}
  //         {ingredient.units}
  //       </span>
  //       <span className="form__field-item-delete" />
  //     </div>
  //   ));
  // }

  function handkeCookingTimeChange(e) {
    if (e.target.value < 999) {
      setCookingTime(e.target.value);
    }
  }

  useEffect(() => {
    function handleClick(e) {
      if (!e.target.classList.contains('form__dropdown-item')) {
        setIngredientChoiseList([]);
      }
    }
    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);

  function handleIngredientDelete(currentIngredient) {
    addedIngredients.forEach((ingredient) => {
      console.log('ingredient.name', ingredient.name);
      console.log('currentIngredient.name', currentIngredient.name);
      console.log('ingredient.name === currentIngredient.name', ingredient.name === currentIngredient.name);
      console.log('ingredient.amount.toString()', ingredient.amount.toString());
      console.log('currentIngredient.amount', currentIngredient.amount);
      console.log('ingredient.amount.toString() === currentIngredient.amount', ingredient.amount.toString() === currentIngredient.amount);
      console.log('пропускаем: ', !((ingredient.name === currentIngredient.name) && (ingredient.amount.toString() === currentIngredient.amount)));
    });

    const newAddedIngredients = addedIngredients.filter((ingredient) => (
      (!((ingredient.name === currentIngredient.name) && (ingredient.amount.toString() === currentIngredient.amount)))
    ));
    setAddedIngredients(newAddedIngredients);
  }

  function handleDescriptionChange(e) {
    setDescription(e.target.value);
  }

  function handleTagClick(remove, selectedTag) {
    if (remove) {
      const newTags = tags.filter((item) => (item !== selectedTag));
      setTags(newTags);
    } else {
      tags.push(selectedTag);
      setTags(tags);
    }
  }

  function handleFormRecipeSubmit(e) {
    const formElem = new FormData(formRef.current);
    e.preventDefault();
    const recipe = {
      author: 'admin',
      name: recipeName,
      ingredient: addedIngredients,
      tag: tags,
      cooking_time: cookingTime,
      description,
      // image: inputPhotoRef.current.files[0],
    };
    console.log(recipe);
    console.log(JSON.stringify(recipe));
    onSubmit(recipe, formElem);
  }

  function handlePhotoDelete() {
    console.log(inputPhotoRef.current);
    console.log(inputPhotoRef.current.files[0]);
    console.log('handlePhotoDelete');
  }

  return (
    <form ref={formRef} className="form" onSubmit={handleFormRecipeSubmit}>
      <div ref={formGroupRef} className="form__group">
        <span htmlFor="id_name" className="form__label">Название рецепта</span>
        <div className="form__field-group">
          <input
            value={recipeName}
            onChange={handleRecipeNameChange}
            type="text"
            id="id_name"
            name="name"
            className="form__input"
            maxLength="30"
            required
          />
          <span className="form__error" />
        </div>
      </div>

      <div className="form__group">
        <p className="form__label">Теги</p>
        <div className="form__field-group">
          <Tags
            onTagClick={handleTagClick}
          />
          <span className="form__error" />
        </div>
      </div>

      <div className="form__group">
        <span htmlFor="nameIngredient" className="form__label">Ингредиенты</span>
        <div className="form__field-group">
          <div className="form__field-group-ingredientes">
            <div ref={formDropdownRef} className="form__dropdown">
              <textarea
                onChange={handleNameIngredientChange}
                value={nameIngredient}
                type="text"
                id="nameIngredient"
                className="form__input"
                maxLength="30"
              />
              <FormRecipeDropdownBlock
                ingredientList={ingredientChoiseList}
                onItemClick={handleItemClick}
              />
            </div>
            <input
              onChange={handleAmountChange}
              value={amountUnits}
              type="number"
              id="cantidad"
              className="form__input"
              max="999"
            />
            <span htmlFor="cantidad" className="form__label" id="cantidadVal">{nameUnits || 'шт.'}</span>
          </div>
          <div className="form__field-group-ingredientes-container">
            {addedIngredients.map((ingredient) => (
              <div key={`${ingredient.name}__${ingredient.amount}`} className="form__field-item-ingredient">
                <span>
                  {`${ingredient.name} `}
                  {`${ingredient.amount} `}
                  {ingredient.units}
                </span>
                <button type="button" onClick={handleIngredientDelete.bind(this, ingredient)} className="form__field-item-delete form__field-item-delete_ingredient" />
              </div>
            ))}
          </div>
          <button onClick={handleAddIngredient} type="button" className="form__ingredient-add-btn" id="addIng">Добавить ингредиент</button>
          <span className="form__error" />
        </div>
      </div>

      <div className="form__group">
        <span htmlFor="id_time" className="form__label">Время приготовления</span>
        <div className="form__field-group form__field-group_time">
          <input
            type="number"
            id="id_time"
            name="cooking_time"
            className="form__input"
            maxLength="3"
            value={cookingTime}
            onChange={handkeCookingTimeChange}
            required
          />
          <span htmlFor="id_time" className="form__label">минут</span>
          <span className="form__error" />
        </div>
      </div>

      <div className="form__group">
        <span htmlFor="id_description" className="form__label">Описание</span>
        <div className="form__field-group">
          <textarea
            name="description"
            id="id_description"
            rows="8"
            className="form__textarea"
            value={description}
            onChange={handleDescriptionChange}
            maxLength="500"
            required
          />
          <span className="form__error" />
        </div>
      </div>

      <div className="form__group">
        <span className="form__label">Загрузить фото</span>
        <div className="form__field-group form__field-group_photo">
          <label htmlFor="id_file" className="form__photo-file">
            <input ref={inputPhotoRef} type="file" name="image" id="id_file" className="form__photo-input" />
          </label>
          <button type="button" onClick={handlePhotoDelete} className="form__field-item-delete" />
          <span className="form__error" />
        </div>
      </div>
      <div className="form__footer form__footer_recipe">
        <SubmitButton
          blue
          text="Создать рецепт"
        />
      </div>

    </form>
  );
}

export default FromRecipeFields;
