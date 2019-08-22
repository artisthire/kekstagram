export class Popup {
  // TODO: добавить запрет на переход фокуса из внутренних элементов попапа при его открытии
  _eventType = 'close-popup';

  constructor(container, inputFields, closeBtn, hidePopupClass, documentBodyClass) {
    this.container = container;
    this.inputFields = inputFields;
    this.closeBtn = closeBtn;
    this.hidePopupClass = hidePopupClass || 'hidden';
    this.documentBodyClass = documentBodyClass;
  }

  showPopup(callbackFunc) {
    this.container.classList.remove(this.hidePopupClass);

    // дополнительный клас на тег <BODY>, который устанавливается при открытии попапа
    // устанавливается, только если его название передается при создании объекта попапа
    if (this.documentBodyClass) {
      document.body.classList.add(this.documentBodyClass);
    }

    if (callbackFunc) {
      callbackFunc();
    }

    // получаем и фокусируемся на первом доступном для фокусировки элементе внутри попапа
    this._firstFocusableElement = this._getFirstElementForFocus(this.container);
    if (this._firstFocusableElement) {
      this._firstFocusableElement.focus();
    }

    this._onBtnCloseClick = this._onBtnCloseClick.bind(this);
    this._onPopupEscPress = this._onPopupEscPress.bind(this);
    this.closeBtn.addEventListener('click', this._onBtnCloseClick);
    document.addEventListener('keydown', this._onPopupEscPress);
  }

  closePopup() {
    this.container.classList.add(this.hidePopupClass);

    if (this.documentBodyClass) {
      document.body.classList.remove(this.documentBodyClass);
    }

    this.closeBtn.removeEventListener('click', this._onBtnCloseClick);
    document.removeEventListener('keydown', this._onPopupEscPress);

    this._firstFocusableElement = null;

    // создаем и вызываем событие закрытия попапа
    const closePopupEvent = new CustomEvent(this._eventType, {bubbles: true});
    this.container.dispatchEvent(closePopupEvent);
  }

  /**
   * Метод позволяет ПОДписаться на событие закрытия попапа
   * @param {object} callbackFunc - каллбэк-функция, которая будет вызываться срабатывании события
   */
  addClosePopupListener(callbackFunc) {
    this.container.addEventListener(this._eventType, callbackFunc);
  }

  /**
   * Метод позволяет ОТписаться от события закрытия попапа
   * @param {object} callbackFunc - каллбэк-функция, передавалась когда подписывались на событие
   */
  removeClosePopupListener(callbackFunc) {
    this.container.removeEventListener(this._eventType, callbackFunc);
  }

  _onBtnCloseClick(evt) {
    evt.preventDefault();
    this.closePopup();
  }

  _onPopupEscPress(evt) {

    if (evt.code === 'Escape' && !this.inputFields.includes(evt.target)) {
      this.closePopup();
    }
  }

  _getFirstElementForFocus(container) {
    // выбираем все элементы в контейнере, которые могут быть сфокусированны
    let focusableElements = this._getFocusableElements(container);

    let firstVisibleElement = focusableElements.find((element) => {
      // только видимые элементы имеют размеры
      return element.offsetWidth && element.offsetHeight;
    });

    return firstVisibleElement;
  }

  _getFocusableElements(container) {
    return Array.from(container.querySelectorAll('input:not(:disabled),select:not(:disabled),textarea:not(:disabled),a:not(:disabled),button:not(:disabled),[tabindex="0"]'));
  }

}
