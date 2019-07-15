'use strict';

(function () {

  // обрабатывает изменение изображения при клике на кнопках увеличения/уменьшения

  var SCALE_STEP = 25;
  var SCALE_MIN_VALUE = 25;
  var SCALE_MAX_VALUE = 100;

  var btnsContainer = document.querySelector('.scale');
  var btnScaleSmaller = btnsContainer.querySelector('.scale__control--smaller');
  var btnScaleBigger = btnsContainer.querySelector('.scale__control--bigger');
  var scaleOuputElement = btnsContainer.querySelector('.scale__control--value');

  window.scaleImg = {

    onBtnScaleClick: onBtnScaleClick,
    btnScaleSmaller: btnScaleSmaller,
    btnScaleBigger: btnScaleBigger,
    scaleOuputElement: scaleOuputElement

  };

  /**
   * Обрабатывает клик по кнопкам изменения размера изображения
   * входные параметры берет из внешнего замыкания
   *
   * @param {Object} evt - объект события
   * @param {Object} targetPreview - HTML-элемент, содержащий картинку для изменения ее размера
   *
   */
  function onBtnScaleClick(evt, targetPreview) {

    // если клик вне кнопок уменьшения и увеличения изображения, ничего не делаем
    if (evt.target.closest('.scale__control--smaller') !== btnScaleSmaller &&
        evt.target.closest('.scale__control--bigger') !== btnScaleBigger) {

      return;

    }

    // задаем знак числа шага уменьшения/увеличения изображения
    var step = (evt.target.closest('.scale__control--smaller') === btnScaleSmaller) ? -SCALE_STEP : SCALE_STEP;
    // считываем текущее значение на кнопке уменьшения/увеличения изображения
    var currentValue = parseInt(scaleOuputElement.value, 10);

    // увеличиваем значение на шаг и ограничиваем его согласно максимального и минимального значения
    // а также отключаем возможность взаимодействия с кнопками если выходим за пределы ограничений
    currentValue += step;

    if (currentValue >= SCALE_MAX_VALUE) {

      currentValue = SCALE_MAX_VALUE;
      btnScaleBigger.disabled = true;

    } else if (currentValue <= SCALE_MIN_VALUE) {

      currentValue = SCALE_MIN_VALUE;
      btnScaleSmaller.disabled = true;

    } else {

      btnScaleSmaller.disabled = false;
      btnScaleBigger.disabled = false;

    }

    // записываем новое значение в поле отображения величины увеличения
    scaleOuputElement.value = currentValue + '%';
    // изменяем маштаб изображения
    targetPreview.style.transform = 'scale(' + currentValue / 100 + ')';

  }

})();
