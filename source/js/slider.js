'use strict';

(function () {

  // содержит код для обработки перемещения ползунка слайдера
  // предполагает, что координаты указателя задаются позиционированием внутри контейнера с помощью свойства стилей left

  // контейнер, внутри которого перемещается указатель
  var sliderContainer = document.querySelector(`.effect-level__line`);
  // указатель слайдера
  var sliderPin = sliderContainer.querySelector('.effect-level__pin');
  // заполнитель слайдера между его левым краем и положением указателя
  var sliderDepth = sliderContainer.querySelector('.effect-level__depth');

  // величины обновляются при каждом Mousedown, дабы учесть возможность изменнения габаритов слайдера
  var shiftCoordX = 0; // сдвиг между начальной координатой клика внутри указателя и координатой левого габарита указателя
  var containerCoordX = 0; // координата Х контейнера
  var pinCoordX = 0; // координата сдвига указателя относительно контейнера
  // координаты указателя ограничены шириной контейнера
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
  function initSlider(callback) {

    callbackFunc = callback;

    sliderPin.addEventListener('mousedown', onSliderPinMousedown);
    sliderPin.addEventListener('dragstart', onSliderPinDragStart);

  }

  /**
   * Функция удаляет обработчики и переменные слайдера, когда он уже не нужен
   *
   */
  function destroySlider() {

    sliderPin.removeEventListener('mousedown', onSliderPinMousedown);
    sliderPin.removeEventListener('dragstart', onSliderPinDragStart);

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
    pinCoordX = Math.max(pinCoordX, 0);
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


  /**
   * Отменяет встроенный в браузер Drag`n`Drop
   *
   * @param {Object} evt - объект события
   *
   */
  function onSliderPinDragStart(evt) {

    evt.preventDefault();

  }

})();
