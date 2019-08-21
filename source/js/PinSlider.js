/**
 * Модуль слайдера с одним указателем
 * @module ./PinSlider
 */

/** Class представляет слайдер с одним указателем, перемещающимя в пределах контейнера слайдера */
export class PinSlider {

  _coordShift = 0;
  _containerWidth = 0;
  _containerCoordLeft = 0;

  /**
   * Создает объект слайдера
   * @param {object} container - HTML-элемент - общий контейнер слайдера, в пределах которого перемещается указатель
   * @param {object} pin - HTML-элемент - указатель слайдера
   * @param {object} depth - HTML-элемент - деконативный заполнитель между началом слайдера и позицией указателя
   * @param {function} callbackFunc - функция обратного вызова, которая вызвается при перемещении указателя слайдера
   */
  constructor(container, pin, depth, callbackFunc) {
    this.container = container;
    this.pin = pin;
    this.depth = depth;
    this.callbackFunc = callbackFunc;

    this._onPinMousedown = this._onPinMousedown.bind(this);
    this._onPinKeydown = this._onPinKeydown.bind(this);

    // обработчики изменения положения указателя с помощью мыши и клавиатуры
    this.pin.addEventListener('mousedown', this._onPinMousedown);
    this.pin.addEventListener('keydown', this._onPinKeydown);

    // отменяет встроенную в браузер обработку события перемещения элемента
    this.pin.addEventListener('dragstart', this._onPinDragStart);
  }

  /**
   * Обрабатывает событие старта перемещения указателя слайдера с помощью мыши
   * @param {object} evt - объект события
   */
  _onPinMousedown(evt) {
    // получаем начальные данные о характеристиках и положении указателя и контейнера слайдера
    const {pinStartCoordLeft, pinRadius, containerWidth, containerCoordLeft} = this._getStartPreferences();

    this._containerWidth = containerWidth;
    this._containerCoordLeft = containerCoordLeft;

    // сдвиг координат вычисляется с учетом позиции клика внутри периметра указателя
    // и когда в CSS стилях позиция указателя устанавливается по центру указателя(а не по левому краю)
    this._coordShift = evt.pageX - pinStartCoordLeft - pinRadius;

    this._onPinMousemove = this._onPinMousemove.bind(this);
    this._onPinMouseup = this._onPinMouseup.bind(this);

    document.addEventListener('mousemove', this._onPinMousemove);
    document.addEventListener('mouseup', this._onPinMouseup);
  }

  /**
   * Обрабатывает перемещение указателя слайдера с помощью мыши
   * @param {object} evt - объект события
   */
  _onPinMousemove(evt) {
    let pinCoordLeft = evt.pageX - this._containerCoordLeft - this._coordShift;

    pinCoordLeft = this._restrictPinCoords(pinCoordLeft, this._containerWidth);

    this._setStyleElements(pinCoordLeft, this._containerWidth);

    // вызываем каллбек, передаем текущие координаты указателя и ширину контейнера
    this._dispatchCustomEvent(pinCoordLeft, this._containerWidth);
  }

  /**
   * Удаляет ненужные обработчики при отпускании кнопки мыши
   */
  _onPinMouseup() {
    document.removeEventListener('mousemove', this._onPinMousemove);
    document.removeEventListener('mouseup', this._onPinMouseup);
  }

  /**
   * Отменяет встроенную в браузер обработку события перемещения элемента
   * @param {object} evt - объект события
   */
  _onPinDragStart(evt) {
    evt.preventDefault();
  }

  /**
   * Обрабатывает перемещение указателя слайдера с помощью клавиатуры
   * @param {object} evt - объект события
   */
  _onPinKeydown(evt) {

    // перемещение возможно только клавишами управления "Влево" и "Вправо"
    if (evt.code !== 'ArrowLeft' && evt.code !== 'ArrowRight') {
      return;
    }

    const {pinStartCoordLeft, pinRadius, containerWidth, containerCoordLeft} = this._getStartPreferences();

    // задаем шаг изменения координаты указателя при перемещении клавиатурой
    // здесь 0,5% от ширины контейнера (т.е. такое же приращение будет передаваться наружу через каллбэк-функцию)
    const coordStep = containerWidth / 200;

    // увеличиваем или уменьшаем позицию указателя в зависимости от того какая клавиша была нажата
    let pinCoordStep = (evt.code === 'ArrowLeft') ? -coordStep : +coordStep;

    // новая коордитана указателя у учетом приращения и центрирования указателя в стилях CSS
    let pinCoordLeft = pinStartCoordLeft + pinCoordStep - containerCoordLeft + pinRadius;

    pinCoordLeft = this._restrictPinCoords(pinCoordLeft, containerWidth);

    this._setStyleElements(pinCoordLeft, containerWidth);

    // вызываем каллбек, передаем текущие координаты указателя и ширину контейнера
    this._dispatchCustomEvent(pinCoordLeft, containerWidth);
  }

  /**
   * Вычисляет начальные характеристики контейнера и указателя слайдера для изменения положения слайдера с их учетом
   * @return {object} - объект с координатой указателя относительно окна, радиусом указателя, шириной и координатой контейнера
   */
  _getStartPreferences() {
    const pinStartCoordLeft = this.pin.getBoundingClientRect().left + pageXOffset;
    const pinRadius = this.pin.offsetWidth / 2;
    const containerWidth = this.container.offsetWidth;
    const containerCoordLeft = this.container.getBoundingClientRect().left + pageXOffset;

    return {pinStartCoordLeft, pinRadius, containerWidth, containerCoordLeft};
  }

  /**
   * Ограничивает координаты указателя пределами контейнера слайдера
   * @param {number} pinCoordLeft - координата указателя до ограничения (изменненная мышью или клавиатурой)
   * @param {number} containerWidth - ширина контейнера слайдера
   * @return {number} - координата указателя слайдера с учетом ограничений
   */
  _restrictPinCoords(pinCoordLeft, containerWidth) {
    // накладываем ограничение координаты границами контейнера
    pinCoordLeft = Math.max(pinCoordLeft, 0);
    pinCoordLeft = Math.min(pinCoordLeft, containerWidth);

    return pinCoordLeft.toFixed(2);
  }

  /**
   * Применяет CSS-стили к указателю и заполнителю слайдера в соответствии с изменением положения указателя
   * Проверяет наличие ссылки на заполнитель в слайдере (передается при создании объекта), и если его нет, стили к нему не применяются
   * @param {number} pinCoordLeft - координата указателя
   * @param {number} containerWidth - ширина контейнера слайдера
   */
  _setStyleElements(pinCoordLeft, containerWidth) {
    // сдвигаем указатель
    this.pin.style.left = `${pinCoordLeft}px`;

    // если есть заполнитель, устанавливаем его ширину в процентах
    if (this.depth) {
      this.depth.style.width = `${((pinCoordLeft / containerWidth) * 100).toFixed(2)}%`;
    }
  }

  _dispatchCustomEvent(pinCoordLeft, containerWidth) {
    const changeCoordEvent = new CustomEvent('change-coord', {bubbles: true, detail: {coord: pinCoordLeft, containerWidth: containerWidth}});
    this.container.dispatchEvent(changeCoordEvent);
  }

  /**
   * Метод удаляет обработчки событий изменения положения указателя
   * Должен вызваться внешним кодом, когда слайдер больше не нужен
   */
  destructor() {
    this.pin.removeEventListener('mousedown', this._onPinMousedown);
    this.pin.removeEventListener('dragstart', this._onPinDragStart);
    this.pin.removeEventListener('keydown', this._onPinKeydown);
  }
}
