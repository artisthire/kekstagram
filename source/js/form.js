'use strict';

(function () {

  // обработывает отображение модали загрузки изображения
  // зависит от scale-img.js - Обработка изменения величины изображения
  // и от change-effects.js - Обработка изменения эффекта


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

  var btnUploadFile = document.querySelector('#upload-file');
  var modalContainer = document.querySelector('.img-upload__overlay');
  var modalCloseBtn = modalContainer.querySelector('#upload-cancel');

  var imgScaleBtnsContainer = modalContainer.querySelector('.scale');
  var imgPreviewElement = modalContainer.querySelector('.img-upload__preview > img');

  var imgEffectsListContainer = modalContainer.querySelector('.effects__list');
  var imgEffectsLevelContainer = modalContainer.querySelector('.img-upload__effect-level');
  var imgEffectsLevelPinElement = imgEffectsLevelContainer.querySelector('.effect-level__pin');
  var imgEffectsLevelDepthElement = imgEffectsLevelContainer.querySelector('.effect-level__depth');
  var imgEffectsLevelBackgroundElement = imgEffectsLevelDepthElement.parentElement;
  var imgEffectsInputElement = imgEffectsLevelContainer.querySelector('.effect-level__value');

  var currentSelectSwitchEffectInput = null;

  btnUploadFile.addEventListener('change', onBtnUploadFileChange);

  function onBtnUploadFileChange() {

    modalContainer.classList.remove('hidden');
    modalContainer.focus();

    modalCloseBtn.addEventListener('click', onBtnCloseModalClick);
    // добавляем глобальный слушатель по нажатию клавиши ESC
    document.addEventListener('keydown', onModalEscPress);

    // добавляем обработку событий от кнопок изменения размеров изображения
    // событие делегируется на уровень контейнера кнопок
    imgScaleBtnsContainer.addEventListener('click', onBtnScaleImgClick);

    // добавляем обработку события от кнопок изменения эффектов для изображения
    // событие делегируется на уровень контейнера
    imgEffectsListContainer.addEventListener('change', onBtnsSwitchImageEffectChange);

    // добавляем обработку события при передвижении слайдера изменения эффектов
    imgEffectsLevelPinElement.addEventListener('mousedown', onImageSliderPinMousedown);

  }

  function onBtnCloseModalClick() {

    modalContainer.classList.add('hidden');

    modalCloseBtn.removeEventListener('click', onBtnCloseModalClick);
    // удаляем глобальный слушатель по нажатию клавиши ESC
    document.removeEventListener('keydown', onModalEscPress);
    // сбрасываем значение input[type='file'] для повторной сработки события 'change' если изображение будет тем же самым
    btnUploadFile.value = '';

    // удаляем обработчик для кнопок изменения размеров изображения
    // сбрасываем настройки кнопок и изображения в исходное состояние
    imgScaleBtnsContainer.removeEventListener('click', onBtnScaleImgClick);
    imgPreviewElement.style.transform = '';
    window.scaleImg.scaleOuputElement.value = '100%';
    window.scaleImg.btnScaleBigger.disabled = true;

    // удаляем обработку события от кнопок изменения эффектов для изображения
    imgEffectsListContainer.removeEventListener('change', onBtnsSwitchImageEffectChange);
    // изначально активирован оригинальный эффект, поэтому слайдер уровня эффекта скрыт
    imgEffectsLevelContainer.style.display = 'none';
    // также отсутствует эффект на картинке
    imgPreviewElement.className = '';

    // убираем обработку события при передвижении слайдера изменения эффектов
    imgEffectsLevelPinElement.removeEventListener('mousedown', onImageSliderPinMousedown);

  }

  /**
   * Обрабатывает закрытие окна изменения эффектов изображения по нажатию кнопки ESC
   *
   * @param {Object} evt - объект события
   *
   */
  function onModalEscPress(evt) {

    if (window.utilities.isEscKeyPress(evt)) {

      // если в фокусе находятся внутренние элементы ввода хэштега или комментария
      // окно не закрываем
      if (document.activeElement.classList.contains('text__hashtags') ||
          document.activeElement.classList.contains('text__description')) {

        return;

      }

      onBtnCloseModalClick();

    }

  }

  function onBtnScaleImgClick(evt) {

    window.scaleImg.onBtnScaleClick(evt, imgPreviewElement);

  }



  /**
   * Переключает тип эффекта, применяемого к изображению
   * входные параметры берет из внешнего замыкания
   *
   */
  function onBtnsSwitchImageEffectChange() {

    // сбрасываем стиль для предыдущего эффекта
    imgPreviewElement.className = '';
    imgPreviewElement.style.WebkitFilter = '';
    imgPreviewElement.style.filter = '';

    // значение выбранного эффекта сохраняем в глобальную переменную
    currentSelectSwitchEffectInput = document.activeElement;

    if (currentSelectSwitchEffectInput.value === IMG_EFFECT_RESET_STRING) {

      imgEffectsLevelContainer.style.display = 'none';

    } else {

      // показываем слайдер управления уровнем эффекта
      // устанавливаем визуальное отображение уровня эффекта в 100%
      imgEffectsLevelContainer.style.display = '';
      imgEffectsLevelPinElement.style.left = '100%';
      imgEffectsLevelDepthElement.style.width = '100%';

      // устанавливаем значение поля input для уровня эффекта в максимальную величину согласно выбранного эффекта
      imgEffectsInputElement.value = IMG_EFFECTS[currentSelectSwitchEffectInput.value].maxValue;

      // добавялем класс к карнитке согласно выбранного эффекта
      imgPreviewElement.classList.add(IMG_EFFECT_CLASS_PATTERN + currentSelectSwitchEffectInput.value);

    }
  }


  function onImageSliderPinMousedown() {

    // добавляем обработчик завершения изменения эффекта к изображению
    imgEffectsLevelPinElement.addEventListener('mouseup', onImageSliderPinMouseup);

  }

  /**
   * Отрабатывает изменение выбранного эффекта при отпускании мыши на управляющем элементе слайдера
   *
   */
  function onImageSliderPinMouseup() {

    // вычисляю степень применения эффекта по ширине линии-подложки слайдера и линии-заполнителя слайдера
    // линия-подложка слайдера является общим контейнером для пина и линии-заполнителя

    // сначала находим и округляем шиниры подложки и заполнителя
    var backgroundLineElementWidth = ~~imgEffectsLevelBackgroundElement.offsetWidth;
    var depthLineElementWidth = ~~imgEffectsLevelDepthElement.offsetWidth;

    // получаем параметры для применения выбранного эффекта
    var effectFilterName = IMG_EFFECTS[currentSelectSwitchEffectInput.value].filterName;
    var effectMinValue = IMG_EFFECTS[currentSelectSwitchEffectInput.value].minValue;
    var effectMaxValue = IMG_EFFECTS[currentSelectSwitchEffectInput.value].maxValue;
    var effectFilterUnit = IMG_EFFECTS[currentSelectSwitchEffectInput.value].filterUnit;

    // вычисляем уровень эффекта по пропорции элементов, минимальному и максимальному значению эффекта
    var effectLevel = effectMinValue + (depthLineElementWidth / backgroundLineElementWidth * (effectMaxValue - effectMinValue));

    // устанавливаем значение поля input для уровня эффекта
    imgEffectsInputElement.value = effectLevel.toFixed(2);

    // получаем строку записи в стили изображения согласно выбранного фильтра
    var effectFilterString = effectFilterName + '(' + effectLevel.toFixed(2) + effectFilterUnit + ')';

    // применяем фильтр
    imgPreviewElement.style.WebkitFilter = effectFilterString;
    imgPreviewElement.style.filter = effectFilterString;

    imgEffectsLevelPinElement.removeEventListener('mouseup', onImageSliderPinMouseup);

  }

})();
