'use strict';

(function () {

  // содержит общие функции для проекта

  window.utilities = {

    insertTemplatesNodes: insertTemplatesNodes,
    isEscKeyPress: isEscKeyPress,
    eventInElement: eventInElement,
    getCoords: getCoords

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
   * Проверяет, является ли источник события элементов или ребенком одного из элементов заданного списка
   * Например, можно использовать для отмены действия, если кнопка ESC была нажата при фокусе в одном из заданных полей
   *
   * @param {object} target - Элемент на котором произошло событие
   * @param {array} elements - список элементов, с которым сравнивается
   * @return {boolean} - true, если источник события является одним из элементов переданного списка или его ребенком
   *
   */
  function eventInElement(target, elements) {


    for (var i = 0; i < elements.length; i++) {

      if (elements[i].contains(target)) {

        return true;

      }

    }

    return false;

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

})();
