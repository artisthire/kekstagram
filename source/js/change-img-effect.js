import {PinSlider} from './pin-slider.js';

export class ChangeImgEffect {

  _DEFAULT_EFFECT = 'none';
  _EFFECT_PATTERN = 'effects__preview--';

  // содержит массив для связи между выбранным input в HTML и стилем свойства filter в CSS для примерения эффекта
  _effectNameToCss = {
    chrome: {filterName: 'grayscale', minValue: 0, maxValue: 1, filterUnit: ''},
    sepia: {filterName: 'sepia', minValue: 0, maxValue: 1, filterUnit: ''},
    marvin: {filterName: 'invert', minValue: 0, maxValue: 100, filterUnit: '%'},
    phobos: {filterName: 'blur', minValue: 0, maxValue: 5, filterUnit: 'px'},
    heat: {filterName: 'brightness', minValue: 1, maxValue: 3, filterUnit: ''}
  };

  // _pinSlider;
  // флаг были ли изменения эффектов на картинке
  _isEffectChanged = false;

  constructor(imgElement) {
    // картинка к которой применяем изменения
    this.imgElement = imgElement;
    // контейнер с радиокнопками для переключения эффектов
    this.container = document.querySelector('.effects__list');
    this.btnDefaultEffect = this.container.querySelector('#effect-none');

    // контейнер для поля установки величены выбранного эффекта
    // также внутри этого контейнера находится слайдер для изменения степени наложенного эффекта
    this.effectFieldContainer = document.querySelector('.img-upload__effect-level');
    this.outputFieldEffectLevel = this.effectFieldContainer.querySelector('.effect-level__value');

    // элементы слайдера изменения степени выбранного эффекта
    this._sliderContainer = this.effectFieldContainer.querySelector('.effect-level__line');
    this._sliderPin = this._sliderContainer.querySelector('.effect-level__pin');
    this._sliderDepth = this._sliderContainer.querySelector('.effect-level__depth');

    // устанавливаем выбранной кнопку эффекта по умолчанию
    this.btnDefaultEffect.checked = true;
    // изначально слайдер изменения степени эффекта скрыт
    this.effectFieldContainer.style.display = 'none';

    this._onBtnsImageEffectChange = this._onBtnsImageEffectChange.bind(this);
    this.container.addEventListener('change', this._onBtnsImageEffectChange);
  }

  destructor() {
    this._resetImageEffect();

    this.container.removeEventListener('change', this._onBtnsImageEffectChange);

    if (this._pinSlider) {
      this._pinSlider.removeChangeListener(this._setEffectLevel);
      this._pinSlider.destructor();
      this._pinSlider = null;
    }
  }

  _onBtnsImageEffectChange() {
    this._isEffectChanged = true;

    // сбрасываем ранее наложенные эффекты
    this._resetImageEffect();

    // значение выбранного эффекта сохраняем в глобальную переменную
    let selectedEffectBtn = this._getCheckedElement();

    if (selectedEffectBtn.value === this._DEFAULT_EFFECT) {
      this.effectFieldContainer.style.display = 'none';

      this._pinSlider.removeChangeListener(this._setEffectLevel);
      this._pinSlider.destructor();
      this._pinSlider = null;
    } else {
      // показываем слайдер управления уровнем эффекта
      this.effectFieldContainer.style.display = '';
      // добавялем класс к карнитке согласно выбранного эффекта
      this.imgElement.classList.add(this._EFFECT_PATTERN + selectedEffectBtn.value);

      this._pinSlider = new PinSlider(this._sliderContainer, this._sliderPin, this._sliderDepth);

      this._setEffectLevel = this._setEffectLevel.bind(this);
      this._pinSlider.addChangeListener(this._setEffectLevel);
    }
  }

  _setEffectLevel(evt) {

    let pinCoordX = evt.detail.coord;
    let containerWidth = evt.detail.containerWidth;

    let selectedEffectBtn = this._getCheckedElement();

    // вычисляю степень применения эффекта по ширине линии-подложки слайдера и линии-заполнителя слайдера
    // линия-подложка слайдера является общим контейнером для пина и линии-заполнителя

    // получаем параметры для применения выбранного эффекта
    let effectFilterName = this._effectNameToCss[selectedEffectBtn.value].filterName;
    let effectMinValue = this._effectNameToCss[selectedEffectBtn.value].minValue;
    let effectMaxValue = this._effectNameToCss[selectedEffectBtn.value].maxValue;
    let effectFilterUnit = this._effectNameToCss[selectedEffectBtn.value].filterUnit;

    // вычисляем уровень эффекта по пропорции элементов, минимальному и максимальному значению эффекта
    let effectLevel = effectMinValue + (pinCoordX / containerWidth * (effectMaxValue - effectMinValue));
    effectLevel = effectLevel.toFixed(2);
    // получаем строку записи в стили изображения согласно выбранного фильтра
    let effectFilterString = `${effectFilterName}(${effectLevel}${effectFilterUnit})`;

    // применяем фильтр к изображению через CSS стили
    this.imgElement.style.WebkitFilter = effectFilterString;
    this.imgElement.style.filter = effectFilterString;

    // устанавливаем значение поля input для уровня эффекта
    let effectLevelToPercent = ~~((effectLevel / effectMaxValue) * 100);
    this.outputFieldEffectLevel.value = effectLevelToPercent;
  }

  _resetImageEffect() {

    // если были изменения эффектов, сбрасываем изменения в слайдере эффектов и отменяем наложенные на изображения эффекты
    if (this._isEffectChanged) {
      // сбрасываем в исходное состояния элементы управления
      this._sliderPin.style.left = '100%';
      this._sliderDepth.style.width = '100%';
      this.outputFieldEffectLevel.value = 100;

      // сбрасываем наложенные на изображение стили
      this.imgElement.className = '';
      this.imgElement.style.WebkitFilter = '';
      this.imgElement.style.filter = '';
    }
  }

  _getCheckedElement() {
    let radioElements = Array.from(this.container.querySelectorAll('input[type="radio"]'));
    let checkedElement = radioElements.find((element) => element.checked);

    return checkedElement;
  }
}
