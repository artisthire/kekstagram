import {insertElementsToFragment} from './utilities-op.js';

export class UsersPictures {
  //TODO: дописать методы фильтрации изображений
  //TODO: далее функционал предпросмотра изображений - preview.js
  constructor() {
    // контейнер, куда вставляются картинки
    this.picturesContainer = document.querySelector('.pictures');
    // шаблон для вставки картинок пользователей на экран
    this.pictureTemplate = document.querySelector('#picture').content.querySelector('.picture');
  }

  addUsersPictures(picturesData) {
    // создаем массив с пользовательскими картинками на основе шаблона
    let picturesElements = picturesData.reduce((container, pictureData) => {
      container.push(this._createPictureElement(pictureData));

      return container;
    },
    []);

    insertElementsToFragment(picturesElements, this.picturesContainer);
  }

  deleteUsersPictures() {
    let pictures = Array.from(this.picturesContainer.querySelectorAll('.picture'));
    pictures.forEach(
        (currentPicture) => currentPicture.remove()
    );
  }

  _createPictureElement(pictureData) {
    let pictureElement = this.pictureTemplate.cloneNode(true);

    pictureElement.querySelector('.picture__img').src = pictureData.url;
    pictureElement.querySelector('.picture__likes').textContent = pictureData.likes;
    pictureElement.querySelector('.picture__comments').textContent = pictureData.comments.length;

    return pictureElement;
  }

}
