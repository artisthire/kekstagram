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
  var slideEffectField = document.querySelector('.img-upload__effect-level');
  var sliderEffectContainer = slideEffectField.querySelector('.effect-level__line');
  var sliderPinElement = slideEffectField.querySelector('.effect-level__pin');
  var sliderDepthElement = slideEffectField.querySelector('.effect-level__depth');
  var sliderEffectValueOutput = slideEffectField.querySelector('.effect-level__value');

  var isChangedEffect = false;
  // хранит текущий элемент выбранного эффекта
  var currentSelectedEffect = null;

  // хранит ссылку на изображение, к котором применяется эффект
  var imgPreviewElement = document.querySelector('.img-upload__preview > img');


  window.changeEffects = {

    bntsContainer: bntsContainer,
    switchImageEffect: switchImageEffect,
    slideImageEffect: slideImageEffect,
    resetImageEffect: resetImageEffect

  };


  /**
   * Переключает тип эффекта, применяемого к изображению
   *
   * @param {Object} targetImgPreview - HTML-элемент, содержащий картинку для наложения эффекта
   *
   */
  function switchImageEffect() {

    isChangedEffect = true;

    // сбрасываем стиль для предыдущего эффекта
    imgPreviewElement.className = '';
    imgPreviewElement.style.WebkitFilter = '';
    imgPreviewElement.style.filter = '';

    // устанавливаем значение уровня эффекта по-умолчанию
    sliderEffectValueOutput.value = 100;
    sliderPinElement.style.left = '100%';
    sliderDepthElement.style.width = '100%';

    // значение выбранного эффекта сохраняем в глобальную переменную
    currentSelectedEffect = document.activeElement;

    if (currentSelectedEffect.value === IMG_EFFECT_RESET_STRING) {

      slideEffectField.style.display = 'none';

    } else {

      // показываем слайдер управления уровнем эффекта
      slideEffectField.style.display = '';

      // добавялем класс к карнитке согласно выбранного эффекта
      imgPreviewElement.classList.add(IMG_EFFECT_CLASS_PATTERN + currentSelectedEffect.value);

    }
  }

  /**
   * Обрабатывает старт события изменение эффекта слайдером
   * передает функцию для установки нужных эффектов в код слайдера
   *
   */
  function slideImageEffect() {

    window.slider.initSlider(setEffectLevel, sliderEffectContainer, sliderPinElement, sliderDepthElement);

  }

  /**
   * Применяется для сброса слайдера эффектов в начальное состояние при закрытии окна
   *
   */
  function resetImageEffect() {

    // удаляем обработчики слайдера
    window.slider.destroySlider();

    // если были изменения эффектов, сбрасываем их на дефолт
    if (isChangedEffect) {

      slideEffectField.style.display = 'none';
      sliderEffectValueOutput.value = 100;
      btnDefaultEffect.checked = true;
      // также отсутствует класс типа эффекта на картинке
      imgPreviewElement.className = '';
      imgPreviewElement.style.WebkitFilter = '';
      imgPreviewElement.style.filter = '';

      sliderPinElement.style.left = '100%';
      sliderDepthElement.style.width = '100%';

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
    var effectFilterName = IMG_EFFECTS[currentSelectedEffect.value].filterName;
    var effectMinValue = IMG_EFFECTS[currentSelectedEffect.value].minValue;
    var effectMaxValue = IMG_EFFECTS[currentSelectedEffect.value].maxValue;
    var effectFilterUnit = IMG_EFFECTS[currentSelectedEffect.value].filterUnit;

    // вычисляем уровень эффекта по пропорции элементов, минимальному и максимальному значению эффекта
    var valueEffect = effectMinValue + (pinCoordX / containerWidth * (effectMaxValue - effectMinValue));
    var effectValuePercent = ~~((valueEffect / effectMaxValue) * 100);

    // получаем строку записи в стили изображения согласно выбранного фильтра
    var effectFilterString = effectFilterName + '(' + valueEffect.toFixed(2) + effectFilterUnit + ')';

    // устанавливаем значение поля input для уровня эффекта
    sliderEffectValueOutput.value = effectValuePercent;

    // применяем фильтр к изображению через CSS стили
    imgPreviewElement.style.WebkitFilter = effectFilterString;
    imgPreviewElement.style.filter = effectFilterString;

  }

})();
