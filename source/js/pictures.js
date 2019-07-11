'use strict';

(function () {

  // контейнер для вставки элементов с разметкой фотографий
  var picturesContainerElement = document.querySelector('.pictures');
  var bigPictureContainer = document.querySelector('.big-picture');
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
  bigPictureContainer.classList.remove('hidden');

  modifyBigPictureElement(dataPictures[0]);

  // временное сокрытие элементов управления
  bigPictureContainer.querySelector('.social__comment-count')
    .classList.add('visually-hidden');

  bigPictureContainer.querySelector('.social__comments-loader')
    .classList.add('visually-hidden');

  /**
   * Модифицирует блок отображающий большую картинку по полученным данным
   *
   * @param {obj} data - Объект, содержащий информацию об адресе картинки, лайках и комментариях
   */
  function modifyBigPictureElement(data) {

    bigPictureContainer.querySelector('.big-picture__img > img').src = data.url;
    bigPictureContainer.querySelector('.likes-count').textContent = data.likes;
    bigPictureContainer.querySelector('.comments-count').textContent = data.comments.length;
    bigPictureContainer.querySelector('.social__caption').textContent = data.description;

    // создаем и заполняем массив элементов LI для списка комментариев
    var socialCommentElements = [];

    data.comments.forEach(function (current) {

      socialCommentElements.push(createSocialCommentElement(current));

    });

    var commentsContainerElement = bigPictureContainer.querySelector('.social__comments');

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

var ESC_KEY_CODE = 27;
var SCALE_STEP = 25;
var SCALE_MIN_VALUE = 25;
var SCALE_MAX_VALUE = 100;
var IMG_EFFECT_RESET_STRING = 'none';
var IMG_EFFECT_CLASS_PATTERN = 'effects__preview--';
var IMG_EFFECTS = {
  chrome: {filterName: 'grayscale', minValue: 0, maxValue: 1, filterUnit: ''},
  sepia: {filterName: 'sepia', minValue: 0, maxValue: 1, filterUnit: ''},
  marvin: {filterName: 'invert', minValue: 0, maxValue: 100, filterUnit: '%'},
  phobos: {filterName: 'blur', minValue: 0, maxValue: 3, filterUnit: 'px'},
  heat: {filterName: 'brightness', minValue: 1, maxValue: 3, filterUnit: ''}
};

var btnInputFile = document.querySelector('#upload-file');
var imgUploadPopup = document.querySelector('.img-upload__overlay');
var btnCloseImgUploadPopup = imgUploadPopup.querySelector('#upload-cancel');
var imgScaleBtnContainer = imgUploadPopup.querySelector('.scale');
var imgScaleBtnSmaller = imgScaleBtnContainer.querySelector('.scale__control--smaller');
var imgScaleBtnBigger = imgScaleBtnContainer.querySelector('.scale__control--bigger');
var imgScaleOuputElement = imgScaleBtnContainer.querySelector('.scale__control--value');
var imgPreviewElement = imgUploadPopup.querySelector('.img-upload__preview > img');

var imgEffectsListContainer = imgUploadPopup.querySelector('.effects__list');
var imgEffectsLevelContainer = imgUploadPopup.querySelector('.img-upload__effect-level');
var imgEffectsLevelPinElement = imgEffectsLevelContainer.querySelector('.effect-level__pin');
var imgEffectsLevelDepthElement = imgEffectsLevelContainer.querySelector('.effect-level__depth');
var imgEffectsInputElement = imgEffectsLevelContainer.querySelector('.effect-level__value');

var currentSelectChangeEffectInput = null;

btnInputFile.addEventListener('change', openImgUploadPopup);

function openImgUploadPopup() {

  imgUploadPopup.classList.remove('hidden');

  btnCloseImgUploadPopup.addEventListener('click', closeImgUploadPopup);
  // добавляем глобальный слушатель по нажатию клавиши ESC
  document.addEventListener('keydown', onImgUploadPopupKeydown);

  // добавляем обработку событий от кнопок изменения размеров изображения
  imgScaleBtnContainer.addEventListener('click', onImgScaleBtnClick);

  // добавляем обработку события от кнопок изменения эффектов для изображения
  imgEffectsListContainer.addEventListener('change', onImageEffectInputChange);

  // добавляем обработку события при передвижении слайдера изменения эффектов
  imgEffectsLevelPinElement.addEventListener('mousedown', onImageSliderPinMousedown);

}

function closeImgUploadPopup() {

  imgUploadPopup.classList.add('hidden');

  btnCloseImgUploadPopup.removeEventListener('click', closeImgUploadPopup);
  // удаляем глобальный слушатель по нажатию клавиши ESC
  document.removeEventListener('keydown', onImgUploadPopupKeydown);
  // сбрасываем значение input[type='file'] для повторной сработки события 'change' если изображение будет тем же самым
  btnInputFile.value = '';

  // удаляем обработчик для кнопок изменения размеров изображения
  // сбрасываем настройки кнопок и изображения в исходное состояние
  imgScaleBtnContainer.removeEventListener('click', onImgScaleBtnClick);
  imgPreviewElement.style.transform = '';
  imgScaleOuputElement.value = '100%';
  imgScaleBtnBigger.disabled = true;

  // удаляем обработку события от кнопок изменения эффектов для изображения
  imgEffectsListContainer.removeEventListener('change', onImageEffectInputChange);
  // изначально активирован оригинальный эффект, поэтому слайдер уровня эффекта скрыт
  imgEffectsLevelContainer.style.display = 'none';
  // также отсутствует эффект на картинке
  imgPreviewElement.className = '';

  // убираем обработку события при передвижении слайдера изменения эффектов
  imgEffectsLevelPinElement.removeEventListener('mousedown', onImageSliderPinMousedown);

}

function onImgUploadPopupKeydown(evt) {

  if (evt.keyCode === ESC_KEY_CODE) {

    closeImgUploadPopup();

  }

}

/**
 * Обрабатывает клик по кнопкам изменения размера изображения
 * входные параметры берет из внешнего замыкания
 *
 * @param {Object} evt - объект события
 *
 */
function onImgScaleBtnClick(evt) {

  // если клик вне кнопок уменьшения и увеличения изображения, ничего не делаем
  if (evt.target.closest('.scale__control--smaller') !== imgScaleBtnSmaller &&
      evt.target.closest('.scale__control--bigger') !== imgScaleBtnBigger) {

    return;

  }

  // задаем знак числа шага уменьшения/увеличения изображения
  var step = (evt.target.closest('.scale__control--smaller') === imgScaleBtnSmaller) ? -SCALE_STEP : SCALE_STEP;
  // считываем текущее значение на кнопке уменьшения/увеличения изображения
  var currentValue = parseInt(imgScaleOuputElement.value, 10);

  // увеличиваем значение на шаг и ограничиваем его согласно максимального и минимального значения
  // а также отключаем возможность взаимодействия с кнопками если выходим за пределы ограничений
  currentValue += step;

  if (currentValue >= SCALE_MAX_VALUE) {

    currentValue = SCALE_MAX_VALUE;
    imgScaleBtnBigger.disabled = true;

  } else if (currentValue <= SCALE_MIN_VALUE) {

    currentValue = SCALE_MIN_VALUE;
    imgScaleBtnSmaller.disabled = true;

  } else {

    imgScaleBtnSmaller.disabled = false;
    imgScaleBtnBigger.disabled = false;

  }

  // записываем новое значение в поле отображения величины увеличения
  imgScaleOuputElement.value = currentValue + '%';
  // изменяем маштаб изображения
  imgPreviewElement.style.transform = 'scale(' + currentValue / 100 + ')';

}

/**
 * Переключает тип эффекта, применяемого к изображению
 * входные параметры берет из внешнего замыкания
 *
 */
function onImageEffectInputChange() {

  // сбрасываем стиль для предыдущего эффекта
  imgPreviewElement.className = '';
  imgPreviewElement.style.WebkitFilter = '';
  imgPreviewElement.style.filter = '';

  // значение выбранного эффекта сохраняем в глобальную переменную
  currentSelectChangeEffectInput = document.activeElement;

  if (currentSelectChangeEffectInput.value === IMG_EFFECT_RESET_STRING) {

    imgEffectsLevelContainer.style.display = 'none';

  } else {

    // показываем слайдер управления уровнем эффекта
    // устанавливаем визуальное отображение уровня эффекта в 100%
    imgEffectsLevelContainer.style.display = '';
    imgEffectsLevelPinElement.style.left = '100%';
    imgEffectsLevelDepthElement.style.width = '100%';

    // устанавливаем значение поля input для уровня эффекта в максимальную величину согласно выбранного эффекта
    imgEffectsInputElement.value = IMG_EFFECTS[currentSelectChangeEffectInput.value].maxValue;

    // добавялем класс к карнитке согласно выбранного эффекта
    imgPreviewElement.classList.add(IMG_EFFECT_CLASS_PATTERN + currentSelectChangeEffectInput.value);

  }
}


function onImageSliderPinMousedown() {

  // добавляем обработчик завершения изменения эффекта к изображению
  imgEffectsLevelPinElement.addEventListener('mouseup', onImageSliderPinMouseup);

}

/**
 * Отрабатывает изменение выбранного эффекта при отпускании мыши на управляющем элементе слайдера
 *
 */
function onImageSliderPinMouseup() {

  // вычисляю степень применения эффекта по ширине линии-подложки слайдера и линии-заполнителя слайдера
  // линия-подложка слайдера является общим контейнером для пина и линии-заполнителя

  // сначала находим и округляем шиниры подложки и заполнителя
  var backgroundLineElementWidth = ~~imgEffectsLevelDepthElement.parentElement.offsetWidth;
  var depthLineElementWidth = ~~imgEffectsLevelDepthElement.offsetWidth;

  // получаем параметры для применения выбранного эффекта
  var effectFilterName = IMG_EFFECTS[currentSelectChangeEffectInput.value].filterName;
  var effectMinValue = IMG_EFFECTS[currentSelectChangeEffectInput.value].minValue;
  var effectMaxValue = IMG_EFFECTS[currentSelectChangeEffectInput.value].maxValue;
  var effectFilterUnit = IMG_EFFECTS[currentSelectChangeEffectInput.value].filterUnit;

  // вычисляем уровень эффекта по пропорции элементов, минимальному и максимальному значению эффекта
  var effectLevel = effectMinValue + (depthLineElementWidth / backgroundLineElementWidth * (effectMaxValue - effectMinValue));

  // устанавливаем значение поля input для уровня эффекта
  imgEffectsInputElement.value = effectLevel.toFixed(2);

  // получаем строку записи в стили изображения согласно выбранного фильтра
  var effectFilterString = effectFilterName + '(' + effectLevel.toFixed(2) + effectFilterUnit + ')';

  // применяем фильтр
  imgPreviewElement.style.WebkitFilter = effectFilterString;
  imgPreviewElement.style.filter = effectFilterString;

  imgEffectsLevelPinElement.removeEventListener('mouseup', onImageSliderPinMouseup);

}
