import {eventMixin} from './utilities-op.js';

/**
 * Модуль модального попапа
 * @module ./popup
 */

export class Popup {

  /**
   * Создает объект модального попапа
   * @param {object} overlay - HTML-элемент - ссылка на оверлей, которым закрывается документ при открытии попапа
   * @param {object} container - HTML-элемент - общий контейнер попапа, содержится непосредственно внутри оверлея
   * @param {array} inputFields - массив input-элементов, внутри которых будет игнорироваться нажатие кнопки ESC для закрытия попапа
   * @param {array} closeBtns - HTML-элемент - ссылки на кнопки закрытия окна
   * @param {object} options - объект, содержащий дополнительные настройки для открытия попапа:
   *  {string} option.hiddenPopupClass - название класса для сокрытия попапа
   *  {string} option.documentBodyClass - название класса, который добавляется к BODY при открытии попапа
   *  {boolean} option.swap - true - перемещает позицию попапа в дереве DOM в начало тега BODY (для улучшения навигации)
                              false - отменяет перемещение попапа, если его перемещение мешает логике работы сайта (попап внутри тега FORM) или ломает стили
   */
  constructor(overlay, container, inputFields, closeBtns, options = {}) {
    this.overlay = overlay;
    this.container = container;
    this.inputFields = inputFields;
    this.closeBtns = [];

    if (Array.isArray(closeBtns)) {
      this.closeBtns = closeBtns;
    } else if (closeBtns) {
      this.closeBtns.push(closeBtns);
    }

    this.hiddenPopupClass = options.hiddenPopupClass || 'hidden';
    this.documentBodyClass = options.documentBodyClass;
    this.positionSwap = options.swap;

    // название событий, которые генерируются объектом попапа
    this.EVENT_SHOW_POPUP = 'show-popup';
    this.EVENT_CLOSE_POPUP = 'close-popup';
  }

  /**
   * Открывает окно попапа
   */
  showPopup() {
    // сохраняем последний активный элемент в главном документе
    this._lastFocusElement = document.activeElement;

    // перемещаем элемент с попапом в начало документа HTML
    if ((document.body.firstElementChild !== this.overlay) && (this.positionSwap !== false)) {
      // перед перемещением сохраняем начальную позицию (элемент находящийся перед попапом)
      this._previousElement = this.overlay.previousElementSibling;
      // перемещаем элемент попапа в начало документа (в начало тега BODY)
      document.body.prepend(this.overlay);
    }

    // показываем попап
    this.overlay.classList.remove(this.hiddenPopupClass);
    // устанавливаем фокуссировку на попапе
    this.container.setAttribute('tabindex', '0');
    this.container.focus();

    // дополнительный клас на тег <BODY>, который устанавливается при открытии попапа
    if (this.documentBodyClass) {
      document.body.classList.add(this.documentBodyClass);
    }

    // вызываем событие открытия попапа
    this.trigger(this.EVENT_SHOW_POPUP);

    this._onBtnCloseClick = this._onBtnCloseClick.bind(this);
    this._onPopupEscPress = this._onPopupEscPress.bind(this);
    this._onPopupFocus = this._onPopupFocus.bind(this);
    this._onOverlayClick = this._onOverlayClick.bind(this);

    if (this.closeBtns.length) {
      for (let closeBtn of this.closeBtns) {
        closeBtn.addEventListener('click', this._onBtnCloseClick);
      }
    }

    this.overlay.addEventListener('click', this._onOverlayClick);
    document.addEventListener('keydown', this._onPopupEscPress);
    document.addEventListener('focusin', this._onPopupFocus);
  }

  /**
   * Закрывает окно попапа
   * При закрытии генерирует событие закрытия окна для внешнего кода
   */
  closePopup() {
    this.overlay.classList.add(this.hiddenPopupClass);
    // сбрасываем аттрибут возможности фокуссировки на попапе
    this.container.removeAttribute('tabindex');

    // если попап перемещался в начало документа
    if ((this.positionSwap !== false) && this._previousElement) {
      // возвращаем элемент с попапом в иходную позицию HTML-документа
      this._previousElement.after(this.overlay);
    }

    if (this.documentBodyClass) {
      document.body.classList.remove(this.documentBodyClass);
    }

    if (this.closeBtns.length) {
      for (let closeBtn of this.closeBtns) {
        closeBtn.removeEventListener('click', this._onBtnCloseClick);
      }
    }

    this.overlay.removeEventListener('click', this._onOverlayClick);
    document.removeEventListener('keydown', this._onPopupEscPress);
    document.removeEventListener('focusin', this._onPopupFocus);

    // вызываем событие закрытия попапа
    this.trigger(this.EVENT_CLOSE_POPUP);

    // устанавливаем фокус на последний активный элемент основного окна
    if (this._lastFocusElement) {
      this._lastFocusElement.focus();
    }
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
    // если нажата кнопка ESC
    if (evt.code === 'Escape') {

      // кнопка не в одном из полей ввода
      if (this.inputFields && this.inputFields.includes(evt.target)) {
        return;
      }
      // закрываем попап
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

    evt.stopPropagation();
    // возвращаем фокус на попап
    this.container.focus();
    /*
    // получаем и фокусируемся на первом доступном для фокусировки элементе внутри попапа
    let firstFocusableElement = this._getFirstElementForFocus(this.container);

    if (firstFocusableElement) {
      firstFocusableElement.focus();
    }
    */
  }


  /**
   * Возвращает первый видимый элемент, на который можно установить фокус
   * @param {object} container - HTML-элемент - общий контейнер элементов
   * @return {object} -  первый видимый элемент, на который можно установить фокус
   */
  /*
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
  */

  /**
   * Возвращает все HTML-элементы внутри контейнера, которые могут получать фокус
   * @param {object} container - HTML-элемент - общий контейнер элементов
   * @return {array} -  массив HTML-элементов в порядке следования в контейнере, которые могут получать фокус
   */
  /*
  _getFocusableElements(container) {

    return Array.from(container.querySelectorAll(`input:not(:disabled),select:not(:disabled),
      textarea:not(:disabled),a:not(:disabled),button:not(:disabled),[tabindex="0"]`));
  }
  */

}

// в прототип объекта добавляем примесь для генерации событий объектом модального окна
Object.assign(Popup.prototype, eventMixin);
