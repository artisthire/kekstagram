'use strict';

(function () {

  // обрабатывает изменение изображения при клике на кнопках увеличения/уменьшения размера

  var Scale = {

    step: 25,
    minValue: 25,
    maxValue: 100

  };

  var btnsContainer = document.querySelector('.scale');
  var btnScaleSmaller = btnsContainer.querySelector('.scale__control--smaller');
  var btnScaleBigger = btnsContainer.querySelector('.scale__control--bigger');
  var scaleValueOutput = btnsContainer.querySelector('.scale__control--value');

  // хранит ссылку на тег изображения, к котором применяются изменения
  var targetImg = null;

  window.scaleImg = {

    initImgScaler: initImgScaler,
    destroyImgScaller: destroyImgScaller

  };


  /**
   * Инициирует обработчик кликов на кнопках увеличения/уменьшения изображения
   *
   * @param {Object} targetImgPreview - тег IMG, к которому применяется эффект трансформации
   *
   */
  function initImgScaler(targetImgPreview) {

    targetImg = targetImgPreview;

    btnsContainer.addEventListener('click', onBtnScaleImgClick);

  }

  /**
   * Удаляет обработчик кликов на кнопках увеличения/уменьшения изображения и сбрасывает изменения
   *
   */
  function destroyImgScaller() {

    btnsContainer.removeEventListener('click', onBtnScaleImgClick);

    targetImg.style.transform = '';
    scaleValueOutput.value = '100%';
    btnScaleBigger.disabled = true;

  }

  /**
   * Обрабатывает клик по кнопкам изменения размера изображения
   * входные параметры берет из внешнего замыкания
   *
   * @param {Object} evt - объект события
   *
   */
  function onBtnScaleImgClick(evt) {


    // если клик вне кнопок уменьшения и увеличения изображения, ничего не делаем
    if (evt.target.closest('.scale__control--smaller') !== btnScaleSmaller &&
        evt.target.closest('.scale__control--bigger') !== btnScaleBigger) {

      return;

    }

    // задаем знак числа шага уменьшения/увеличения изображения
    var step = (evt.target.closest('.scale__control--smaller') === btnScaleSmaller) ? -Scale.step : Scale.step;
    // считываем текущее значение на кнопке уменьшения/увеличения изображения
    var currentValue = parseInt(scaleValueOutput.value, 10);

    // увеличиваем значение на шаг и ограничиваем его согласно максимального и минимального значения
    // а также отключаем возможность взаимодействия с кнопками если выходим за пределы ограничений
    currentValue += step;

    if (currentValue >= Scale.maxValue) {

      currentValue = Scale.maxValue;
      btnScaleBigger.disabled = true;

    } else if (currentValue <= Scale.minValue) {

      currentValue = Scale.minValue;
      btnScaleSmaller.disabled = true;

    } else {

      btnScaleSmaller.disabled = false;
      btnScaleBigger.disabled = false;

    }

    // записываем новое значение в поле отображения величины увеличения
    scaleValueOutput.value = currentValue + '%';
    // изменяем маштаб изображения
    targetImg.style.transform = 'scale(' + currentValue / 100 + ')';

  }

})();
