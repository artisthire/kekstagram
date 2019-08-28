/**
 * Модуль HTML-элемента - кнопочного переключается величины в заданном диапазоне
 * @module ./btns-range-switch
 */

/**
 * Class представляет переключатель с двумя кнопками и полем отображения значения, которое изменяется кнопками
 * Для получения значения изменившийся величины, внешний код должен подписаться на событие 'change-value'
*/
export class BtnsRangeSwitch {

  _EVENT_TYPE = 'change-value';

  /**
   * Создает объект переключателя с двумя кнопками и полем отображения изменяющейся величины
   * @param {object} htmlElements - содержит ссылки на HTML-элементы из которых состоит переключатель:
   *  container - общий элемент-контейнер;
   *  btnMinus - кнопка уменьшения значения (если не передан, то первый тег "button" в контейнере);
   *  btnPlus - кнопка увеличения значения (если не передан, то второй тег "button" в контейнере);
   *  outputField - поле для отображения изменяющегося значения (если не передан, то первое поле input[type=text] в контейнере).
   * @param {object} range - содержит данные о характеристиках величины, которая изменяется переключателем:
   *  valueUnit - единицы измерения величины (для визуального отображения после числа в outputField, по умолчанию равно "%");
   *  startValue - значение величины с которой начинается переключение (по умолчанию = 0);
   *  valueStep - шаг изменения величины (по умолчанию = 10);
   *  minValue, maxValue - границы изменения величины переключателем (по умолчанию от 0 до 100).
   */
  constructor(htmlElements, range) {
    this.container = htmlElements.container;
    this.btnMinus = htmlElements.btnMinus || this.container.querySelectorAll('button')[0];
    this.btnPlus = htmlElements.btnPlus || this.container.querySelectorAll('button')[1];
    this.outputField = htmlElements.outputField || this.container.querySelector('input[type="text"]');
    this.outputValueUnit = range.valueUnit || '%';
    this.startValue = range.startValue || 0;
    this.valueStep = range.valueStep || 10;
    this.minValue = range.minValue || 0;
    this.maxValue = range.maxValue || 100;

    this._currentValue = this._restrictValue(this.startValue);
    this._setElementsStatus(this._currentValue);

    this._onBtnsClick = this._onBtnsClick.bind(this);
    this.container.addEventListener('click', this._onBtnsClick);
  }

  /**
   * Метод позволяет ПОДписаться на событие изменения величины в переключателе
   * и вызывать каллбэк-функцию при каждом изменении
   * @param {object} callbackFunc - каллбэк-функция, которая будет вызываться при изменении величины в переключателе
   */
  addChangeListener(callbackFunc) {
    this.container.addEventListener(this._EVENT_TYPE, callbackFunc);
  }

  /**
   * Метод позволяет ОТписаться от события изменения величины в переключателе
   * @param {object} callbackFunc - каллбэк-функция, которую внешний код передал при подписывании на событие
   */
  removeChangeListener(callbackFunc) {
    this.container.removeEventListener(this._EVENT_TYPE, callbackFunc);
  }

  /**
   * Метод удаляет обработчк события нажатия на кнопки изменения величины
   * Должен вызваться внешним кодом, когда переключатель больше не нужен
   */
  destructor() {
    this.container.removeEventListener('click', this._onBtnsClick);
  }

  /**
   * Обрабатывает изменение величины в переключателе при нажатии на кнопках уменьшения/увеличения значения
   * обработчик устанавливается на контейнер кнопок
   * @param {object} evt - объект события
   */
  _onBtnsClick(evt) {

    // если клик вне кнопок управления, ничего не делаем
    if (!this.btnMinus.contains(evt.target) && !this.btnPlus.contains(evt.target)) {
      return;
    }

    // устанавливаем знак шага в зависимости от того, по какой кнопке клик
    const valueStep = this.btnMinus.contains(evt.target) ? -this.valueStep : +this.valueStep;

    this._currentValue += valueStep;

    this._currentValue = this._restrictValue(this._currentValue);
    this._setElementsStatus(this._currentValue);

    // вызываем событие изменения величины переключаетелем
    this._dispatchCustomEvent(this._currentValue);
  }

  /**
   * Включает/отключает кнопки управления и отображает текущее значение переключаемой величины
   * @param {number} value - текущее значение величины
   */
  _setElementsStatus(value) {
    // ограничиваем значение величины установленными пределами
    // и соответственно отключаем кнопку увеличения либо уменьшения, если выходим за пределы
    this._setBtnsActive(value);

    // записываем новое значение в поле отображения величины
    this.outputField.value = `${value}${this.outputValueUnit}`;
  }

  /**
   * Ограничивает возможное изменение величины в переключателе в соответствии с заданными границами
   * @param {number} value - текущее значение величины после переключения кнопками
   * @return {number} - значение величины после ограничения
   */
  _restrictValue(value) {
    value = Math.max(value, this.minValue);
    value = Math.min(value, this.maxValue);

    return value;
  }

  /**
   * Отключает кнопку уменьшения либо увеличения величины, если достигнута нижняя или верхняя граница диапазона
   * @param {number} value - текущее значение величины после переключения кнопками
   */
  _setBtnsActive(value) {
    this.btnPlus.disabled = false;
    this.btnMinus.disabled = false;

    if (value >= this.maxValue) {
      this.btnPlus.disabled = true;
    } else if (value <= this.minValue) {
      this.btnMinus.disabled = true;
    }
  }

  /**
   * Посылает кастомное событие при измененнии величины переключателем
   * @param {number} currentValue - текущее значение величины, которая меняется переключателем
   */
  _dispatchCustomEvent(currentValue) {
    const changeValueEvent = new CustomEvent(this._EVENT_TYPE, {bubbles: true, detail: {value: currentValue}});
    this.container.dispatchEvent(changeValueEvent);
  }
}
