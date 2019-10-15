import {Popup} from './popup.js';

/**
 * Модуль функционала полноэкранного просмотра выбранной пользовательской картинки
 * Большая картинка отбражается при клике на одну из ссылок в отдельном модально попапе
 * @module ./popup
 */

export class PicturePreview {

  /**
   * Создает объект модуля полноэкранного просмотра картинки
   * @param {object} linksPicturesContainer - контейнер, содержащий все ссылки с миниатюрами картинок пользователей
   */
  constructor(linksPicturesContainer) {
    this.linksContainer = linksPicturesContainer;

    // элементы модального окна
    this._modalOverlay = document.querySelector('.big-picture');
    this._modalContainer = this._modalOverlay.querySelector('.big-picture__preview');
    this._modalCloseBtn = this._modalContainer.querySelector('#picture-cancel');

    // элементы для отображения данных по картинке внутри попапа
    this._imgElement = this._modalContainer.querySelector('.big-picture__img > img');
    this._imgTitle = this._modalContainer.querySelector('.social__caption');
    this._likesCount = this._modalContainer.querySelector('.likes-count');

    this._userCommentInput = this._modalContainer.querySelector('.social__footer-text');

    // добавляет обработчки отображения окна предпросмотра изображения
    // обработчик добавляется на общий контейнер ссылок на изображения
    this._onImgLinkClick = this._onImgLinkClick.bind(this);
    this.linksContainer.addEventListener('click', this._onImgLinkClick);
  }

  /**
   * Обработчик клика на одну из ссылок, содержащих миниатюры картинок
   * @param {object} evt - объект события клика
   */
  _onImgLinkClick(evt) {
    // получаем элемент ссылки на которой был клик
    let imgLink = evt.target.closest('.picture');

    // если клик не по ссылке на картинку внутри общего контейнера, ничего не делаем
    if (!imgLink) {
      return;
    }

    evt.preventDefault();

    // получаем ссылку на элемент картинки внутри ссылки, по которой был клик
    let imgElement = imgLink.querySelector('.picture__img');

    // получаем массив полученных с сервера данных по картинкам
    // массив был предварительно сохранен sessionStorage
    let picturesData = JSON.parse(sessionStorage.getItem('picturesData'));
    // находим данные для выбранной картинки
    // поочередно сравнивая ссылки на картинки в загруженных данных с ссылкой на картинку элемента по которому кликнули
    let pictureData = picturesData.find((currentPictureData) => currentPictureData.url === imgElement.getAttribute('src'));
    // создаем попап для отображения модального окна с предпросмотром выбранной картинки
    this._popup = new Popup(this._modalOverlay, this._modalContainer, [this._userCommentInput], this._modalCloseBtn);

    // инициируем и отображаем попап с картинкой
    this._initPicturePreviewBlock(pictureData);
    // добавляем обработку события закрытия попапа с картинкой
    this._destroyPicturePreviewBlock = this._destroyPicturePreviewBlock.bind(this);
    this._popup.on(this._popup.EVENT_CLOSE_POPUP, this._destroyPicturePreviewBlock);
    // отображаем попап
    this._popup.showPopup();
  }

  /**
   * Загружает в попап данные по картинке и комментариям к ней
   * @param {object} pictureData - объект с данными по выбранной картинке
   */
  _initPicturePreviewBlock(pictureData) {
    this._imgElement.src = pictureData.url;
    this._imgTitle.textContent = pictureData.description;
    this._likesCount.textContent = pictureData.likes;

    // создать отдельный блок с комментариями к выбранной картинке
    this._socialComments = new SocialCommentsBlock(pictureData.comments);
  }

  /**
   * Сбрасывает информацию о картинке и установленных обработчиках при закрытии попапа
   */
  _destroyPicturePreviewBlock() {
    this._popup.off(this._popup.EVENT_CLOSE_POPUP, this._destroyPicturePreviewBlock);
    this._popup = null;

    this._socialComments.destroySocialCommentsBlock();
    this._socialComments = null;
  }
}

/**
 * Отдельный класс для блока комментарие пользователей к выбранной картинке
 */
class SocialCommentsBlock {

