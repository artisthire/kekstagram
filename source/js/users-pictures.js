/**
 * Модуль с классом для добавления картинок пользователей на главный экран
 * @module ./users-pictures
 */

export class UsersPictures {
  //TODO: дописать методы фильтрации изображений
  //TODO: далее функционал предпросмотра изображений - preview.js
  constructor() {
    // контейнер, куда вставляются картинки
    this.picturesContainer = document.querySelector('.pictures');
    // шаблон для вставки картинок пользователей на экран
    this.pictureTemplate = document.querySelector('#picture').content.querySelector('.picture');
  }

  /**
   * Добавляет картинки пользователей в контейнер
   * @param {array} picturesData - массив с данными по картинкам
   */
  addUsersPictures(picturesData) {
    // создаем массив с пользовательскими картинками на основе данных
    let picturesElements = picturesData.map(
        (pictureData) => this._createPictureElement(pictureData)
    );

    this.picturesContainer.append(...picturesElements);
  }

  /**
   * Удаляет все картинки в контейнере
   */
  deleteUsersPictures() {
    let pictures = Array.from(this.picturesContainer.querySelectorAll('.picture'));
    pictures.forEach(
        (currentPicture) => currentPicture.remove()
    );
  }

  /**
   * Создает HTML-элементы ссылок на пользовательские картинки на основе шаблона и данных, полученных с сервера
   * @param {object} picturesData - объект с данными по отдельной картинке
   * @return {object} - возвращает HTML-элемент <a> согласно шаблона с заполенными атрибутами согласно полученных данных
   */
  _createPictureElement(pictureData) {
    // сделать копию шаблона ссылки на картинку
    let pictureElement = this.pictureTemplate.cloneNode(true);

    // заполнить аттрибуты на основе данных
    pictureElement.querySelector('.picture__img').src = pictureData.url;
    pictureElement.querySelector('.picture__likes').textContent = pictureData.likes;
    pictureElement.querySelector('.picture__comments').textContent = pictureData.comments.length;

    return pictureElement;
  }

}
