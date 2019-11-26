import {loadDataPictures} from './server-interaction.js';
import {FormUploadImg} from './form-upload-img.js';
import {UsersPictures} from './users-pictures.js';
import {PicturePreview} from './picture-preview.js';
import {FilterPictures} from './filter-pictures.js';

loadDataPictures(picturesLoadSuccess, console.log);

/**
 * Функция вызывается при успешной загрузке картинок
 * @param {array} data - массив с данными по картинкам, загруженными с сервера
 */
function picturesLoadSuccess(data) {
  const btnUploadFile = document.querySelector('#upload-file');
  const picturesContainerElement = document.querySelector('.pictures');
  const usersPictures = new UsersPictures();
  // сохранить загруженные данные в хранилище
  sessionStorage.setItem('picturesData', JSON.stringify(data));
  // отображить картинки на экране
  usersPictures.addUsersPictures(data);
  // добавить функционал по работе с картинками
  const formUploadImg = new FormUploadImg(btnUploadFile);
  const picturePreview = new PicturePreview(picturesContainerElement);
  const filterPictures = new FilterPictures();
}
