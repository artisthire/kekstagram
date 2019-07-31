'use strict';

(function () {

  var picturesContainerElement = document.querySelector('.pictures');

  window.pictures = {

    insertMiniPictures: insertMiniPictures,
    deleteMitiPictures: deleteMitiPictures

  };

  /**
   * Используется для заполнения миниатюрами картинок главной страцы
   *
   * @param {object} data - объект данных, полученных через AJAX с сервера
   *
   */
  function insertMiniPictures(data) {

    // шаблон для фотографий
    var pictureTemplate = document.querySelector('#picture').content.querySelector('.picture');

    // создаем и заполняем массив DOM-элементов для вставки в код на основе данных
    var picturesElements = data.reduce(function (container, currentElement) {

      container.push(createPictureElement(currentElement));
      return container;

    }, []);

    // вставляем в контейнер набор элементов, содержащийх HTML разметку картинок на основе шаблона и данных
    window.utilities.insertTemplatesNodes(picturesElements, picturesContainerElement);

    window.imgsFilter.initImgFilterForm();

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

  /**
   * Используется для удаления всех картинок пользователей
   *
   */
  function deleteMitiPictures() {

    var pictures = picturesContainerElement.querySelectorAll('.picture');

    Array.prototype.forEach.call(pictures, function (currentElement) {

      picturesContainerElement.removeChild(currentElement);

    });

  }

})();
