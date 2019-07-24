'use strict';

(function () {

  window.pictures = {

    insertMiniPictures: insertMiniPictures

  };

  /**
   * Используется для заполнения миниатюрами картинок главной страцы
   *
   * @param {object} data - объект данных, полученных через AJAX с сервера
   *
   */
  function insertMiniPictures(data) {

    if (!data && typeof data !== 'object') {

      window.utilities.showErrorMessage('Не получены данные с сервера либо неправильный формат данных');

      return;

    }

    var picturesContainerElement = document.querySelector('.pictures');

    // шаблон для фотографий
    var pictureTemplate = document.querySelector('#picture').content.querySelector('.picture');

    // создаем и заполняем массив DOM-элементов для вставки в код на основе данных
    var picturesElements = [];

    data.forEach(function (current) {

      picturesElements.push(createPictureElement(current));

    });

    // вставляем в контейнер набор элементов, содержащийх HTML разметку картинок на основе шаблона и данных
    window.utilities.insertTemplatesNodes(picturesElements, picturesContainerElement);


    /**
     * Генерирует DOM-элемент на основе шаблона для картинки
     *
     * @param {array} templateData - Массив объектов данных для использования в шаблоне разметки фотографии
     * @return {object} DOM-элемент содержащий разметку HTML для конкретной картинки
     */
    function createPictureElement(templateData) {

      var pictureElement = pictureTemplate.cloneNode(true);

      pictureElement.querySelector('.picture__img').src = templateData.url;
      pictureElement.querySelector('.picture__likes').textContent = templateData.likes;
      pictureElement.querySelector('.picture__comments').textContent = templateData.comments.length;

      return pictureElement;
    }

  }

})();
