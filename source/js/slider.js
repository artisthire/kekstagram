'use strict';

(function () {

  // содержит код для обработки перемещения ползунка слайдера
  // предполагает, что координаты указателя задаются позиционированием внутри контейнера с помощью свойства стилей left

  var sliderContainer = null; // контейнер, внутри которого перемещается указатель
  var sliderPin = null; // указатель слайдера
  var sliderDepth = null; //  заполнитель слайдера между его левым краем и положением указателя

  // величины обновляются при каждом Mousedown, дабы учесть возможность изменнения габаритов слайдера
  var shiftCoordX = 0; // сдвиг между координатой клика и величиной координаты left в CSS для указателя
  var containerCoordX = 0; // координата Х контейнера
  var pinCoordX = 0; // координата сдвига указателя относительно контейнера
  // координаты указателя ограничены шириной контейнера
  var pinMinCoordX = 0;
  var sliderContainerWidth = 0;

  // содержит функцию, которая будет вызываться при перемещении указателя для применения эффектов, для которых используется слайдер
  var callbackFunc = null;

  window.slider = {

    initSlider: initSlider,
    destroySlider: destroySlider

  };

  /**
   * Инициализация слайдера
   *
   * @param {Object} callback - функция-каллбек, которая вызывается при изменении положения слайдера
   * @param {Object} container - HTML-элемент контейнер других элементов слайдера
   * @param {Object} pin - HTML-элемент указатель слайдера
   * @param {Object} depth - HTML-элемент заполнитель слайдера между его левым краем и положением указателя
   *
   */
  function initSlider(callback, container, pin, depth) {

    sliderContainer = container;
    sliderPin = pin;
    sliderDepth = depth;

    sliderContainerWidth = ~~sliderContainer.offsetWidth;

    callbackFunc = callback;

    sliderPin.addEventListener('mousedown', onSliderPinMousedown);

  }

  /**
   * Функция удаляет обработчики и переменные слайдера, когда он уже не нужен
   *
   */
  function destroySlider() {

    sliderPin.removeEventListener('mousedown', onSliderPinMousedown);

    sliderContainer = null;
    sliderPin = null;
    sliderDepth = null;

    callbackFunc = null;

  }

  /**
   * Обрабатывает старт события изменение положения указателя слайдера
   *
   * @param {Object} evt - объект события
   *
   */
  function onSliderPinMousedown(evt) {

    // получаем начальную координату по оси X для указателя
    var startPinCoordX = window.utilities.getCoords(sliderPin).left;

    // смещение для установки цетра указателя в точку клика
    var shiftCenterPin = sliderPin.offsetWidth / 2;

    // вычисляем смещение между координатой пина и точкой клика внутри пина
    // с учетом того, что пин в стилях мещен на 50% через transform
    shiftCoordX = evt.pageX - startPinCoordX - shiftCenterPin;

    // координата Х контейнера пина
    containerCoordX = window.utilities.getCoords(sliderContainer).left;

    // максимальная координата пина ограничена габаритами контейнера
    sliderContainerWidth = ~~sliderContainer.offsetWidth;

    // добавляем обработчик перемещения указателя при Mousemove и завершения перемещения при Mousedown
    document.addEventListener('mousemove', onSliderPinMousemove);
    document.addEventListener('mouseup', onSliderPinMouseup);

  }


  /**
   * Обрабатывает перемещение указателя при Mousemove
   *
   * @param {Object} evt - объект события
   *
   */
  function onSliderPinMousemove(evt) {

    // получаем текущую коодринату сдвига пина с учетом координат контейнера и начальной точки клика
    pinCoordX = evt.pageX - containerCoordX - shiftCoordX;

    // накладываем ограничение координаты границами контейнера
    pinCoordX = Math.max(pinCoordX, pinMinCoordX);
    pinCoordX = Math.min(pinCoordX, sliderContainerWidth);

    // сдвигаем указатель
    sliderPin.style.left = pinCoordX + 'px';

    // если слайдер содержит заполнитель, меняем также его ширину (% от ширины контейнера)
    if (sliderDepth) {

      sliderDepth.style.width = ((pinCoordX / sliderContainerWidth) * 100).toFixed(2) + '%';

    }

    // вызываем каллбек, передаем текущие координаты указателя и ширину контейнера
    callbackFunc(pinCoordX, sliderContainerWidth);

  }

  /**
   * Отрабатывает финал перемещения указателя при Mouseup
   *
   */
  function onSliderPinMouseup() {

    // вызываем каллбек, передаем текущие координаты указателя и ширину контейнера
    callbackFunc(pinCoordX, sliderContainerWidth);

    document.removeEventListener('mousemove', onSliderPinMousemove);
    document.removeEventListener('mouseup', onSliderPinMouseup);

  }


})();
