/**
 * Модуль отправляет данные формы загрузки изображения на сервер
 * Использует функционал ChangeImgEffect для масштабирования изображения и наложения на него художественных эффектов
 * Функционал Popup используется, так как форма отображается в виде попапа
 * @module ./form-data-sender
 */
import {sendDataPicture} from './server-interaction.js';
import {Popup} from './popup.js';

export class FormDataSender {

  constructor(form, popup, showFormBtn) {
    this.form = form;
    this.formPopup = popup;
    this.showFormBtn = showFormBtn;
    this._formData = new FormData(this.form);

    this._porgressWindow = document.querySelector('#messages').content.querySelector('.overlay').cloneNode(true);
    this._successWindow = document.querySelector('#success').content.querySelector('.success').cloneNode(true);
    this._errorWindow = document.querySelector('#error').content.querySelector('.error').cloneNode(true);

    this.sendData = this.sendData.bind(this);
    this._successSend = this._successSend.bind(this);
    this._errorSend = this._errorSend.bind(this);
  }

  sendData() {
    // добавляем окно прогресса отправки данных
    document.body.append(this._porgressWindow);
    sendDataPicture(this._formData, this._successSend, this._errorSend);
  }

  _successSend() {
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

  _errorSend() {
    this._closeFormPopup();

    // показываем окно ошибки отправки файла
    this._errorWindow.classList.add('hidden');
    document.body.append(this._errorWindow);

    let overlay = this._errorWindow;
    let container = this._errorWindow.firstElementChild;
    let inputFields = null;
    this._tryAgainBtn = this._errorWindow.querySelector('[data-try-again]');
    this._loadNewFileBtn = this._errorWindow.querySelector('[data-load-new]');
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

  _onTryAgainBtnClick(evt) {
    evt.preventDefault();
    this._closeErrorWindow();

    this.sendData();
  }

  _onLoadNewFileBtnClick(evt) {
    evt.preventDefault();
    this._closeErrorWindow();

    // вызываем форму загрузки файла заново
    this.showFormBtn.click();
  }

  _closeErrorWindow() {
    this._tryAgainBtn.removeEventListener('click', this._onTryAgainBtnClick);
    this._loadNewFileBtn.removeEventListener('click', this._onLoadNewFileBtnClick);
    this._errorWindow.remove();
  }

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
