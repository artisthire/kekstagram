/**
 * Модуль HTML-элемента - кнопочного переключается величины в заданном диапазоне
 * @module ./BtnRangeSwitch
 */

/**
 * Class представляет переключатель с двумя кнопками и полем отображения значения, которое изменяется кнопками
 * Для получения значения изменившийся величины, внешний код должен подписаться на событие 'change-value'
*/
export class BtnsRangeSwitch {

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
    this._setBtnsActive(this._currentValue);

    this.outputField.value = `${this._currentValue}${this.outputValueUnit}`;

    this._onBtnsClick = this._onBtnsClick.bind(this);
    this.container.addEventListener('click', this._onBtnsClick);
  }

  _onBtnsClick(evt) {

    // если клик вне кнопок управления, ничего не делаем
    if (!this.btnMinus.contains(evt.target) && !this.btnPlus.contains(evt.target)) {
      return;
    }

    // устанавливаем знак шага в зависимости от того, по какой кнопке клик
    const valueStep = this.btnMinus.contains(evt.target) ? -this.valueStep : +this.valueStep;

    this._currentValue += valueStep;

    // ограничиваем значение величины установленными пределами
    // и соответственно отключаем кнопку увеличения либо уменьшения, если выходим за пределы
    this._currentValue = this._restrictValue(this._currentValue);
    this._setBtnsActive(this._currentValue);

    // записываем новое значение в поле отображения величины
    this.outputField.value = `${this._currentValue}${this.outputValueUnit}`;

    // создаем и вызываем событие изменения величины переключаетелем
    const changeValueEvent = new CustomEvent('change-value', {bubbles: true, detail: {value: this._currentValue}});
    this.container.dispatchEvent(changeValueEvent);
  }

  _restrictValue(value) {
    value = Math.max(value, this.minValue);
    value = Math.min(value, this.maxValue);

    return value;
  }

  _setBtnsActive(value) {
    this.btnPlus.disabled = false;
    this.btnMinus.disabled = false;

    if (value >= this.maxValue) {
      this.btnPlus.disabled = true;
    } else if (value <= this.minValue) {
      this.btnMinus.disabled = true;
    }
  }

  destructor() {
    this.container.removeEventListener('click', this._onBtnsClick);
  }

}
