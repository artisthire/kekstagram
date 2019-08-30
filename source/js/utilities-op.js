export {insertElementsToFragment}

/**
 * Вставляет группу DOM-элементов на страницу используюя DocumentFragment
 *
 * @param {array} elements - Массив DOM-элементов для вствки в документ
 * @param {object} parentElement - DOM-элемент, куда будет вставлено сгенерированное содержимое
 *
 */
function insertElementsToFragment(elements, parentElement) {

  var fragment = document.createDocumentFragment();

  elements.reduce(function (container, currentNode) {

    container.appendChild(currentNode);

    return container;

  }, fragment);

  parentElement.append(fragment);

}
