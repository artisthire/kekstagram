'use strict';

(function () {

  // содержит функционал по ополучению данных из сервера для отображения картинок пользователя

  // колличество объектов в массиве данных
  var DATA_PHOTOS_LENGTH = 25;

  // генерируем временный массив данных для использования в шаблоне фоторгафий
  var dataPictures = generateTemplateData(DATA_PHOTOS_LENGTH);

  window.data = {

    uploadData: dataPictures

  };

  // временная функция для генерации массива данных, вместо загрузки по сети

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

})();