  // используются для порционного отображения комментариев при клика на кнопку загрузки большего колличества комментариев
  COMMENTS_SHOW_STEP = 5;

  /**
   * Создает объект блока с комментариями к выбранной картинке
   * @param {object} commentsData - объект с частичными данными по выбранной картинке, содежит только то что касается комментариев
   */
  constructor(commentsData) {
    this.commentsData = commentsData;
    this._container = document.querySelector('.social');
    this._commentsCount = this._container.querySelector('.social__comment-count');
    this._commentsList = this._container.querySelector('.social__comments');
    this._btnMoreComments = this._container.querySelector('.social__comments-loader');
    this._userCommentInput = this._container.querySelector('.social__footer-text');

    this._initSocialComments();
  }

  /**
   * Сбрасывает информацию о комментариях к картинке при закрытии попапа
   */
  destroySocialCommentsBlock() {
    this._userCommentInput.value = '';
    this._btnMoreComments.removeEventListener('click', this._onMoreCommentsClick);
  }

  /**
   * Инициирует блок с комментариями
   */
  _initSocialComments() {
    this._nextCommentItem = 0;
    this._btnMoreComments.disabled = false;
    this._btnMoreComments.classList.remove('visually-hidden');
    this._commentsCount.classList.remove('visually-hidden');

    // убираем комментарии к предыдущей картине
    this._commentsList.textContent = '';

    // обработчик для кнопки загрузки большего количества коментариев
    this._onMoreCommentsClick = this._onMoreCommentsClick.bind(this);
    this._btnMoreComments.addEventListener('click', this._onMoreCommentsClick);
    this._updateSocialComments();
  }

  /**
   * Согласно COMMENTS_SHOW_STEP по частям показывает комментарии пользователей к картинке
   * Колличество отображаемых комментариев увеличивается при нажатии соответствующей кнопки
   */
  _updateSocialComments() {
    // сохраняем стартовое значение и увеличиваем диапазон комментариев для отображения
    let startCommentItem = this._nextCommentItem;
    this._nextCommentItem += this.COMMENTS_SHOW_STEP;

    // если достигнут предел количества комментарие, отключаем обработку загрузки доп. комметариев
    if (this._nextCommentItem >= this.commentsData.length) {
      this._nextCommentItem = this.commentsData.length;

      this._btnMoreComments.disabled = true;
      this._btnMoreComments.removeEventListener('click', this._onMoreCommentsClick);
    }

    // обновляем блок с информацией о количестве отображенных и доступных комментариев
    this._commentsCount.innerHTML = `${this._nextCommentItem} из
    <span class="comments-count">${this.commentsData.length}</span> комментариев`;

    // передаем часть массива комментариев, которые еще не отображены, для их добавления в блок комментариев
    this._addSocialComments(this.commentsData.slice(startCommentItem, this._nextCommentItem));
  }

  /**
   * Добавляет в общий контейнер элементы с комментариеми пользователей
   * @param {array} commentsData - массив данных по коментариям, которые нужно добавить в общий контейнер
   */
  _addSocialComments(commentsData) {
    // создаем и заполняем массив элементов LI для списка комментариев
    let socialCommentElements = commentsData.map((userComment) => this._createSocialCommentElement(userComment));
    // добавляем комментарии в общий контейнер
    this._commentsList.append(...socialCommentElements);
  }

  /**
   * Создает HTML-элемент, содержащий отдельный комментарий конкретного пользователя
   * @param {string} userComment - данные о комментарии и пользователе, который его добавил
   * @return {object} - HTML-элемент, содержащий разметку для вставки в общий контейнер
   */
  _createSocialCommentElement(userComment) {

    let commentItem = document.createElement('li');
    commentItem.className = 'social__comment';

    commentItem.innerHTML = `<img class="social__picture" src="${userComment.avatar}"
      alt="Аватар комментатора фотографии" width="35" height="35">
      <p class="social__text">${userComment.message}<br>
      <b>${userComment.name}</b></p>`;

    return commentItem;
  }

  /**
   * Обрабатывает клик на кнопке загрузки большего количества комментариев
   * @param {Object} evt - объект события
   */
  _onMoreCommentsClick(evt) {
    evt.preventDefault();
    this._updateSocialComments();
  }
}
