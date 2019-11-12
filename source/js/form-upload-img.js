/**
 * Модуль формы загрузки изображения и наложения на него эффектов
 * Использует функционал ChangeImgEffect для масштабирования изображения и наложения на него художественных эффектов
 * Функционал Popup используется, так как форма отображается в виде попапа
 * @module ./form-upload-img
 */
import {ChangeImgEffect} from './change-img-effect.js';
import {Popup} from './popup.js';
import {sendDataPicture} from './server-interaction.js';
import {ValidationTooltip} from './validation-tooltip.js';

const ATTR_INVALID_INPUT = 'data-input-invalid';

/**
 * Class представляет собой объект формы для загрузки и наложения эффектов на изображение
 */
export class FormUploadImg {

  /**
   * Создает объект формы
   * @param {object} btnUploadFile - HTML-элемент - ссылка на кнопку загрузки изображения
   */
  constructor(btnUploadFile) {
    this.btnUploadFile = btnUploadFile;
    this.form = document.querySelector('#upload-select-image');

    // элементы модального окна
    this._modalOverlay = document.querySelector('.img-upload__overlay');
    this._modalContainer = this._modalOverlay.querySelector('.img-upload__wrapper');
    this._modalCloseBtn = this._modalContainer.querySelector('#upload-cancel');

    // поля формы
    this._hashtagInput = this._modalContainer.querySelector('.text__hashtags');
    this._commentInput = this._modalContainer.querySelector('.text__description');
    this._imgElement = this._modalContainer.querySelector('.img-upload__preview > img');
    this._imgsEffectPreview = Array.from(this._modalContainer.querySelectorAll('.effects__preview'));

    // добавляет обработчки загрузки файла на переданную кнопку управления
    this._onBtnUploadFileChange = this._onBtnUploadFileChange.bind(this);
    this.btnUploadFile.addEventListener('change', this._onBtnUploadFileChange);
  }

  /**
   * Создает форму загрузки изображения при выборе изображения для загрузки
   * Форма создается в отдельно попапе
   */
  _onBtnUploadFileChange() {
    let file = this.btnUploadFile.files[0];

    if (!file.type.includes('image')) {
      return;
    }

    this._urlCode = URL.createObjectURL(file);
    this._imgElement.src = this._urlCode;
    this._imgsEffectPreview.forEach((img) => img.style.backgroundImage = `url(${this._urlCode})`);

    this._popup = new Popup(this._modalOverlay, this._modalContainer, [this._hashtagInput, this._commentInput], this._modalCloseBtn, {autofocus: true});

    // добавляем обработку события открытия попапа с формой
    this._initForm = this._initForm.bind(this);
    this._popup.on(this._popup.EVENT_SHOW_POPUP, this._initForm);

    // добавляем обработку события закрытия попапа с формой
    this._destroyForm = this._destroyForm.bind(this);
    this._popup.on(this._popup.EVENT_CLOSE_POPUP, this._destroyForm);

    // отображаем попап с формой
    this._popup.showPopup();
  }

  /**
   * Функция начальной инициализации формы при отображении
   */
  _initForm() {
    // добавляем обработчик изменения масштаба и эффектов загружаемого изображения
    this._changerImgEffect = new ChangeImgEffect(this._imgElement);

    this._hashtagValidationTooltip = new ValidationTooltip(this._hashtagInput);
    this._commentValidationTooltip = new ValidationTooltip(this._commentInput);

    this._onHashtagInput = this._onHashtagInput.bind(this);
    this._hashtagInput.addEventListener('input', this._onHashtagInput);
    this._onCommentInput = this._onCommentInput.bind(this);
    this._commentInput.addEventListener('input', this._onCommentInput);

    // добавляем обработчик отправки формы
    this._onFormSubmit = this._onFormSubmit.bind(this);
    this.form.addEventListener('submit', this._onFormSubmit);
  }

  /**
   * Функция сброса формы
   * Вызывается автоматически при закрытии попапа внутри которой находится форма
   */
  _destroyForm() {
    // удаляем попап
    this._popup.off(this._popup.EVENT_SHOW_POPUP, this._initForm);
    this._popup.off(this._popup.EVENT_CLOSE_POPUP, this._destroyForm);
    this._popup = null;

    URL.revokeObjectURL(this._urlCode);

    // удаляем обработчик эффектов изображения
    this._changerImgEffect.destructor();
    this._changerImgEffect = null;

    // удаляем подсказки валидации полей ввода
    this._hashtagValidationTooltip.destroy();
    this._commentValidationTooltip.destroy();
    // сбрасываем аттрибуты валидности полей
    for (let input of this.form.querySelectorAll(`[${ATTR_INVALID_INPUT}]`)) {
      input.removeAttribute(ATTR_INVALID_INPUT);
    }

    // сбрасываем форму в исходное состояние
    this.form.reset();
    this._hashtagInput.removeEventListener('input', this._onHashtagInput);
    this._commentInput.removeEventListener('input', this._onCommentInput);
    this.form.removeEventListener('submit', this._onFormSubmit);
  }

