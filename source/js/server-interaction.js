/**
 * Модуль добавляет функционал по взаимодействию с сервером через AJAX
 * @module ./server-interaction
 */
export {loadDataPictures};
export {sendDataPicture};

/**
 * Создает запрос на сервер для получения информации о картинках пользователей
 * @param {function} onSuccess - функция, которая будет вызвана при успешной загрузке данных, получит загруженные данные
 * @param {function} onError - функция, которая будет вызвана при получении ошибки загрузки данных, получит сообщение об ошибке
 */
function loadDataPictures(onSuccess, onError) {
  // создаем объект запроса
  let request = new ServerRequest(
      'https://js.dump.academy/kekstagram/data',
      'GET',
      onSuccess,
      onError
  );

  // делаем запрос,
  // данные о картинках будут переданы в onSuccess при успешном завершении запроса
  // в случае ошибки в onError будет передана строка с информацией причинах ошибки
  request.sendRequest();
}

/**
 * Отправляет данные о загружаемой карнитке на сервер
 * @param {object} dataPicture - данные формы загрузки картинки на сервер
 * @param {function} onSuccess - функция, которая будет вызвана при успешной отправке данных
 * @param {function} onError - функция, которая будет вызвана при ошибке отправки данных, получит строку с ошибкой
 */
function sendDataPicture(dataPicture, onSuccess, onError) {
  let request = new ServerRequest(
      'https://js.dump.academy/kekstagram',
      'POST',
      onSuccess,
      onError
  );

  request.sendRequest(dataPicture);
}

/**
 * Class создает объект запроса на сервер
 */
class ServerRequest {

  // таймаут в течении которого ждем ответ от сервера
  _TIMEOUT = 10000;

  /**
   * Создает объект запроса
   * @param {string} url - URL-адрес, на который посылается запрос
   * @param {string} method - метод запроса (по умолчанию 'POST')
   * @param {function} onSuccess - функция, которая будет вызвана при успеном выполнении запроса (получит данные переданные сервером)
   * @param {function} onError - функция, которая будет вызвана при ошибках в выполнении запроса (получит строку с подробным описанием причин ошибки)
   */
  constructor(url = '', method = 'POST', onSuccess, onError) {
    this.requestUrl = url;
    this.requestMethod = method;
    this.onSuccess = onSuccess;
    this.onError = onError;
  }

  /**
   * Отправляет запрос на сервер
   * Запрос ожидает ответа сервера в течении времени, заданным переменной _TIMEOUT
   * @param {object} requestData - объект с данным для отправки на сервер. Может отсутствовать если данные запрашиваются.
   */
  sendRequest(requestData = null) {

    let requestHeaders = {method: this.requestMethod};

    // данные только для отправки методом 'POST'
    if (this.requestMethod === 'POST' && requestData) {
      requestHeaders.body = requestData;
    }

    // Promise.race - вернет результат первого выполнившегося промиса
    Promise.race([
      fetch(this.requestUrl, requestHeaders),
      new Promise((_, reject) =>
        setTimeout(
            () => reject(new Error(`Нет связи с сервером в течении: ${this._TIMEOUT / 1000} cекунд!`)),
            this._TIMEOUT
        )
      )
    ])
    .then((response) => {

      if (response.ok) {
        return response.json();
      }

      throw new Error(`Данные не получены.\nКод ошибки: ${response.status}`);
    })
    .then((responseData) => this.onSuccess(responseData))
    .catch((err) => this.onError(err.message));
  }
}
