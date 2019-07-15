'use strict';

(function () {

  var ESC_KEY_CODE = 27;

  // содержит общие функции для проекта

  window.utilities = {

    insertTemplatesNodes: insertTemplatesNodes,
    isEscKeyPress: isEscKeyPress

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


  function isEscKeyPress(evt) {

    return evt.keyCode === ESC_KEY_CODE;

  }

})();
