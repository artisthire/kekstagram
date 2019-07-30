'use strict';

(function () {

  var picturesContainerElement = document.querySelector('.pictures');
  var modalContainer = document.querySelector('.big-picture');
  var modalCloseBtn = modalContainer.querySelector('#picture-cancel');
  var modalImgElement = modalContainer.querySelector('.big-picture__img > img');
  var modalLikeCountElement = modalContainer.querySelector('.likes-count');
  var modalCommentsCountElement = modalContainer.querySelector('.social__comment-count');
  var modalMoreCommentsBtn = modalContainer.querySelector('.social__comments-loader ');
  var commentsContainerElement = modalContainer.querySelector('.social__comments');
  var modalDescriptionElement = modalContainer.querySelector('.social__caption');
  var modalCommentElement = modalContainer.querySelector('.social__footer-text');

  // обработчик отображения большой картинки при клике на одну из ссылок
  // обработчик делегирован на общий контейнер
  picturesContainerElement.addEventListener('click', onBtnShowModalClick);

  // временное сокрытие элементов управления
  modalContainer.querySelector('.social__comment-count').classList.add('visually-hidden');
  modalContainer.querySelector('.social__comments-loader').classList.add('visually-hidden');

  // будет содержать данные в зависимости от того по какой картике кликнули
  var dataPicture = null;

  // используются для порционного отображения комментариев при клика на кнопку загрузки большего колличества комментариев
  var prevCountComments = 0;
  var currentCountCommens = 0;
  var COMMENTS_STEP = 5;

  /**
   * Обрабатывает открытие окна отображения большой картинки по клике на одну из ссылок
   * обработчик делегирован на контейнер элементов
   *
   * @param {Object} evt - объект события
   *
   */
  function onBtnShowModalClick(evt) {

    var targetContainer = evt.target.closest('.picture');

    // если клик не по ссылке на миниатюру картинки, то не обрабатываем событие
    if (!targetContainer) {

      return;

    }

    evt.preventDefault();

    // получаем элемент внутренней картинки миниатюры
    var innerImageElement = targetContainer.querySelector('.picture__img');

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
    updateModalData(dataPicture);
    modalContainer.classList.remove('hidden');
    modalImgElement.focus();

    // добавляем класс открытия модального окна к BODY
    document.body.classList.add('modal-open');

    // обработчик для кнопки загрузки большего количества коментариев
    modalMoreCommentsBtn.addEventListener('click', onBtnMoreCommentsClick);

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
    modalCommentElement.value = '';

    modalMoreCommentsBtn.removeEventListener('click', onBtnMoreCommentsClick);

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
      if (~[modalCommentElement].indexOf(evt.target)) {

        return;

      }

      onBtnCloseModalClick(evt);

    }

  }

  /**
   * Обрабатывает клик на кнопке загрузки большего количества комментариев
   *
   * @param {Object} evt - объект события
   *
   */
  function onBtnMoreCommentsClick(evt) {

    evt.preventDefault();

    updateSocialComments(dataPicture.comments);

  }

  /**
   * Модифицирует блок отображающий большую картинку по полученным данным
   *
   * @param {object} data - Объект, содержащий информацию об адресе картинки, лайках и комментариях
   */
  function updateModalData(data) {

    modalImgElement.src = data.url;
    modalLikeCountElement.textContent = data.likes;
    modalDescriptionElement.textContent = data.description;

    currentCountCommens = 0;
    modalMoreCommentsBtn.disabled = false;
    modalMoreCommentsBtn.classList.remove('visually-hidden');
    modalCommentsCountElement.classList.remove('visually-hidden');

    commentsContainerElement.textContent = '';

    updateSocialComments(data.comments);

  }

  /**
   * Добавляет социальные комментарии, модифицирует информацию об их количестве
   *
   * @param {array} commensArray - массив данных о комментариях, добавленых к фото
   */
  function updateSocialComments(commensArray) {

    prevCountComments = currentCountCommens;

    currentCountCommens += COMMENTS_STEP;

    // если достигнут предел количества комментарие, отключаем отключаем обработку загрузки доп. комметариев
    if (currentCountCommens >= commensArray.length) {

      currentCountCommens = commensArray.length;

      modalMoreCommentsBtn.disabled = true;
      modalMoreCommentsBtn.removeEventListener('click', onBtnMoreCommentsClick);

    }

    // заполняем блок с информацией о количестве отображенных и доступных комментариев
    modalCommentsCountElement.innerHTML = currentCountCommens + ' из ' +
      '<span class="comments-count">' + commensArray.length + '</span>' + ' комментариев';

    // передаем часть массива комментариев, которые еще не отображены, для их добавления в блок комментариев
    addSocialComments(commensArray.slice(prevCountComments, currentCountCommens));

  }

  /**
   * Добавляет в контейнер блок комментариев, данные по которым передаются через массив
   *
   * @param {array} commensArray - массив комментариев, которые нужно добавить в общий контейнер
   */
  function addSocialComments(commensArray) {

    // создаем и заполняем массив элементов LI для списка комментариев
    var socialCommentElements = [];

    commensArray.forEach(function (current) {

      socialCommentElements.push(createSocialCommentElement(current));

    });

    window.utilities.insertTemplatesNodes(socialCommentElements, commentsContainerElement);

  }

  /**
   * Создает HTML-элемент LI содержащий разметку для каждого отдельного комментария под фотографией
   *
   * @param {string} commentData - Текст комментария
   * @return {object} DOM-элемент, содержащий разметку для вставки коментариев в контейнер
   */
  function createSocialCommentElement(commentData) {

    var li = document.createElement('li');
    li.className = 'social__comment';

    li.innerHTML = '<img class="social__picture" src="' + commentData.avatar +
      '" alt="Аватар комментатора фотографии" width="35" height="35"> <p class="social__text">' +
       commentData.message + '<br><b>' + commentData.name + '</b></p>';

    return li;
  }

})();
