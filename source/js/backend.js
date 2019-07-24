'use strict';

(function () {

  // реализует функционал по AJAX запросам на сервер

  window.backend = {

    loadData: loadData,
    sendData: sendData

  };

  /**
   * Создает запрос на получение данных на сервер
   *
   * @param {function} error - функция-каллбек, которая вызывается если при связи с сервером произошла ошибка
   * @param {function} success - функция-каллбек, которая вызывается при успешном выполнении запроса
   *
   */
  function loadData(error, success) {

    var option = {};

    option.onError = error;
    option.onSuccess = success;

    option.requestUrl = 'https://js.dump.academy/kekstagram/data';
    option.requestMethod = 'GET';

    request(option, null);

  }


  /**
   * Создает запрос на отправку данных на сервер
   *
   * @param {function} error - функция-каллбек, которая вызывается если при связи с сервером произошла ошибка
   * @param {function} success - функция-каллбек, которая вызывается при успешном выполнении запроса
   * @param {object} data - данные для отправки на сервер
   *
   */
  function sendData(error, success, data) {

    var option = {};

    option.onError = error;
    option.onSuccess = success;

    option.requestUrl = 'https://js.dump.academy/kekstagram';
    option.requestMethod = 'POST';

    request(option, data);

  }


  /**
   * Создает AJAX запрос на сервер
   *
   * @param {object} option - объект с настройками URL, метод отправки, обработчики успешного выполнения запроса и ошибки
   * @param {object} data - данные для отправки на сервер
   *
   */
  function request(option, data) {

    var xhr = new XMLHttpRequest();

    // максимальное время ожидания ответа от сервера
    var TIMEOUT = 10000;

    xhr.timeout = TIMEOUT;

    // устанавливаем тип данных для приема от сервера
    xhr.responseType = 'json';

    xhr.open(option.requestMethod, option.requestUrl);

    xhr.addEventListener('load', function () {

      if (xhr.status === 200) {

        option.onSuccess(xhr.response);

      } else {

        option.onError('Сервер сообщил об ошибке!\r\nОшибка: ' + xhr.status + ' ' + xhr.statusText);

      }

    });

    xhr.addEventListener('error', function () {

      option.onError('Нет связи с сервером!');

    });

    xhr.addEventListener('timeout', function () {

      option.onError('Нет связи с сервером в течении: ' + TIMEOUT / 1000 + ' cекунд!');

    });

    xhr.send(data);

  }

})();
