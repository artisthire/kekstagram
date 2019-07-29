'use strict';

(function () {

  var imgFilterContainer = document.querySelector('.img-filters');
  var imgFilterForm = imgFilterContainer.querySelector('.img-filters__form');
  var imgFilterBtns = imgFilterForm.querySelectorAll('.img-filters__button');

  var btnIdTOFunction = {

    'popular': filterPopularImg,
    'new': filterNewImg,
    'discussed': filterDiscussedImg

  };

  window.imgsFilter = {

    initImgFilterForm: initImgFilterForm

  };

  /**
   * Отображает фильтры изображений и подготавливает обработку изменения фильтров
   *
   */
  function initImgFilterForm() {

    // отображаем фильтр картинок
    if (imgFilterContainer.classList.contains('img-filters--inactive')) {

      imgFilterContainer.classList.remove('img-filters--inactive');

    }

    // добавляем обработчик событий при клике на одну из картинок
    imgFilterForm.addEventListener('click', onBtnFilterClick);

  }

  /**
   * Фильтрует популярные картинки (согласно ТЗ - картинки в исходном состоянии)
   *
   * @param {object} evt - объект события при клике на одну из кнопок фильтра
   *
   */
  function onBtnFilterClick(evt) {

    var targetButton = evt.target.closest('button[type="button"]');

    // если клик не на кнопке или на уже активной кнопке-фильтре, ничего не делаем
    if (!targetButton ||
        !imgFilterForm.contains(targetButton) ||
        targetButton.classList.contains('img-filters__button--active')) {

      return;

    }

    // добавляем класс для отображения стилей активной кнопки
    Array.prototype.forEach.call(imgFilterBtns, function (currentElement) {

      currentElement.classList.remove('img-filters__button--active');

    });

    targetButton.classList.add('img-filters__button--active');

    // удаляем все картинки
    window.pictures.deleteMitiPictures();

    // по ID кнопки запускаем соответствующую функцию обработки
    var template = targetButton.id.split('-')[1];

    var dataImg = btnIdTOFunction[template]();

    window.pictures.insertMiniPictures(dataImg);

  }

  /**
   * Фильтрует популярные картинки (согласно ТЗ - картинки в исходном состоянии)
   *
   * @return {array} - возвращает массив данных с популярными картинками
   *
   */
  function filterPopularImg() {

    return window.data.uploadData;

  }

  /**
   * Фильтрует новые картинки (согласно ТЗ - 10 случайных не повторяющихся картинок)
   *
   * @return {array} - возвращает массив с объектами подходящими под критерий новых картинок
   *
   */
  function filterNewImg() {

    var COUNT_IMG = 10;

    var outputData = [];

    // генерируем массив уникальных случайных чисел
    var uniqueRandomArray = window.utilities.getUniqueArrayNumbers(COUNT_IMG, 0, window.data.uploadData.length);

    // на основе массива заполняем временный массив данными для отрисовки фотографий
    uniqueRandomArray.forEach(function (current) {

      outputData.push(window.data.uploadData[current]);

    });

    return outputData;

  }

  /**
   * Фильтрует обсуждаемые картинки (согласно ТЗ - отсортированные в порядке убывания количества комментариев)
   *
   * @return {array} - возвращает массив отсортированными данными по картинкам
   *
   */
  function filterDiscussedImg() {

    var outputData = window.data.uploadData.slice();

    outputData.sort(function (left, right) {

      if (right.comments.length > left.comments.length) {

        return 1;

      } else if (left.comments.length > right.comments.length) {

        return -1;

      } else {

        if (right.likes > left.likes) {

          return 1;

        } else if (left.likes > right.likes) {

          return -1;

        }

          return 0;

      }

    });

    return outputData;

  }

})();