  _onFormSubmit(evt) {
    evt.preventDefault();

    // ищем невалидные поля ввода в форме
    let invalidInputs = this.form.querySelectorAll(`[${ATTR_INVALID_INPUT}]`);

    if (invalidInputs.length !== 0) {
      // фокусировка на первом невалидном поле ввода
      invalidInputs[0].focus();
      return;
    }

    sendDataPicture(new FormData(this.form), () => this._popup.closePopup(), console.log);
  }

  _onHashtagInput(evt) {
    this._hashtagValidate(evt.target);
  }

  _onCommentInput(evt) {
    this._commentValidate(evt.target);
  }

  _hashtagValidate(inputElement) {
    let hashtags = inputElement.value;

    if (hashtags.length === 0) {
      this._hashtagValidationTooltip.destroy();
      this._markValidationInput(inputElement, true);
      return true;
    }

    const SEPARATOR = ' ';
    let tests = this._getHashtagTests();

    hashtags = hashtags.trim().toLowerCase().split(SEPARATOR);
    let status = this._inputValidate(hashtags, tests, this._hashtagValidationTooltip);

    this._markValidationInput(inputElement, status);

    return status;
  }

  _commentValidate(inputElement) {
    let comment = inputElement.value;

    if (comment.length === 0) {
      this._commentValidationTooltip.destroy();
      this._markValidationInput(inputElement, true);
      return true;
    }

    let tests = this._getCommentTests();
    let status = this._inputValidate(comment, tests, this._commentValidationTooltip);

    this._markValidationInput(inputElement, status);

    return status;
  }

  _inputValidate(inputValues, tests, validationTooltip) {
    let validationResult = {status: [], messages: []};

    tests.forEach((test) => {
      validationResult.status.push(test.func(inputValues));
      validationResult.messages.push(test.message);
    });

    if (validationResult.status.every((valid) => valid)) {
      validationTooltip.destroy();
      return true;
    }

    validationTooltip.addMessages(validationResult);
    return false;
  }

  _getHashtagTests() {
    const MAX_COUNT = 5;
    const MAX_LENGTH = 20;

    let testFunctions = {
      maxCount: (hashtags) => hashtags.length <= MAX_COUNT,
      maxLength: (hashtags) => !hashtags.some((hashtag) => hashtag.length > MAX_LENGTH),
      startsWith: (hashtags) => !hashtags.some((hashtag) => !hashtag.startsWith('#')),
      errorChart: (hashtags) => !hashtags.some((hashtag) => new RegExp('[^\\p{L}\\-#]', 'ug').test(hashtag) || hashtag.slice(1).includes('#')),
      minCharts: (hashtags) => !hashtags.some((hashtag) => hashtag.startsWith('#') && hashtag.length === 1)
    };

    testFunctions.doubleHashtags = (hashtags) => {
      if (hashtags.length < 2) {
        return true;
      }

      let uniqueHashtags = new Set(hashtags);
      return hashtags.length === uniqueHashtags.size;
    };

    let tests = [
      {func: testFunctions.maxCount, message: `Допустимо ${MAX_COUNT} хэш-тегов`},
      {func: testFunctions.maxLength, message: `Максимальная длинна хэш-тега должна быть не больше ${MAX_LENGTH} символов`},
      {func: testFunctions.startsWith, message: 'Хэш-теги должны начинаться со знака "#"'},
      {func: testFunctions.errorChart, message: 'Хэш-теги могут содержать только буквы и знак "-". И разделяться пробелом'},
      {func: testFunctions.minCharts, message: 'Хэш-теги не может состоять только из одного знака "#"'},
      {func: testFunctions.doubleHashtags, message: 'Хэш-теги не могут повторяться'}
    ];

    return tests;
  }

  _getCommentTests() {
    const MAX_LENGTH = 140;

    let testFunctions = {
      maxLength: (comment) => comment.length < MAX_LENGTH,
    };

    let tests = [
      {func: testFunctions.maxLength, message: `Максимальная длинна комментария должна быть не больше ${MAX_LENGTH} символов`},
    ];

    return tests;
  }

  _markValidationInput(inputElement, status) {

    if (status) {
      inputElement.removeAttribute(ATTR_INVALID_INPUT);
      return;
    }

    inputElement.setAttribute(ATTR_INVALID_INPUT, '');
  }
}
