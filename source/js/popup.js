/**
 * Модуль модального попапа
 * @module ./popup
 */

export class Popup {

  // название события, которое генерируется объектом попапа при закрытии окна
  _eventType = 'close-popup';

  /**
   * Создает объект модального попапа
   * @param {object} overlay - HTML-элемент - ссылка на оверлей, которым закрывается документ при открытии попапа
   * @param {object} container - HTML-элемент - общий контейнер попапа, содержится непосредственно внутри оверлея
   * @param {array} inputFields - массив input-элементов, внутри которых будет игнорироваться нажатие кнопки ESC для закрытия попапа
   * @param {object} closeBtn - HTML-элемент - ссылка на кнопку закрытия окна
   * @param {string} hidePopupClass - строка с именем класса, который нужно убрать для открытия окна
   * @param {string} documentBodyClass - строка с именем класса, который нужно добавить к BODY при открытии окна
   */
  constructor(overlay, container, inputFields, closeBtn, hidePopupClass, documentBodyClass) {
    this.overlay = overlay;
    this.container = container;
    this.inputFields = inputFields;
    this.closeBtn = closeBtn;
    this.hidePopupClass = hidePopupClass || 'hidden';
    this.documentBodyClass = documentBodyClass;
  }

  /**
   * Открывает окно попапа
   * @param {function} callbackFunc - функция, которая должна быть вызвана из внешнего кода при открытии окна
   */
  showPopup(callbackFunc) {
    this.overlay.classList.remove(this.hidePopupClass);

    // дополнительный клас на тег <BODY>, который устанавливается при открытии попапа
    if (this.documentBodyClass) {
      document.body.classList.add(this.documentBodyClass);
    }

    if (callbackFunc) {
      callbackFunc();
    }

    // получаем и фокусируемся на первом доступном для фокусировки элементе внутри попапа
    let firstFocusableElement = this._getFirstElementForFocus(this.container);

    if (firstFocusableElement) {
      firstFocusableElement.focus();
    }

    this._onBtnCloseClick = this._onBtnCloseClick.bind(this);
    this._onPopupEscPress = this._onPopupEscPress.bind(this);
    this._onPopupFocus = this._onPopupFocus.bind(this);
    this._onOverlayClick = this._onOverlayClick.bind(this);
    this.closeBtn.addEventListener('click', this._onBtnCloseClick);
    this.overlay.addEventListener('click', this._onOverlayClick);
    document.addEventListener('keydown', this._onPopupEscPress);
    document.addEventListener('focusin', this._onPopupFocus);
  }

  /**
   * Закрывает окно попапа
   * При закрытии генерирует событие закрытия окна для внешнего кода
   */
  closePopup() {
    this.overlay.classList.add(this.hidePopupClass);

    if (this.documentBodyClass) {
      document.body.classList.remove(this.documentBodyClass);
    }

    this.closeBtn.removeEventListener('click', this._onBtnCloseClick);
    this.overlay.removeEventListener('click', this._onOverlayClick);
    document.removeEventListener('keydown', this._onPopupEscPress);
    document.removeEventListener('focusin', this._onPopupFocus);

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

  /**
   * Обрабатывает закрытие окна при клике на кнопке закрытия
   * @param {object} evt - объект события
   */
  _onBtnCloseClick(evt) {
    evt.preventDefault();
    this.closePopup();
  }

  /**
   * Обрабатывает закрытие окна при нажатии кнопки ESC
   * @param {object} evt - объект события
   */
  _onPopupEscPress(evt) {

    // если нажата кнопка ESC не в одном из полей ввода
    if (evt.code === 'Escape' && !this.inputFields.includes(evt.target)) {
      this.closePopup();
    }
  }

  /**
   * Обрабатывает закрытие окна при клике вне попапа (в данном случае на подложке (оверлей))
   * @param {object} evt - объект события
   */
  _onOverlayClick(evt) {

    if (this.container.contains(evt.target)) {
      return;
    }

    this.closePopup();
  }

  /**
   * Предотвращает переход фокуса на элементы вне попапа, когда окно открыто
   * @param {object} evt - объект события
   */
  _onPopupFocus(evt) {

    if (this.container.contains(evt.target)) {
      return;
    }

    // получаем и фокусируемся на первом доступном для фокусировки элементе внутри попапа
    let firstFocusableElement = this._getFirstElementForFocus(this.container);

    if (firstFocusableElement) {
      firstFocusableElement.focus();
    }
  }

  /**
   * Возвращает первый видимый элемент, на который можно установить фокус
   * @param {object} container - HTML-элемент - общий контейнер элементов
   * @return {object} -  первый видимый элемент, на который можно установить фокус
   */
  _getFirstElementForFocus(container) {
    // выбираем все элементы в контейнере, которые могут быть сфокусированны
    let focusableElements = this._getFocusableElements(container);

    // получаем первый не скрытый элемент
    let firstVisibleElement = focusableElements.find((element) => {
      // только видимые элементы имеют размеры
      return element.offsetWidth && element.offsetHeight;
    });

    return firstVisibleElement;
  }

  /**
   * Возвращает все HTML-элементы внутри контейнера, которые могут получать фокус
   * @param {object} container - HTML-элемент - общий контейнер элементов
   * @return {array} -  массив HTML-элементов в порядке следования в контейнере, которые могут получать фокус
   */
  _getFocusableElements(container) {

    return Array.from(container.querySelectorAll(`input:not(:disabled),select:not(:disabled),
      textarea:not(:disabled),a:not(:disabled),button:not(:disabled),[tabindex="0"]`));
  }

}
