/**
 * Модуль изменения эффекта и масштаба наложенного на изображение
 * Использует функционал переключателя BtnsRangeSwitch для изменения масштаба изображения
 * Функционал слайдера PinSlider для изменения уровня наложенного эффекта (тип эффекта устанавливается функционалом модуля)
 * @module ./change-img-effect
 */
import {PinSlider} from './pin-slider.js';
import {BtnsRangeSwitch} from './btns-range-switch.js';

/**
 * Class представляет собой объект для изменения эффекта и масштаба наложенного на изображение переданное изображение
 */
export class ChangeImgEffect {

  // классы эффекта по умолчанию и шаблон для применения типа эффекта в зависимости от выбранной радиокнопки
  _DEFAULT_EFFECT = 'none';
  _EFFECT_PATTERN = 'effects__preview--';

  // содержит массив для связи между названием эффекта в выбранной радиокнопке
  // и свойствами для filter в CSS для наложения эффекта на изображение
  _effectNameToCss = {
    chrome: {filterName: 'grayscale', minValue: 0, maxValue: 1, filterUnit: ''},
    sepia: {filterName: 'sepia', minValue: 0, maxValue: 1, filterUnit: ''},
    marvin: {filterName: 'invert', minValue: 0, maxValue: 100, filterUnit: '%'},
    phobos: {filterName: 'blur', minValue: 0, maxValue: 5, filterUnit: 'px'},
    heat: {filterName: 'brightness', minValue: 1, maxValue: 3, filterUnit: ''}
  };

  _pinSlider;
  _scaler;
  // хранит ссылку на тип выбранного эффекта для изменения его уровня с помощью слайдера
  _selectedEffectBtn;

  /**
   * Создает объект для обработки изменения масштаба и эффектов наложенных на изображение
   * @param {object} imgElement - HTML-элемент - ссылка на изображение к которому нужно применить эффекты
   */
  constructor(imgElement) {
    // картинка к которой применяем эффекты
    this.imgElement = imgElement;

    // контейнер с радиокнопками для переключения эффектов
    this.container = document.querySelector('.effects__list');
    this.btnDefaultEffect = this.container.querySelector('#effect-none');
    // устанавливаем выбранной кнопку эффекта по умолчанию
    this.btnDefaultEffect.checked = true;

    // контейнер для поля установки величены выбранного эффекта
    // также внутри этого контейнера находится слайдер для изменения уровня наложенного эффекта
    this.effectFieldContainer = document.querySelector('.img-upload__effect-level');
    this.outputFieldEffectLevel = this.effectFieldContainer.querySelector('.effect-level__value');
    // изначально слайдер изменения уровня эффекта скрыт
    this.effectFieldContainer.style.display = 'none';
    // устанавливаем начальное значение уровня наложенного эффекта
    this.outputFieldEffectLevel.value = 100;

    // элементы слайдера изменения уровня выбранного эффекта
    this._sliderContainer = this.effectFieldContainer.querySelector('.effect-level__line');
    this._sliderPin = this._sliderContainer.querySelector('.effect-level__pin');
    this._sliderDepth = this._sliderContainer.querySelector('.effect-level__depth');
    // устанавливаем начальное положение элементов управления слайдера
    this._sliderPin.style.left = '100%';
    this._sliderDepth.style.width = '100%';

    // контейнер переключателя масштабирования изображения
    this._rangeSwitchContainer = document.querySelector('.scale');
    // создаем объект переключателя масштаба изображения
    this._scaler = new BtnsRangeSwitch(
        {container: this._rangeSwitchContainer},
        {startValue: 100, valueStep: 25, minValue: 25, maxValue: 100});

    // добавляем обработчик масштабирования изображения при изменении величины переключателем
    this._scaleImg = this._scaleImg.bind(this);
    this._scaler.addChangeListener(this._scaleImg);

    // добавляем обработчик переключения типа наложенного эффекта
    this._onBtnsImageEffectChange = this._onBtnsImageEffectChange.bind(this);
    this.container.addEventListener('change', this._onBtnsImageEffectChange);
  }

