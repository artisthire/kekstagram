import {PinSlider} from './pin-slider.js';
import {BtnsRangeSwitch} from './btns-range-switch.js';

// контейнер, внутри которого перемещается указатель
let sliderContainer = document.querySelector(`.effect-level__line`);
// указатель слайдера
let sliderPin = sliderContainer.querySelector('.effect-level__pin');
// заполнитель слайдера между его левым краем и положением указателя
let sliderDepth = sliderContainer.querySelector('.effect-level__depth');

//let slider = new PinSlider(sliderContainer, sliderPin, sliderDepth, (coord, width) => console.log(`Координаты: ${coord}, ширина: ${width}`));

'use strict';

  // обработывает отображение модали загрузки изображения
  // зависит от scale-img.js - Обработка изменения величины изображения
  // и от change-effects.js - Обработка изменения эффекта наложенного на изображение

  var btnUploadFile = document.querySelector('#upload-file');
  var modalContainer = document.querySelector('.img-upload__overlay');
  var modalCloseBtn = modalContainer.querySelector('#upload-cancel');

  var form = document.querySelector('#upload-select-image');

  var imgPreviewElement = modalContainer.querySelector('.img-upload__preview > img');
  var hashtagInput = modalContainer.querySelector('.text__hashtags');
  var descriptionInput = modalContainer.querySelector('.text__description');

  var btnsContainer = document.querySelector('.scale');
  var btnScaleSmaller = btnsContainer.querySelector('.scale__control--smaller');
  var btnScaleBigger = btnsContainer.querySelector('.scale__control--bigger');
  var scaleValueOutput = btnsContainer.querySelector('.scale__control--value');

  let pinSlider = null;
  let scaler = null;

  btnUploadFile.addEventListener('change', onBtnUploadFileChange);

  /**
   * Обрабатывает переключение типа наложенного на изображение эффекта
   *
   */
  function onBtnUploadFileChange() {

    modalContainer.classList.remove('hidden');
    modalContainer.focus();

    modalCloseBtn.addEventListener('click', onBtnCloseModalClick);

    pinSlider = new PinSlider(sliderContainer, sliderPin, sliderDepth);
    scaler = new BtnsRangeSwitch(
      {container: btnsContainer},
      {startValue: 100, valueStep: 25, minValue: 25, maxValue: 100});

    scaler.addChangeListener(eventDetail);
    pinSlider.addChangeListener(eventDetail);
  }

  /**
   * Обрабатывает закрытие модального окна при клике на кнопку закрытия
   *
   * @param {Object} evt - объект события
   *
   */
  function onBtnCloseModalClick(evt) {

    evt.preventDefault();

    modalContainer.classList.add('hidden');

    pinSlider.removeChangeListener(eventDetail);
    pinSlider.destructor();
    scaler.removeChangeListener(eventDetail)
    scaler.destructor();

    pinSlider = null;
    scaler = null;

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
      if (~[hashtagInput, descriptionInput].indexOf(evt.target)) {

        return;

      }

      onBtnCloseModalClick(evt);

    }

  }

  /**
   * Пересылает данные формы через AJAX
   *
   * @param {Object} evt - объект события
   *
   */
  function onFormSubmit(evt) {

    evt.preventDefault();

    window.backend.sendData(window.utilities.showErrorMessage, closeModal, new FormData(form));

    function closeModal() {

      onBtnCloseModalClick(evt);

    }

  }


  // -------------------------------------------------------

  function eventDetail(evt) {

    let message = '----------------------\nCustom Event calls. Details:\n';

    for (let [key, value] of Object.entries(evt.detail)) {

      message += `key: ${key}, value: ${value} \n`;

    }

    console.log(message);

  }

