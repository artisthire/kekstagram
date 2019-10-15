/**
 * Модуль формы загрузки изображения и наложения на него эффектов
 * Использует функционал ChangeImgEffect для масштабирования изображения и наложения на него художественных эффектов
 * Функционал Popup используется, так как форма отображается в виде попапа
 * @module ./form-upload-img
 */
import {ChangeImgEffect} from './change-img-effect.js';
import {Popup} from './popup.js';
import {sendDataPicture} from './server-interaction.js';

/**
 * Class представляет собой объект формы для загрузки и наложения эффектов на изображение
 */
export class FormUploadImg {
  _popup;
  _changerImgEffect;

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
    this._descriptionInput = this._modalContainer.querySelector('.text__description');
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

    this._popup = new Popup(this._modalOverlay, this._modalContainer, [this._hashtagInput, this._descriptionInput], this._modalCloseBtn, {autofocus: true});

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

    // сбрасываем форму в исходное состояние
    this.form.reset();
    this.form.removeEventListener('submit', this._onFormSubmit);
  }

  _onFormSubmit(evt) {
    evt.preventDefault();

    sendDataPicture(new FormData(this.form), () => this._popup.closePopup(), console.log);
  }
}
