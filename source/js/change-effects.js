'use strict';

(function () {

  var IMG_EFFECT_RESET_STRING = 'none';
  var IMG_EFFECT_CLASS_PATTERN = 'effects__preview--';

  // содержит массив характеристик для примерения эффектов через стили
  var IMG_EFFECTS = {
    chrome: {filterName: 'grayscale', minValue: 0, maxValue: 1, filterUnit: ''},
    sepia: {filterName: 'sepia', minValue: 0, maxValue: 1, filterUnit: ''},
    marvin: {filterName: 'invert', minValue: 0, maxValue: 100, filterUnit: '%'},
    phobos: {filterName: 'blur', minValue: 0, maxValue: 5, filterUnit: 'px'},
    heat: {filterName: 'brightness', minValue: 1, maxValue: 3, filterUnit: ''}
  };

  var bntsContainer = document.querySelector('.effects__list');
  var btnDefaultEffect = bntsContainer.querySelector('#effect-none');
  var sliderEffectsContainer = document.querySelector('.img-upload__effect-level');
  var sliderPinElement = sliderEffectsContainer.querySelector('.effect-level__pin');
  var sliderDepthElement = sliderEffectsContainer.querySelector('.effect-level__depth');
  var sliderBackgroundElement = sliderDepthElement.parentElement;
  var sliderEffectValueOutput = sliderEffectsContainer.querySelector('.effect-level__value');

  // хранит текущий элемент выбранного эффекта
  var currentSelectedInput = null;

  // хранит ссылку на изображение, к котором применяется эффект
  var imgPreviewElement = null;

  // переменные для сдвига пина
  var shiftCoordX = null;
  var containerCoordX = null;
  var pinMinCoordX = null;
  var pinMaxCoordX = null;

  window.changeEffects = {

    bntsContainer: bntsContainer,
    btnDefaultEffect: btnDefaultEffect,
    sliderEffectsContainer: sliderEffectsContainer,
    sliderPinElement: sliderPinElement,
    sliderEffectValueOutput: sliderEffectValueOutput,
    switchImageEffect: switchImageEffect,
    slideImageEffect: slideImageEffect

  };


  /**
   * Переключает тип эффекта, применяемого к изображению
   *
   * @param {Object} targetImgPreview - HTML-элемент, содержащий картинку для наложения эффекта
   *
   */
  function switchImageEffect(targetImgPreview) {

    // записываем в глобальную переменную ссылку на картинку к которой будут применяться эффекты
    imgPreviewElement = targetImgPreview;

    // сбрасываем стиль для предыдущего эффекта
    imgPreviewElement.className = '';
    imgPreviewElement.style.WebkitFilter = '';
    imgPreviewElement.style.filter = '';

    // устанавливаем значение уровня эффекта по-умолчанию
    sliderEffectValueOutput.value = 100;
    sliderPinElement.style.left = '100%';
    sliderDepthElement.style.width = '100%';

    // значение выбранного эффекта сохраняем в глобальную переменную
    currentSelectedInput = document.activeElement;

    if (currentSelectedInput.value === IMG_EFFECT_RESET_STRING) {

      sliderEffectsContainer.style.display = 'none';

    } else {

      // показываем слайдер управления уровнем эффекта
      sliderEffectsContainer.style.display = '';

      // добавялем класс к карнитке согласно выбранного эффекта
      imgPreviewElement.classList.add(IMG_EFFECT_CLASS_PATTERN + currentSelectedInput.value);

    }
  }

  /**
   * Обрабатывает старт события изменение эффекта слайдером
   *
   * @param {Object} evt - объект события
   *
   */
  function slideImageEffect(evt) {

    // получаем начальную координату по оси X для пина
    var pinCoordX = window.utilities.getCoords(sliderPinElement).left;

    // вычисляем смещение между координатой пина и точкой клика внутри пина
    // с учетом того, что пин в стилях мещен на 50% через transform
    shiftCoordX = evt.pageX - pinCoordX - sliderPinElement.offsetWidth / 2;

    // координата Х контейнера пина
    containerCoordX = window.utilities.getCoords(sliderBackgroundElement).left;

    // минимальная и максимальная координата пина ограничена габаритами контейнера
    pinMinCoordX = 0;
    pinMaxCoordX = ~~sliderBackgroundElement.offsetWidth;

    // добавляем обработчик завершения изменения уровня эффекта при отпускании кнопки
    // обрабатывает на документе, поскольку мышка при сдвиге может выходить за предели пина
    document.addEventListener('mouseup', onPinEffectSliderMouseup);

    document.addEventListener('mousemove', onPinEffectSlideMousemove);
  }

  function onPinEffectSlideMousemove(evt) {

    // получаем текущую коодринату сдвига пина с учетом координат контейнера и начальной точки клика
    var coordX = evt.pageX - containerCoordX - shiftCoordX;

    // накладываем ограничение координа контейнером
    coordX = Math.max(coordX, pinMinCoordX);
    coordX = Math.min(coordX, pinMaxCoordX);

    // сдвигаем пин
    sliderPinElement.style.left = coordX + 'px';

    // применяем стили для ширины заполнителя
    sliderDepthElement.style.width = ((coordX / pinMaxCoordX) * 100).toFixed(2) + '%';

    var currentValueEffect = calculateEffectLevel();

    setEffectLevel(currentValueEffect);

  }

  /**
   * Отрабатывает изменение выбранного эффекта при отпускании мыши на управляющем элементе слайдера
   *
   */
  function onPinEffectSliderMouseup() {

    // вычисляем уровень эффекта
    var currentValueEffect = calculateEffectLevel();

    // применяем уровень эффекта к картинке и записываем значение величины эффекта в соответствующее поле фильтра
    setEffectLevel(currentValueEffect);

    document.removeEventListener('mouseup', onPinEffectSliderMouseup);

    document.removeEventListener('mousemove', onPinEffectSlideMousemove);

  }

  /**
   * Вспомогательная функция, которая вычисляет величину выбранного эффекта
   * по положению пина слайдера
   *
   * @return {Object} - объект с величиной уровня эффекта и строковым представлением для примерения в CSS filter
   *
   */
  function calculateEffectLevel() {

    // вычисляю степень применения эффекта по ширине линии-подложки слайдера и линии-заполнителя слайдера
    // линия-подложка слайдера является общим контейнером для пина и линии-заполнителя

    // сначала находим и округляем шиниры подложки и заполнителя
    var backgroundLineElementWidth = ~~sliderBackgroundElement.offsetWidth;
    var depthLineElementWidth = ~~sliderDepthElement.offsetWidth;

    // получаем параметры для применения выбранного эффекта
    var effectFilterName = IMG_EFFECTS[currentSelectedInput.value].filterName;
    var effectMinValue = IMG_EFFECTS[currentSelectedInput.value].minValue;
    var effectMaxValue = IMG_EFFECTS[currentSelectedInput.value].maxValue;
    var effectFilterUnit = IMG_EFFECTS[currentSelectedInput.value].filterUnit;

    // вычисляем уровень эффекта по пропорции элементов, минимальному и максимальному значению эффекта
    var valueEffect = effectMinValue + (depthLineElementWidth / backgroundLineElementWidth * (effectMaxValue - effectMinValue));

    // получаем строку записи в стили изображения согласно выбранного фильтра
    var effectFilterString = effectFilterName + '(' + valueEffect.toFixed(2) + effectFilterUnit + ')';
    var effectValuePercent = ~~((valueEffect / effectMaxValue) * 100);

    return {
      valueEffect: effectValuePercent,
      effectFilterString: effectFilterString
    };

  }

  /**
   * Применяем эффект к рисунку через установку соотвествующих стилей
   * Добавляет значение величины эффекта в соответствующее поле формы
   *
   * @param {Object} currentValue - объект с величиной уровня эффекта и строковым представлением для примерения в CSS filter
   *
   */

  function setEffectLevel(currentValue) {

    // устанавливаем значение поля input для уровня эффекта
    sliderEffectValueOutput.value = currentValue.valueEffect;

    // получаем строку записи в стили изображения согласно выбранного фильтра
    var effectFilterString = currentValue.effectFilterString;

    // применяем фильтр к изображению через CSS стили
    imgPreviewElement.style.WebkitFilter = effectFilterString;
    imgPreviewElement.style.filter = effectFilterString;

  }

})();
