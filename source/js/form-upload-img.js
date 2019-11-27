/**
 * Модуль формы загрузки изображения и наложения на него эффектов
 * Использует функционал ChangeImgEffect для масштабирования изображения и наложения на него художественных эффектов
 * Функционал Popup используется, так как форма отображается в виде попапа
 * @module ./form-upload-img
 */
import {ChangeImgEffect} from './change-img-effect.js';
import {Popup} from './popup.js';
import {FormDataSender} from './form-data-sender.js';
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

    this._popup = new Popup(this._modalOverlay, this._modalContainer, [this._hashtagInput, this._commentInput], this._modalCloseBtn, {swap: false});

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

  /**
   * Функция-каллбэк для события отправки формы
   * @param {object} evt - объект события
   */
  _onFormSubmit(evt) {
    evt.preventDefault();

    // ищем невалидные поля ввода в форме
    let invalidInputs = this.form.querySelectorAll(`[${ATTR_INVALID_INPUT}]`);

    // есои есть невалидные поля, форму не отправляем
    if (invalidInputs.length !== 0) {
      // фокусировка на первом невалидном поле ввода
      invalidInputs[0].focus();
      return;
    }

    // отправляем данные формы
    let sender = new FormDataSender(this.form, this._popup, this.btnUploadFile);
    sender.sendData();
    // sendDataPicture(new FormData(this.form), () => this._popup.closePopup(), console.log);
  }

  /**
   * Функция-каллбэк ввода в поле хэш-тегов
   * @param {object} evt - объект события
   */
  _onHashtagInput(evt) {
    // проверяем валидность поля хэш-тега
    this._hashtagValidate(evt.target);
  }

  /**
   * Функция-каллбэк ввода в поле комментариев
   * @param {object} evt - объект события
   */
  _onCommentInput(evt) {
    // проверяем валидность поля комментариев
    this._commentValidate(evt.target);
  }

  /**
   * Функция для проверки валидности поля ввода хэш-тегов
   * @param {object} inputElement - ссылка на INPUT поля ввода хэщ-тегов
   * @return {boolean} - статус, соответствует ли поле всем критериям валидации
   */
  _hashtagValidate(inputElement) {
    let hashtags = inputElement.value;

    // поле необязательное, поэтому если ничего не введено, поле валидно
    if (hashtags.length === 0) {
      // удаляем подсказку с ошибками валидации
      this._hashtagValidationTooltip.destroy();
      // убираем аттрибут невалидности поля
      this._markValidationInput(inputElement, true);

      return true;
    }
    // разделитель хэш-тегов в воле ввода
    const SEPARATOR = ' ';
    hashtags = hashtags.trim().toLowerCase().split(SEPARATOR);
    // получаем тесты для критериев, которым должно соответствовать поле
    let tests = this._getHashtagTests();
    // проверяем соответствие поля полученным тестам
    // при несоотвествии отображаем ошибку валидации
    let status = this._inputValidate(hashtags, tests, this._hashtagValidationTooltip);
    // помечаем поле невалидным, если status = false
    this._markValidationInput(inputElement, status);

    return status;
  }

  /**
   * Функция для проверки валидности поля ввода комментариев
   * @param {object} inputElement - ссылка на INPUT поля ввода комментариев
   * @return {boolean} - статус, соответствует ли поле всем критериям валидации
   */
  _commentValidate(inputElement) {
    let comment = inputElement.value;

    // поле не обязательное, поэтму если ничего не введено, поле валидно
    if (comment.length === 0) {
      // удаляем подсказку с ошибками валидации
      this._commentValidationTooltip.destroy();
      // убираем аттрибут невалидности поля
      this._markValidationInput(inputElement, true);

      return true;
    }
    // получаем тести для критериев валидност поля
    let tests = this._getCommentTests();
    // проверяем валидност поля и показываем подсказку с критериями в случае невалидности
    let status = this._inputValidate(comment, tests, this._commentValidationTooltip);
    // помечаем поле невалидным, если status = false
    this._markValidationInput(inputElement, status);

    return status;
  }

  /**
   * Метод тестирует валидируемое поле в соотвествии с критериями
   * При необходимости показывает ошибки валидации поля формы
   * @param {string} inputValues - строковое значение поля формы
   * @param {object} tests - объект с тестами, проверяющими валидность поля, и сообщениями, которым должно соответствовать поле
   * @param {object} validationTooltip - экземляр объекта класса, реализующего функционал отображения ошибок валидации
   * @return {boolean} - статус, соответствует ли поле всем критериям валидации
   */
  _inputValidate(inputValues, tests, validationTooltip) {
    // переменная содержит список статуса валидации и соответствующего текста критерия валидации
    let validationResult = {status: [], messages: []};

    // заполяем переменную результатами тестирования поля и соотвествующими строковыми описаниями критериев тестирования
    tests.forEach((test) => {
      validationResult.status.push(test.func(inputValues));
      validationResult.messages.push(test.message);
    });

    // если все тесты пройдены (все поля = true), удаляем сообщения ошибок валидации
    if (validationResult.status.every((valid) => valid)) {
      validationTooltip.destroy();

      return true;
    }

    // добавляем сообщения с ошибками валидации
    validationTooltip.addMessages(validationResult);

    return false;
  }

  /**
   * Функция возвращающая тесты (функции) которыми проверяется валидность поля хэш-тегов
   * А также сообщения критериев валидации, которые соответствуют применяемым тестам к полю
   * @return {array} - массив с функциями для теститрования поля и строковым описанием критериев
   */
  _getHashtagTests() {
    // максимальное колличество хэш-тегов
    const MAX_COUNT = 5;
    // максимальное колличество символов каждого отдельного хэш-тега
    const MAX_LENGTH = 20;

    // функции тестирования соотвествия критериям
    let testFunctions = {
      maxCount: (hashtags) => hashtags.length <= MAX_COUNT,
      maxLength: (hashtags) => !hashtags.some((hashtag) => hashtag.length > MAX_LENGTH),
      startsWith: (hashtags) => !hashtags.some((hashtag) => !hashtag.startsWith('#')),
      errorChart: (hashtags) => !hashtags.some((hashtag) => new RegExp('[^A-Za-z\u0400-\u04FF\\-#]', 'g').test(hashtag) || hashtag.slice(1).includes('#')),
      minCharts: (hashtags) => !hashtags.some((hashtag) => hashtag.startsWith('#') && hashtag.length === 1)
    };

    testFunctions.doubleHashtags = (hashtags) => {
      if (hashtags.length < 2) {
        return true;
      }

      let uniqueHashtags = new Set(hashtags);
      return hashtags.length === uniqueHashtags.size;
    };

    // массив с тестами и текстовым описанием критериев
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

  /**
   * Функция возвращающая тесты (функции) которыми проверяется валидность поля коментариев
   * А также сообщения критериев валидации, которые соответствуют применяемым тестам к полю
   * @return {array} - массив с функциями для теститрования поля и строковым описанием критериев
   */
  _getCommentTests() {
    // максимальное колличество символов поля комментарив
    const MAX_LENGTH = 140;

    // функции для тестирования поля комментариев
    let testFunctions = {
      maxLength: (comment) => comment.length < MAX_LENGTH,
    };

    // тесты для поля ввода комментариев и сооответствующие текстовые описание критериев
    let tests = [
      {func: testFunctions.maxLength, message: `Максимальная длинна комментария должна быть не больше ${MAX_LENGTH} символов`},
    ];

    return tests;
  }

  /**
   * Добавляет/удаляет аттрибут невалидности валидируемого поля
   * @param {object} inputElement - HTML-элемент поля ввода, к которому добавляется аттрибут
   * @param {boolean} status - true - поле валидно, убрать аттрибут, false - не валидно, добавить аттрибут
   */
  _markValidationInput(inputElement, status) {

    if (status) {
      inputElement.removeAttribute(ATTR_INVALID_INPUT);
      return;
    }

    inputElement.setAttribute(ATTR_INVALID_INPUT, '');
  }
}
