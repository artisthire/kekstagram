'use strict';

(function () {

  var IMG_EFFECT_DEFAULT = 'none';
  var IMG_EFFECT_CLASS_PATTERN = 'effects__preview--';

  // содержит массив для связи между выбранным input в HTML и стилем свойства filter в CSS для примерения эффекта
  var effectNameToCss = {
    chrome: {filterName: 'grayscale', minValue: 0, maxValue: 1, filterUnit: ''},
    sepia: {filterName: 'sepia', minValue: 0, maxValue: 1, filterUnit: ''},
    marvin: {filterName: 'invert', minValue: 0, maxValue: 100, filterUnit: '%'},
    phobos: {filterName: 'blur', minValue: 0, maxValue: 5, filterUnit: 'px'},
    heat: {filterName: 'brightness', minValue: 1, maxValue: 3, filterUnit: ''}
  };

  var bntsContainer = document.querySelector('.effects__list');
  var btnDefaultEffect = bntsContainer.querySelector('#effect-none');
  var slideEffectField = document.querySelector('.img-upload__effect-level');
  var sliderPinElement = slideEffectField.querySelector('.effect-level__pin');
  var sliderDepthElement = slideEffectField.querySelector('.effect-level__depth');
  var sliderEffectValueOutput = slideEffectField.querySelector('.effect-level__value');

  // показывает применялись ли какие-то эффекты (для сброса эффектов при закрытии окна)
  var isChangedEffect = false;
  // хранит ссылку на тег выбранного эффекта
  var currentSelectedEffect = null;

  // хранит ссылку на тег изображения, к котором применяются изменения
  var targetImg = null;


  window.changeEffects = {

    initImgEffectChanger: initImgEffectChanger,
    destroyImgEffectChanger: destroyImgEffectChanger

  };

  /**
   * Инициирует обработчики изменения накладыавемого на изображения эффекта filter
   *
   * @param {Object} targetImgPreview - тег IMG, к которому применяется эффект трансформации
   *
   */
  function initImgEffectChanger(targetImgPreview) {

    targetImg = targetImgPreview;

    bntsContainer.addEventListener('change', onBtnsSwitchImageEffectChange);

    // передаем функцию-каллбэк, которая будет вызываться при изменении положения ползунка слайдера эффектов
    window.slider.initSlider(setEffectLevel);

  }

  /**
   * Удаляет обработчики изменения эффекта filter, наложенного на изображение
   *
   */
  function destroyImgEffectChanger() {

    bntsContainer.removeEventListener('change', onBtnsSwitchImageEffectChange);

    // удаляем обработчики слайдера
    window.slider.destroySlider();

    // устанавливаем выбраный по-умолчанию эффект
    btnDefaultEffect.checked = true;
    slideEffectField.style.display = 'none';

    resetImageEffect();

  }


  /**
   * Переключает тип эффекта, применяемого к изображению
   *
   */
  function onBtnsSwitchImageEffectChange() {

    isChangedEffect = true;

    // сбрасываем ранее наложенные эффекты
    resetImageEffect();

    // значение выбранного эффекта сохраняем в глобальную переменную
    currentSelectedEffect = document.activeElement;

    if (currentSelectedEffect.value === IMG_EFFECT_DEFAULT) {

      slideEffectField.style.display = 'none';

    } else {

      // показываем слайдер управления уровнем эффекта
      slideEffectField.style.display = '';

      // добавялем класс к карнитке согласно выбранного эффекта
      targetImg.classList.add(IMG_EFFECT_CLASS_PATTERN + currentSelectedEffect.value);

    }
  }

  /**
   * Сбрасывает наложенные эффекты и элементы управления в начальное состояние
   *
   */
  function resetImageEffect() {

    // если были изменения эффектов, сбрасываем изменения
    if (isChangedEffect) {

      // сбрасываем в исходное состояния элементы управления
      sliderPinElement.style.left = '100%';
      sliderDepthElement.style.width = '100%';
      sliderEffectValueOutput.value = 100;

      // сбрасываем наложенные стили
      targetImg.className = '';
      targetImg.style.WebkitFilter = '';
      targetImg.style.filter = '';

    }

  }

  /**
   * Накладывает эффект изображения при изменении указалетя слайдера
   * вызывается как калбек функционалом слайдера при изменении положения указателя
   *
   * @param {number} pinCoordX - текущие координты указателя внутри контейнера слайдера
   * @param {number} containerWidth - общая ширина контейнера слайдера, в пределах которого может перемещаться указатель
   *
   */
  function setEffectLevel(pinCoordX, containerWidth) {

    // вычисляю степень применения эффекта по ширине линии-подложки слайдера и линии-заполнителя слайдера
    // линия-подложка слайдера является общим контейнером для пина и линии-заполнителя

    // получаем параметры для применения выбранного эффекта
    var effectFilterName = effectNameToCss[currentSelectedEffect.value].filterName;
    var effectMinValue = effectNameToCss[currentSelectedEffect.value].minValue;
    var effectMaxValue = effectNameToCss[currentSelectedEffect.value].maxValue;
    var effectFilterUnit = effectNameToCss[currentSelectedEffect.value].filterUnit;

    // вычисляем уровень эффекта по пропорции элементов, минимальному и максимальному значению эффекта
    var valueEffect = effectMinValue + (pinCoordX / containerWidth * (effectMaxValue - effectMinValue));
    var valueEffectPercent = ~~((valueEffect / effectMaxValue) * 100);

    // получаем строку записи в стили изображения согласно выбранного фильтра
    var effectFilterString = effectFilterName + '(' + valueEffect.toFixed(2) + effectFilterUnit + ')';

    // устанавливаем значение поля input для уровня эффекта
    sliderEffectValueOutput.value = valueEffectPercent;

    // применяем фильтр к изображению через CSS стили
    targetImg.style.WebkitFilter = effectFilterString;
    targetImg.style.filter = effectFilterString;

  }

})();
