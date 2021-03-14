import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './FormRecipe.css';
import cn from 'classnames';
import Form from '../Form/Form';
import Tags from '../Tags/Tags';
import api from '../../utils/Api';
import FormRecipeDropdownBlock from '../FormRecipeDropdownBlock/FormRecipeDropdownBlock';
import SubmitButton from '../SubmitButton/SubmitButton';
import Button from '../Button/Button';

function FormRecipe({
  onSubmit,
  serverError,
  header,
  renderMainHeader,
  onDelete,
  setResponseError,
  setIsOpenInfoTooltip,
}) {
  const { recipeId } = useParams();
  const [loading, setLoading] = useState(false);
  const [recipeName, setRecipeName] = useState('');
  const [recipeNameError, setRecipeNameError] = useState('');
  const [nameIngredient, setNameIngredient] = useState('');
  const [nameUnits, setNameUnits] = useState('');
  const [amountUnits, setAmountUnits] = useState('');
  const [amountUnitsError, setAmountUnitsErorr] = useState('');
  const [cookingTime, setCookingTime] = useState('');
  const [cookingTimeError, setCookingTimeError] = useState('');
  const [description, setDescription] = useState('');
  const [descriptionError, setDescriptionError] = useState('');
  const [image, setImage] = useState('');
  const [tags, setTags] = useState([]);
  const [ingredientChoiseList, setIngredientChoiseList] = useState([]);
  const formDropdownRef = useRef();
  const formGroupRef = useRef();
  const formRef = useRef();
  const [showSubmitHint, setShowSubmitHint] = useState(false);

  const [addedIngredients, setAddedIngredients] = useState([]);

  function handleRecipeNameChange(e) {
    setRecipeName(e.target.value);
    setRecipeNameError(e.target.validationMessage);
  }

  function handleNameIngredientChange(e) {
    setNameIngredient(e.target.value);
    if (e.target.value) {
      api.getIngredients(e.target.value)
        .then((data) => {
          setIngredientChoiseList(data);
        })
        .catch((err) => {
          setResponseError(err);
          setIsOpenInfoTooltip(true);
        });
    } else {
      setIngredientChoiseList([]);
    }
  }

  function handleAmountChange(e) {
    setAmountUnits(e.target.value);
    setAmountUnitsErorr(e.target.validationMessage);
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
    }
  }

  function handkeCookingTimeChange(e) {
    if (e.target.value <= 999) {
      setCookingTime(e.target.value);
    }
    setCookingTimeError(e.target.validationMessage);
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
    const newAddedIngredients = addedIngredients.filter((ingredient) => (
      (!((ingredient.name === currentIngredient.name) && (ingredient.amount.toString() === currentIngredient.amount.toString())))
    ));
    setAddedIngredients(newAddedIngredients);
  }

  function handleDescriptionChange(e) {
    setDescription(e.target.value);
    setDescriptionError(e.target.validationMessage);
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

  function handleImageChange(e) {
    setImage(e.target.value);
  }

  function handleFormRecipeSubmit(e) {
    setLoading(true);
    const formElem = new FormData(formRef.current);
    e.preventDefault();
    const recipe = {
      author: 'admin',
      name: recipeName,
      ingredient: addedIngredients,
      tag: tags,
      cooking_time: cookingTime,
      description,
    };
    onSubmit(recipe, formElem, localStorage.getItem('token'), recipeId, setLoading);
  }

  function handlePhotoDelete() {
    document.getElementById('id_file').value = null;
    setImage('');
  }

  function handleDelete() {
    onDelete(recipeId);
  }

  useEffect(() => {
    const disabled = (
      recipeNameError
      || cookingTimeError
      || descriptionError
      || (
        !recipeName
        || !cookingTime
        || !description
        || addedIngredients.length === 0
        || tags.length === 0
        || (!image && !recipeId)
      )
    );
    if (disabled) {
      setShowSubmitHint(true);
    } else {
      setShowSubmitHint(false);
    }
  }, [
    recipeNameError,
    cookingTimeError,
    descriptionError,
    recipeName,
    cookingTime,
    description,
    addedIngredients,
    tags,
    image,
  ]);

  useEffect(() => {
    if (recipeId) {
      api.getRecipe(recipeId)
        .then((data) => {
          setRecipeName(data.name);
          setCookingTime(data.cooking_time);
          setDescription(data.description);
          const dataTags = [];
          data.tag.forEach((tag) => (
            dataTags.push(tag.name)
          ));
          setTags(dataTags);
          setAddedIngredients(data.ingredient);
        })
        .catch((err) => {
          setResponseError(err);
          setIsOpenInfoTooltip(true);
        });
    }
  }, [recipeId]);

  return (
    <>
      {renderMainHeader(header)}
      <Form
        formRef={formRef}
        onSubmit={handleFormRecipeSubmit}
      >
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
              minLength="2"
              maxLength="50"
              required
            />
            <span className={cn('form__error', { form__error_active: recipeNameError })}>{recipeNameError}</span>
          </div>
        </div>

        <div className="form__group">
          <p className="form__label">Теги</p>
          <div className="form__field-group">
            <Tags
              selectedTags={tags}
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
                min="1"
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
            <button
              onClick={handleAddIngredient}
              type="button"
              className={cn('form__ingredient-add-btn', { 'form__ingredient-add-btn_disabled': Boolean(amountUnitsError || !amountUnits || !nameUnits) })}
              id="addIng"
              disabled={Boolean(amountUnitsError || !amountUnits || !nameUnits)}
            >
              Добавить ингредиент
            </button>
            <span className={cn('form__error', { form__error_active: amountUnitsError })}>{amountUnitsError}</span>
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
              min="1"
              maxLength="3"
              value={cookingTime}
              onChange={handkeCookingTimeChange}
              required
            />
            <span htmlFor="id_time" className="form__label">минут</span>
            <span className={cn('form__error', { form__error_active: cookingTimeError })}>{cookingTimeError}</span>
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
              minLength="2"
              maxLength="500"
              required
            />
            <span className={cn('form__error', { form__error_active: descriptionError })}>{descriptionError}</span>
          </div>
        </div>

        <div className="form__group">
          <span className="form__label">{`Загрузить${recipeId ? ' новое' : ''} фото`}</span>
          <div className="form__field-group form__field-group_photo">
            <label htmlFor="id_file" className="form__photo-file">
              {recipeId ? (
                <input
                  vaule={image}
                  onChange={handleImageChange}
                  type="file"
                  name="image"
                  id="id_file"
                  className="form__photo-input"
                />
              ) : (
                <input
                  vaule={image}
                  onChange={handleImageChange}
                  type="file"
                  name="image"
                  id="id_file"
                  className="form__photo-input"
                  required
                />
              )}
            </label>
            {image && <button type="button" onClick={handlePhotoDelete} className="form__field-item-delete" />}
            <span className="form__error" />
          </div>
        </div>
        <span className={cn('form__error form__error_server', { form__error_server_active: serverError })}>{serverError}</span>
        {/* {showSubmitHint && <div></div>} */}
        <div className="form__footer form__footer_recipe">
          <div className="form__hint-container">
            {showSubmitHint
              && (
                <div className="form__hint">
                  Необходимо:
                  {!recipeName && (
                    <>
                      <br />
                      <span> - Указать название рецепта</span>
                    </>
                  )}
                  {tags.length === 0 && (
                    <>
                      <br />
                      <span> - Хотя бы один тег (завтрак, обед или ужин)</span>
                    </>
                  )}
                  {addedIngredients.length === 0 && (
                    <>
                      <br />
                      <span> - Добавить хотя бы один ингредиент в список</span>
                    </>
                  )}
                  {!cookingTime && (
                    <>
                      <br />
                      <span> - Указать время приготовления</span>
                    </>
                  )}
                  {!description && (
                    <>
                      <br />
                      <span> - Добавить описание</span>
                    </>
                  )}
                  {(!image && !recipeId) && (
                    <>
                      <br />
                      <span> - Добавить фотографию</span>
                    </>
                  )}
                  {((recipeNameError || cookingTimeError || descriptionError)) && (
                    <>
                      <br />
                      <span> - Убедиться, что нет ошибок заполнения</span>
                    </>
                  )}
                </div>
              )}
            <SubmitButton
              blue
              text={recipeId ? 'Сохранить' : 'Создать рецепт'}
              disabled={
                loading
                || recipeNameError
                || cookingTimeError
                || descriptionError
                || (
                  !recipeName
                  || !cookingTime
                  || !description
                  || addedIngredients.length === 0
                  || tags.length === 0
                  || (!image && !recipeId)
                )
              }
              loading={loading}
            />

          </div>
          {recipeId && (
            <Button
              text="Удалить"
              underline
              onClick={handleDelete}
            />
          )}
        </div>

      </Form>
    </>
  );
}

export default FormRecipe;
