'use strict';

(function () {

  // контейнер для вставки элементов с разметкой фотографий
  var picturesContainerElement = document.querySelector('.pictures');
  // шаблон для фотографий
  var pictureTemplate = document.querySelector('#picture').content.querySelector('.picture');
  // колличество объектов в массиве данных
  var DATA_PHOTOS_LENGTH = 25;
  // генерируем временный массив данных для использования в шаблоне фоторгафий
  var dataPictures = generateTemplateData(DATA_PHOTOS_LENGTH);

  // создаем и заполняем массив DOM-элементов для вставки в код на основе данных
  var picturesElements = [];

  dataPictures.forEach(function (current) {

    picturesElements.push(createPictureElement(current));

  });

  // вставляем в контейнер набор элементов, содержащийх HTML разметку картинок на основе шаблона и данных
  insertTemplatesNodes(picturesElements, picturesContainerElement);

  // -----------------------------------------------
  // отображение большой картинки с комментариями
  var bigPictureContainerElement = document.querySelector('.big-picture');
  bigPictureContainerElement.classList.remove('hidden');

  modifyBigPictureElement(dataPictures[0]);

  // временное сокрытие элементов управления
  bigPictureContainerElement.querySelector('.social__comment-count')
    .classList.add('visually-hidden');

  bigPictureContainerElement.querySelector('.social__comments-loader')
    .classList.add('visually-hidden');

  /**
   * Модифицирует блок отображающий большую картинку по полученным данным
   *
   * @param {obj} data - Объект, содержащий информацию об адресе картинки, лайках и комментариях
   */
  function modifyBigPictureElement(data) {

    bigPictureContainerElement.querySelector('.big-picture__img > img').src = data.url;
    bigPictureContainerElement.querySelector('.likes-count').textContent = data.likes;
    bigPictureContainerElement.querySelector('.comments-count').textContent = data.comments.length;
    bigPictureContainerElement.querySelector('.social__caption').textContent = data.description;

    // создаем и заполняем массив элементов LI для списка комментариев
    var socialCommentElements = [];

    data.comments.forEach(function (current) {

      socialCommentElements.push(createSocialCommentElement(current));

    });

    var commentsContainerElement = bigPictureContainerElement.querySelector('.social__comments');

    commentsContainerElement.textContent = '';

    insertTemplatesNodes(socialCommentElements, commentsContainerElement);

    /**
     * Создает HTML-элемент LI содержащий разметку для каждого отдельного комментария под фотографией
     *
     * @param {string} comentText - Текст комментария
     * @return {object} DOM-элемент, содержащий разметку для вставки коментариев в контейнер
     */
    function createSocialCommentElement(comentText) {

      var li = document.createElement('li');
      li.className = 'social__comment';

      li.innerHTML = '<img class="social__picture" src="img/avatar-' + (Math.floor(Math.random() * (6 - 1)) + 1) +
        '.svg" alt="Аватар комментатора фотографии" width="35" height="35"> <p class="social__text">' +
         comentText + '</p>';

      return li;
    }
  }

  /**
   * Генерирует массив данных для вставки в HTML разметку фотографий
   *
   * @param {number} arrLength - Количество объектов с данными, которые будут вставлены в массив
   * @return {array} Массив объектов для вставки в HTML разметку фотографий
   */
  function generateTemplateData(arrLength) {

    var LIKES_MIN = 15;
    var LIKES_MAX = 200;

    // временные переменные для хранения массивов данных
    var imgUrls = [];
    var likes = [];
    var comments = [];
    var descriptions = [];
    var templateData = [];

    var templateComments = ['Всё отлично!', 'В целом всё неплохо. Но не всё.',
      'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
      'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
      'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
      'Лица у людей на фотке перекошены, как будто их избивают.\nКак можно было поймать такой неудачный момент?!'
    ];

    var templateDescriptions = ['Тестим новую камеру!', 'Затусили с друзьями на море',
      'Как же круто тут кормят', 'Отдыхаем...',
      'Цените каждое мгновенье. Цените тех, кто рядом с вами и отгоняйте все сомненья. Не обижайте всех словами......',
      'Вот это тачка!'
    ];

    // генерируем массивы и заполняем объект данных
    for (var i = 0; i < arrLength; i++) {

      // заполняем массив URL фоторграфий
      imgUrls.push('photos/' + (i + 1) + '.jpg');

      // массив лайков случайным числом в заданном диапазоне
      likes.push(Math.floor(Math.random() * (LIKES_MAX - LIKES_MIN)) + LIKES_MIN);

      // временная переменная для вычисления номера вставляемой строки из массивов-шаблонов коментариев
      var stringIndex = Math.floor(Math.random() * (templateComments.length - 1));

      // случайным образом заполняем массив коментариев двумя или 1-й строкой
      if (stringIndex % 2 === 0) {

        comments.push([templateComments[stringIndex], templateComments[Math.floor(Math.random() * (templateComments.length - 1))]]);

      } else {

        comments.push([templateComments[stringIndex]]);

      }

      // генерируем новый номер для строки из массива описаний
      stringIndex = Math.floor(Math.random() * (templateDescriptions.length - 1));

      // заполняем массив описайний случайной строкой из массива-шаблона описаний
      descriptions.push(templateDescriptions[stringIndex]);

      // заполняем массив объектов для описания фотограффий
      templateData.push({
        url: imgUrls[i],
        likes: likes[i],
        comments: comments[i],
        description: descriptions[i]
      });

    }

    return templateData;

  }

  /**
   * Генерирует DOM-элемент на основе шаблона для картинки
   *
   * @param {array} templateData - Массив объектов данных для использования в шаблоне разметки фотографии
   * @return {object} DOM-элемент содержащий разметку HTML для конкретного волшебника
   */
  function createPictureElement(templateData) {

    var pictureElement = pictureTemplate.cloneNode(true);

    pictureElement.querySelector('.picture__img').src = templateData.url;
    pictureElement.querySelector('.picture__likes').textContent = templateData.likes;
    pictureElement.querySelector('.picture__comments').textContent = templateData.comments.length;

    return pictureElement;
  }

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

})();
