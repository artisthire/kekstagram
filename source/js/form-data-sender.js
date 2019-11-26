/**
 * Модуль отправляет данные формы загрузки изображения на сервер
 * Использует функционал ChangeImgEffect для масштабирования изображения и наложения на него художественных эффектов
 * Функционал Popup используется, так как форма отображается в виде попапа
 * @module ./form-data-sender
 */
import {sendDataPicture} from './server-interaction.js';
import {Popup} from './popup.js';

export class FormDataSender {

  /**
   * Создает объект для функционала отправки данных формой загрузки изображений
   * @param {object} form - форма, данные с которой отправлются на сервер
   * @param {object} popup - ссылка на окно (попап), в котором содержится форма
   * @param {object} showFormBtn - ссылка на кнопку, с помощью которой вызывается отрытие формы загрузки изображения
   */
  constructor(form, popup, showFormBtn) {
    this.form = form;
    this.formPopup = popup;
    this.showFormBtn = showFormBtn;
    this._formData = new FormData(this.form);

    // окно, которое отображается во время загрузи изображения на сервер
    this._porgressWindow = document.querySelector('#messages').content.querySelector('.overlay').cloneNode(true);
    // окно, которое отображается при успешной загрузке изображения на сервер
    this._successWindow = document.querySelector('#success').content.querySelector('.success').cloneNode(true);
    // окно, которое отображается в случае ошибок загрузки формы на сервер
    this._errorWindow = document.querySelector('#error').content.querySelector('.error').cloneNode(true);

    this.sendData = this.sendData.bind(this);
    this._successSend = this._successSend.bind(this);
    this._errorSend = this._errorSend.bind(this);
  }

  /**
   * Отправляет данные формы загрузки изображения на сервер
   */
  sendData() {
    // добавляем окно прогресса отправки данных
    document.body.append(this._porgressWindow);
    // отправляем данные
    sendDataPicture(this._formData, this._successSend, this._errorSend);
  }

  /**
   * Callback-функция, которая вызывается при успешной отправке данных формы
   */
  _successSend() {
    // закрываем форму загрузки изображения
    this._closeFormPopup();

    // показываем окно сообщения об успешной отправке данных
    this._successWindow.classList.add('hidden');
    document.body.append(this._successWindow);

    let overlay = this._successWindow;
    let container = this._successWindow.firstElementChild;
    let inputFields = null;
    let closeBtn = this._successWindow.querySelector('.success__button');
    let successPopup = new Popup(overlay, container, inputFields, closeBtn);
    successPopup.showPopup();
    // добавляем обработчик закрытия окна успешной отправки данных
    successPopup.on(successPopup.EVENT_CLOSE_POPUP, () => this._successWindow.remove());
  }

  /**
   * Callback-функция, которая вызывается в случае ошибки отправки данных формы на сервер
   */
  _errorSend() {
    this._closeFormPopup();

    // показываем окно ошибки отправки файла
    this._errorWindow.classList.add('hidden');
    document.body.append(this._errorWindow);

    let overlay = this._errorWindow;
    let container = this._errorWindow.firstElementChild;
    let inputFields = null;
    // кнопка повторной попытки отправки данных на форму
    this._tryAgainBtn = this._errorWindow.querySelector('[data-try-again]');
    // кнопка открытия формы для загрузки новой картинки для отправки на сервер
    this._loadNewFileBtn = this._errorWindow.querySelector('[data-load-new]');
    // попап ошибки отправки закрывается при нажатии на любую из кнопок
    let closeBtns = [this._tryAgainBtn, this._loadNewFileBtn];

    this._onTryAgainBtnClick = this._onTryAgainBtnClick.bind(this);
    this._tryAgainBtn.addEventListener('click', this._onTryAgainBtnClick);
    this._onLoadNewFileBtnClick = this._onLoadNewFileBtnClick.bind(this);
    this._loadNewFileBtn.addEventListener('click', this._onLoadNewFileBtnClick);

    let errorPopup = new Popup(overlay, container, inputFields, closeBtns);
    errorPopup.showPopup();
    this._closeErrorWindow = this._closeErrorWindow.bind(this);
    errorPopup.on(errorPopup.EVENT_CLOSE_POPUP, this._closeErrorWindow);
  }

  /**
   * Функция повторной отправки данных на сервер
   * @param {object} evt - объект события клика на кнопке
   */
  _onTryAgainBtnClick(evt) {
    evt.preventDefault();
    // закрытие окна с ошибкой отправки
    this._closeErrorWindow();
    // повторная попытка отправки данных на сервер
    this.sendData();
  }

  /**
   * Функция открытия новой формы для загрузки нового изображения
   * @param {object} evt - объект события клика на кнопке
   */
  _onLoadNewFileBtnClick(evt) {
    evt.preventDefault();
    // закрытие окна с ошибкой отправки
    this._closeErrorWindow();
    // вызываем форму загрузки файла заново
    this.showFormBtn.click();
  }

  /**
   * Закрытие окна ошибки отправки изображения на сервер
   */
  _closeErrorWindow() {
    this._tryAgainBtn.removeEventListener('click', this._onTryAgainBtnClick);
    this._loadNewFileBtn.removeEventListener('click', this._onLoadNewFileBtnClick);
    this._errorWindow.remove();
  }

  /**
   * Закрытие попапа формы загрузки изображения на сервер
   * Форма закрывается при успешной и не успешной отправке данных на сервер
   * Также функция закрывает окно прогресса отправки изображения
   */
  _closeFormPopup() {
    // убираем окно прогресса отправки данных
    this._porgressWindow.remove();

    if (this.formPopup) {
      // закрываем попап с формой
      this.formPopup.closePopup();
      this.formPopup = null;
      this.form = null;
    }

  }
}
