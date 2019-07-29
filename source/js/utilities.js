'use strict';

(function () {

  // содержит общие функции для проекта

  window.utilities = {

    insertTemplatesNodes: insertTemplatesNodes,
    isEscKeyPress: isEscKeyPress,
    getCoords: getCoords,
    showErrorMessage: showErrorMessage,
    getUniqueArrayNumbers: getUniqueArrayNumbers

  };

  /**
   * Вставляет группу DOM-элементов на страницу используюя DocumentFragment
   *
   * @param {object} nodes Список DOM-элементов для вствки в документ
   * @param {object} root DOM-элемент, куда будет вставлено сгенерированное содержимое
   */
  function insertTemplatesNodes(nodes, root) {

    var fragment = document.createDocumentFragment();

    for (var i = 0; i < nodes.length; i++) {

      fragment.appendChild(nodes[i]);

    }

    root.appendChild(fragment);
  }

  /**
   * Проверяет, была ли нажата кнопка ESC
   *
   * @param {object} evt - Объект события
   * @return {boolean} - true, если код нажатой кнопки совпадает с кодом кнопки ESC
   *
   */
  function isEscKeyPress(evt) {

    var ESC_KEY_CODE = 27;

    return evt.keyCode === ESC_KEY_CODE;

  }

  /**
   * Возвращает координаты переданного HTML элемента, приведенные в значение относительно документа, а не окна
   *
   * @param {object} elem - HTML-элемент, координаты которого нужно определить
   *
   * @return {object} - объект с координатами элемента относительно всего документа
   *
   */
  function getCoords(elem) {

    // получаем координаты элемента, но относительно окна, без учета прокрутки страницы
    var box = elem.getBoundingClientRect();

    // добавляем прокрутку страницы и возвращаем координаты относительно всего документа
    return {

      top: box.top + pageYOffset,
      left: box.left + pageXOffset

    };

  }

  /**
   * Используется для отображения ошибок выполнения операций при взаимодействии с сервером
   *
   * @param {string} message - текст сообщение об ошибки, который передает вызывающая функция
   *
   */
  function showErrorMessage(message) {

    var container = document.createElement('div');

    container.style.position = 'fixed';
    container.style.top = 0;
    container.style.bottom = 0;
    container.style.left = 0;
    container.style.right = 0;

    container.style.zIndex = 999;

    container.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';

    var messageElement = document.createElement('div');

    messageElement.style.position = 'absolute';
    messageElement.style.top = '50%';
    messageElement.style.left = '50%';
    messageElement.style.transform = 'translate(-50%, -50%)';

    messageElement.style.minHeight = '100px';
    messageElement.style.padding = '15px 20px';

    messageElement.style.backgroundColor = 'rgb(200, 10, 0)';
    messageElement.style.fontSize = '20px';
    messageElement.style.lineHeight = 1.3;
    messageElement.style.textAlign = 'center';

    messageElement.innerHTML = 'Перезагрузите страницу. Произошла ошибка:<br><br>' + message;

    container.appendChild(messageElement);

    document.body.appendChild(container);

  }

  /**
   * Используется для генерации массива уникальных случайных чисел в заданном диапазоне
   *
   * @param {number} arrLength - величина массива
   * @param {number} rangeMin - нижний предел от которого (включая) генерируются случайные числа
   * @param {number} rangeMax - верхний предел до которого (не включая) генерируются случайные числа
   *
   * @return {array} uniqueRandomArray - массив уникальных случайных чисел
   *
   */
  function getUniqueArrayNumbers(arrLength, rangeMin, rangeMax) {

    if (rangeMin >= rangeMax) {

      return [];

    }

    var temp = {};

    while (Object.keys(temp).length < arrLength) {

      var newValue = Math.floor(Math.random() * (rangeMax - rangeMin) + rangeMin);

      // + добавляется, чтобы браузер не воспринял объект как с числовыми ключами и не упорядочил значения
      temp['+' + newValue] = 'true';

    }

    var uniqueRandomArray = Object.keys(temp).map(function (current) {

      // преобразуем в число
      return parseInt(current, 10);

    });

    return uniqueRandomArray;

  }

})();
