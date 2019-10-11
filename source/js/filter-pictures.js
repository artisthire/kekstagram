import {UsersPictures} from './users-pictures.js';
import {getUniqueRandomArrayNumbers} from './utilities-op.js';

/**
 * Модуль фильтрации картинок на главном экране
 * @module ./users-pictures
 */
export class FilterPictures {

  /**
   * Создает объект модуля фильтрации картинок
   */
  constructor() {
    this.container = document.querySelector('.img-filters');
    this.form = this.container.querySelector('.img-filters__form');
    this.filterBtns = Array.from(this.form.querySelectorAll('.img-filters__button'));

    // используется для сопоставления ID кнопки фильтра с функцией фильтрации изображений, которую нужно вызвать
    this._idToFilterFunc = {
      'popular': this._filterPopularImg,
      'new': this._filterNewImg,
      'discussed': this._filterDiscussedImg
    };

    this._initFilter();
  }

  /**
   * Выполняет первоначальную инициализацию модуля фильтрации
   * Добавляет обработку событий кнопок фильтрации
   */
  _initFilter() {
    // показываем контейнер с кнопками фильтра
    this.container.classList.remove('img-filters--inactive');

    // получаем ссылку на объект для управления миниатюрами картинок
    this._usersPictures = new UsersPictures();
    // добавляем обработчик событий при клике на одну из картинок
    this._onBtnFilterClick = this._onBtnFilterClick.bind(this);
    this.form.addEventListener('click', this._onBtnFilterClick);
  }

  /**
   * Обрабатывает событие клика по кнопкам фильтрации картинок
   * @param {object} evt - объект события клика по кнопке
   */
  _onBtnFilterClick(evt) {
    const targetBtn = evt.target;

    // если клик не по одной из кнопок фильтрации либо по уже активной кнопке
    // ничего не делаем
    if (!this.filterBtns.includes(targetBtn) ||
        targetBtn.classList.contains('img-filters__button--active')) {
      return;
    }

    // находим предыдущую активную кнопку
    let prevActiveBtn = this.filterBtns.find((currentBtn) => currentBtn.classList.contains('img-filters__button--active'));
    // убираем клас в предыдущей активной кнопке и ставим в текущей
    prevActiveBtn.classList.remove('img-filters__button--active');
    targetBtn.classList.add('img-filters__button--active');

    // удаляем все картинки пользователей со страницы
    this._usersPictures.deleteUsersPictures();

    // по ID кнопки получаем имя соответствующей функции фильтрации картинок
    const funcName = targetBtn.id.split('-')[1];
    const picturesData = JSON.parse(sessionStorage.getItem('picturesData'));
    // применяем функцию фильтрации к массиву исходных данных по картинкам
    // получаем массив с данными по картинкам, которые соответствуют заданному критерию фильтрации
    const filterPicturesData = this._idToFilterFunc[funcName](picturesData);

    // добавляем отфильтрованные картинки на страницу
    this._usersPictures.addUsersPictures(filterPicturesData);
  }

  /**
   * Фильтрует популярные картинки (согласно ТЗ - вссе картинки)
   * @param {array} picturesData - исходный массив с данными по картинкам
   * @return {array} - массив после фильтрации согласно заданного критерия
   */
  _filterPopularImg(picturesData) {
    return picturesData;
  }

  /**
   * Фильтрует новые картинки (согласно ТЗ - 10 случайных не повторяющихся картинок)
   * @param {array} picturesData - исходный массив с данными по картинкам
   * @return {array} - массив после фильтрации согласно заданного критерия
   */
  _filterNewImg(picturesData) {
    // количество картинок в результирующем массиве
    const IMG_COUNT = 10;

    // генерируем массив уникальных случайных чисел
    const uniqueRandomArray = getUniqueRandomArrayNumbers(IMG_COUNT, 0, picturesData.length - 1);

    let filterPicturesData = [];
    // создаем новый массив данных на основе массива случайных чисел
    uniqueRandomArray.forEach((item) => filterPicturesData.push(picturesData[item]));

    return filterPicturesData;
  }

  /**
   * Фильтрует обсуждаемые картинки (согласно ТЗ - отсортированные в порядке убывания количества комментариев)
   * @param {array} picturesData - исходный массив с данными по картинкам
   * @return {array} - массив после фильтрации согласно заданного критерия
   */
  _filterDiscussedImg(picturesData) {
    let filterPicturesData = picturesData.slice();

    filterPicturesData.sort((first, second) => {
      if (first.comments.length === second.comments.length) {
        return +second.likes - +first.likes;
      } else {
        return second.comments.length - first.comments.length;
      }
    });

    return filterPicturesData;
  }
}
