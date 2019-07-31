'use strict';

(function () {

  var imgFilterContainer = document.querySelector('.img-filters');
  var imgFilterForm = imgFilterContainer.querySelector('.img-filters__form');
  var imgFilterBtns = imgFilterForm.querySelectorAll('.img-filters__button');

  var btnIdTOFunction = {

    popular: filterPopularImg,
    new: filterNewImg,
    discussed: filterDiscussedImg

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

    // по ID кнопки получаем имя соответствующей функции фильтрации картинок
    var functionName = targetButton.id.split('-')[1];

    var picturesData = btnIdTOFunction[functionName]();

    window.pictures.insertMiniPictures(picturesData);

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

    var picturesData = [];

    // генерируем массив уникальных случайных чисел
    var uniqueRandomArray = window.utilities.getUniqueArrayNumbers(COUNT_IMG, 0, window.data.uploadData.length);

    // на основе массива заполняем временный массив данными для отрисовки фотографий
    uniqueRandomArray.forEach(function (current) {

      picturesData.push(window.data.uploadData[current]);

    });

    return picturesData;

  }

  /**
   * Фильтрует обсуждаемые картинки (согласно ТЗ - отсортированные в порядке убывания количества комментариев)
   *
   * @return {array} - возвращает массив отсортированными данными по картинкам
   *
   */
  function filterDiscussedImg() {

    var picturesData = window.data.uploadData.slice();

    picturesData.sort(function (left, right) {

      // сортировка по уменьшению количества комментариев
      if (right.comments.length > left.comments.length) {

        return 1;

      } else if (left.comments.length > right.comments.length) {

        return -1;

      } else {

        // сортировка по уменьшению количеств лайков
        if (right.likes > left.likes) {

          return 1;

        } else if (left.likes > right.likes) {

          return -1;

        }

        return 0;

      }

    });

    return picturesData;

  }

})();