  /**
   * Метод должен вызываться, когда уже не нужно менять эффекты на изображении
   * Сбрасывает наложенные эффекты, удаляет обработчки изменения типа, степени эффекта и масштаба изображения
   */
  destructor() {
    this.container.removeEventListener('change', this._onBtnsImageEffectChange);

    this._resetImgEffect();
    // сбрасываем масштабирование картинки
    this.imgElement.style.transform = '';

    this._scaler.removeChangeListener(this._scaleImg);
    this._scaler.destructor();
    this._scaler = null;

    if (this._pinSlider) {
      this._pinSlider.removeChangeListener(this._setEffectLevel);
      this._pinSlider.destructor();
      this._pinSlider = null;
    }
  }

  /**
   * Обрабатывает изменения типа наложенного эффекта
   * @param {object} evt - объект события
   */
  _onBtnsImageEffectChange(evt) {
    // сбрасываем ранее наложенные эффекты
    this._resetImgEffect();

    // запоминаем ссылку на кнопку выбранного эффекта
    this._selectedEffectBtn = evt.target;

    // если выбрана кнопка, когда эффекта нет
    // убираем слайдер выбора уровня наложенного эффекта
    if (this._selectedEffectBtn.value === this._DEFAULT_EFFECT) {
      this.effectFieldContainer.style.display = 'none';
    } else {
      // показываем слайдер управления уровнем эффекта
      this.effectFieldContainer.style.display = '';
      // добавялем класс к карнитке согласно выбранного эффекта
      this.imgElement.classList.add(this._EFFECT_PATTERN + this._selectedEffectBtn.value);

      // создаем слайдер для управления уровнем эффекта
      if (!this._pinSlider) {
        this._pinSlider = new PinSlider(this._sliderContainer, this._sliderPin, this._sliderDepth);

        this._setEffectLevel = this._setEffectLevel.bind(this);
        this._pinSlider.addChangeListener(this._setEffectLevel);
      }
    }
  }

  /**
   * Каллбэк-функция которая передается в слайдер уровня эффекта
   * При срабатывании события изменения положения указателя слайдера изменяет уровенть эффекта
   * @param {object} evt - объект события изменения положения указателя слайдера
   */
  _setEffectLevel(evt) {
    // получаем данные о координатах указателя и общей ширине контейнера слайдера
    let pinCoordX = evt.detail.coord;
    let containerWidth = evt.detail.containerWidth;

    // в зависимости от текущего выбранного эффекта
    // получаем параметры для установки стилей через filter в CSS
    let effectFilterName = this._effectNameToCss[this._selectedEffectBtn.value].filterName;
    let effectMinValue = this._effectNameToCss[this._selectedEffectBtn.value].minValue;
    let effectMaxValue = this._effectNameToCss[this._selectedEffectBtn.value].maxValue;
    let effectFilterUnit = this._effectNameToCss[this._selectedEffectBtn.value].filterUnit;

    // вычисляем уровень эффекта по положению указателя слайдера и границ изменения выбранного эффекта
    let effectLevel = effectMinValue + (pinCoordX / containerWidth * (effectMaxValue - effectMinValue));
    effectLevel = effectLevel.toFixed(2);
    // получаем строку для записи в свойство filter
    let effectFilterString = `${effectFilterName}(${effectLevel}${effectFilterUnit})`;

    // применяем filter к изображению через стили
    this.imgElement.style.WebkitFilter = effectFilterString;
    this.imgElement.style.filter = effectFilterString;

    // устанавливаем значение поля-индикатора уровня эффекта
    let effectLevelToPercent = ~~((effectLevel / effectMaxValue) * 100);
    this.outputFieldEffectLevel.value = effectLevelToPercent;
  }

  /**
   * Каллбэк-функция которая передается в переключатель для изменения масштаба изображения
   * @param {object} evt - объект события изменения значения переключаетелем
   */
  _scaleImg(evt) {
    // получаем текущую величину из переключателя
    let scaleValue = evt.detail.value / 100;
    // устанавливаем стили для масштабирования изображения
    this.imgElement.style.transform = `scale(${scaleValue})`;
  }

  /**
   * Сбрасывает наложенные на изображения стили в filter
   */
  _resetImgEffect() {
    this.imgElement.className = '';
    this.imgElement.style.WebkitFilter = '';
    this.imgElement.style.filter = '';
  }
}
