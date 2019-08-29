export class ServerRequest {

  _TIMEOUT = 10000;

  constructor(url = '', method = 'POST', onSuccess, onError) {
    this.requestUrl = url;
    this.requestMethod = method;
    this.onSuccess = onSuccess;
    this.onError = onError;
  }

  sendRequest(requestData = null) {

    let requestHeaders = {method: this.requestMethod};

    if (this.requestMethod === 'POST' && requestData) {
      requestHeaders.body = requestData;
    }

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
