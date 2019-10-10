import {FormUploadImg} from './form-upload-img.js';
import {loadDataPictures} from './server-interaction.js';
import {UsersPictures} from './users-pictures.js';
import {PicturePreview} from './picture-preview.js';

let usersPictures = new UsersPictures();

loadDataPictures((data) => {
  // сохранить загруженные данные о картинках
  console.log(data);
  sessionStorage.setItem('picturesData', JSON.stringify(data));
  // отображить картинки на экране
  usersPictures.addUsersPictures(data);
},
console.log);

let btnUploadFile = document.querySelector('#upload-file');
let formUploadImg = new FormUploadImg(btnUploadFile);

let picturesContainerElement = document.querySelector('.pictures');
let picturePreview = new PicturePreview(picturesContainerElement);
/*
/*
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
  var modalOverlay = document.querySelector('.img-upload__overlay');
  var modalContainer = modalOverlay.querySelector('.img-upload__wrapper');
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
  let popup = null;

  btnUploadFile.addEventListener('change', onBtnUploadFileChange);

  /**
   * Обрабатывает переключение типа наложенного на изображение эффекта
   *
   */
   /*
  function onBtnUploadFileChange() {

    popup = new Popup(modalOverlay, modalContainer, [hashtagInput, descriptionInput], modalCloseBtn, 'hidden', 'modal-open');
    popup.addClosePopupListener(onPopupClose);
    popup.showPopup(onPopupShow);

  }

  function onPopupShow() {
    pinSlider = new PinSlider(sliderContainer, sliderPin, sliderDepth);
    scaler = new BtnsRangeSwitch(
      {container: btnsContainer},
      {startValue: 100, valueStep: 25, minValue: 25, maxValue: 100});

    scaler.addChangeListener(eventDetail);
    pinSlider.addChangeListener(eventDetail);
  }

  function onPopupClose() {

    pinSlider.removeChangeListener(eventDetail);
    pinSlider.destructor();
    scaler.removeChangeListener(eventDetail)
    scaler.destructor();

    pinSlider = null;
    scaler = null;

    popup.removeClosePopupListener(onPopupClose);
    popup = null;

    // сбрасываем значение input[type='file'] для повторной сработки события 'change' если изображение будет тем же самым
    btnUploadFile.value = '';

    // сбрасываем содержимое полей хэштегов и описания изображения
    hashtagInput.value = '';
    descriptionInput.value = '';

  }

  /**
   * Обрабатывает закрытие модального окна при клике на кнопку закрытия
   *
   * @param {Object} evt - объект события
   *
   */
   /*
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
   /*
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
  /*
  function onFormSubmit(evt) {

    evt.preventDefault();

    window.backend.sendData(window.utilities.showErrorMessage, closeModal, new FormData(form));

    function closeModal() {

      onBtnCloseModalClick(evt);

    }

  }


  // -------------------------------------------------------
  // временная функция для тестирования событий на создаваемых виджетах

  function eventDetail(evt) {

    let message = '----------------------\nCustom Event calls. Details:\n';

    for (let [key, value] of Object.entries(evt.detail)) {

      message += `key: ${key}, value: ${value} \n`;

    }

    console.log(message);

  }
  */

