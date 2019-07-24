'use strict';

(function () {

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

  btnUploadFile.addEventListener('change', onBtnUploadFileChange);

  /**
   * Обрабатывает переключение типа наложенного на изображение эффекта
   *
   */
  function onBtnUploadFileChange() {

    modalContainer.classList.remove('hidden');
    modalContainer.focus();

    form.addEventListener('submit', onFormSubmit);

    modalCloseBtn.addEventListener('click', onBtnCloseModalClick);
    // добавляем глобальный слушатель по нажатию клавиши ESC
    document.addEventListener('keydown', onModalEscPress);

    // добавляем обработку событий от кнопок изменения размеров изображения
    // событие делегируется на уровень контейнера кнопок
    window.scaleImg.btnsContainer.addEventListener('click', onBtnScaleImgClick);

    // добавляем обработку события от кнопок изменения эффектов для изображения
    // событие делегируется на уровень контейнера
    window.changeEffects.bntsContainer.addEventListener('change', onBtnsSwitchImageEffectChange);

    // инициируем обработчик изменения эффектов при сдвиге указателя слайдера
    window.changeEffects.slideImageEffect();

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

    form.removeEventListener('submit', onFormSubmit);

    modalCloseBtn.removeEventListener('click', onBtnCloseModalClick);
    // удаляем глобальный слушатель по нажатию клавиши ESC
    document.removeEventListener('keydown', onModalEscPress);
    // сбрасываем значение input[type='file'] для повторной сработки события 'change' если изображение будет тем же самым
    btnUploadFile.value = '';

    // удаляем обработчик для кнопок изменения размеров изображения
    // сбрасываем настройки кнопок и изображения в исходное состояние
    window.scaleImg.btnsContainer.removeEventListener('click', onBtnScaleImgClick);
    imgPreviewElement.style.transform = '';
    window.scaleImg.scaleValueOutput.value = '100%';
    window.scaleImg.btnScaleBigger.disabled = true;
    hashtagInput.value = '';
    descriptionInput.value = '';

    // удаляем обработку события от кнопок изменения эффектов для изображения
    window.changeEffects.bntsContainer.removeEventListener('change', onBtnsSwitchImageEffectChange);

    // сбрасываем эффекты, наложенные с помощью стиля filter
    window.changeEffects.resetImageEffect();

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
   * Передает обработку события клика по кнопкам маштабирования изображения в отдельный модуль
   *
   * @param {Object} evt - объект события
   *
   */
  function onBtnScaleImgClick(evt) {

    window.scaleImg.onBtnScaleClick(evt, imgPreviewElement);

  }


  /**
   * Передает обработку события изменения типа наложенного изображения в отедьный модуль
   *
   * @param {Object} evt - объект события
   *
   */
  function onBtnsSwitchImageEffectChange(evt) {

    evt.preventDefault();

    window.changeEffects.switchImageEffect();

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

})();
