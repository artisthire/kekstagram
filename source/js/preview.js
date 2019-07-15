'use strict';

(function () {

  var picturesContainerElement = document.querySelector('.pictures');
  var modalContainer = document.querySelector('.big-picture');
  var modalCloseBtn = modalContainer.querySelector('#picture-cancel');
  var modalImgElement = modalContainer.querySelector('.big-picture__img > img');
  var modalLikeCountElement = modalContainer.querySelector('.likes-count');
  var modalCommentsCountElement = modalContainer.querySelector('.comments-count');
  var modalDescriptionElement = modalContainer.querySelector('.social__caption');

  // обработчик отображения большой картинки при клике на одну из ссылок
  // обработчик делегирован на общий контейнер
  picturesContainerElement.addEventListener('click', onBtnShowModalClick);

  // временное сокрытие элементов управления
  modalContainer.querySelector('.social__comment-count').classList.add('visually-hidden');
  modalContainer.querySelector('.social__comments-loader').classList.add('visually-hidden');

  /**
   * Обрабатывает открытие окна отображения большой картинки по клике на одну из ссылок
   * обработчик делегирован на контейнер элементов
   *
   * @param {Object} evt - объект события
   *
   */
  function onBtnShowModalClick(evt) {

    var targetContainer = evt.target.closest('.picture');

    // если клик не по ссылке на большую картинку, то не обрабатываем событие
    if (!targetContainer) {

      return;

    }

    evt.preventDefault();

    // получаем элемент внутренней картинки миниатюры
    var innerImageElement = targetContainer.querySelector('.picture__img');

    // будет содержать данные в зависимости от того по какой картике кликнули
    var dataPicture = null;

    // пробегаем по всему массиву данных и сравниваем уникальный адрес картинки в массиве
    // с адресом картики на ссыке по которой кликнули
    // если данные совпадают, то сохраняем объект с данными для заполнения большой картинки
    for (var i = 0; i < window.data.uploadData.length; i++) {

      // здесь именно getAttribute('src'), потому что свойство src вернет абсолютный адрес с учетом хоста
      // а нам нужен относительный в том же формате, в каком он был записан в массиве данных
      if (window.data.uploadData[i].url === innerImageElement.getAttribute('src')) {

        dataPicture = window.data.uploadData[i];
        break;

      }

    }

    // заполнение данными и отображение большой картинки
    modifyModal(dataPicture);
    modalContainer.classList.remove('hidden');
    modalImgElement.focus();

    // добавляем класс открытия модального окна к BODY
    document.body.classList.add('modal-open');

    // добавление обработчиков закрытия окна
    modalCloseBtn.addEventListener('click', onBtnCloseModalClick);
    document.addEventListener('keydown', onModalEscPress);

  }

  /**
   * Обрабатывает закрытие окна отображения большой картинки по клику на кнопке закрытия
   *
   * @param {Object} evt - объект события
   *
   */
  function onBtnCloseModalClick(evt) {

    evt.preventDefault();

    modalContainer.classList.add('hidden');
    document.body.classList.remove('modal-open');

    // удаляем обработчики закрытия окна
    modalCloseBtn.removeEventListener('click', onBtnCloseModalClick);
    document.removeEventListener('keydown', onModalEscPress);

  }

  /**
   * Обрабатывает закрытие окна отображения большой картинки по нажатию кнопки ESC
   *
   * @param {Object} evt - объект события
   *
   */
  function onModalEscPress(evt) {

    if (window.utilities.isEscKeyPress(evt)) {

      // если в фокусе находятся внутренний элемент ввода комментария
      // окно не закрываем
      if (document.activeElement.classList.contains('social__footer-text')) {

        return;

      }

      onBtnCloseModalClick(evt);

    }

  }

  /**
   * Модифицирует блок отображающий большую картинку по полученным данным
   *
   * @param {obj} data - Объект, содержащий информацию об адресе картинки, лайках и комментариях
   */
  function modifyModal(data) {

    modalImgElement.src = data.url;
    modalLikeCountElement.textContent = data.likes;
    modalCommentsCountElement.textContent = data.comments.length;
    modalDescriptionElement.textContent = data.description;

    // создаем и заполняем массив элементов LI для списка комментариев
    var socialCommentElements = [];

    data.comments.forEach(function (current) {

      socialCommentElements.push(createSocialCommentElement(current));

    });

    var commentsContainerElement = modalContainer.querySelector('.social__comments');

    commentsContainerElement.textContent = '';

    window.utilities.insertTemplatesNodes(socialCommentElements, commentsContainerElement);

    /**
     * Создает HTML-элемент LI содержащий разметку для каждого отдельного комментария под фотографией
     *
     * @param {string} commentText - Текст комментария
     * @return {object} DOM-элемент, содержащий разметку для вставки коментариев в контейнер
     */
    function createSocialCommentElement(commentText) {

      var li = document.createElement('li');
      li.className = 'social__comment';

      li.innerHTML = '<img class="social__picture" src="img/avatar-' + (Math.floor(Math.random() * (6 - 1)) + 1) +
        '.svg" alt="Аватар комментатора фотографии" width="35" height="35"> <p class="social__text">' +
         commentText + '</p>';

      return li;
    }
  }

})();
