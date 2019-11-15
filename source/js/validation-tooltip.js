/**
 * Содержит класс для всплывающих подсказок при ошибках валидации заполнения формы загрузки изображения
 * @module ./form-upload-img
 */

// классы CSS для общего контейнера и каждого из сообщений о ошибке валидации
const CSS_CLASSES = {
  messagesContainer: 'field-validation',
  messageItem: 'field-validation__item',
  messageError: 'field-validation__item--error'
};

// устанавливаем размер шрифта сообщений в 80% от шрифта валидируемого поля (INPUT-а)
const fontSizePercent = 0.8;

/**
 * Class для отображения и обновления состояния ошибок валидации полей форм
 */
export class ValidationTooltip {

  /**
   * Создает объект блока с ошибкой валидации
   * @param {object} validationInput - HTML-элемент - ссылка на поле INPUT, к котором нужно добавить ошибки валидации
   */
  constructor(validationInput) {
    this.input = validationInput;
  }

  /**
   * Добавляет контейнер и сообщения ошибок валидации к валидируемому полю формы
   * В контейнер добавляются сообщение из массива messages, содержащих все критерии которым должно соответствовать поле
   * Выполнен ли критерий определяется boolean-значеним массива status
   * Критерий и его статус в массивах messages и status сопоставляются один к одному по порядку следования
   * @param {array} status - массив значений типа boolean, который содержит значения:
   * true - если поле соответствует заданному критерию, false - если не соответствует
   * @param {array} messages - массив типа string, который содержит сообщение ошибки для каждого критерия, которому должно соотвествовать поле
   */
  addMessages({status, messages}) {

    if (!this._messagesContainer) {
      // общим контейнером является нумерованый список
      this._messagesContainer = document.createElement('ol');
      this._messagesContainer.className = CSS_CLASSES.messagesContainer;

      // устанавливаем размер шрифта валидационных сообщений
      let inputStyle = getComputedStyle(this.input);
      this._messagesContainer.style.fontSize = Math.trunc(parseInt(inputStyle.fontSize, 10) * fontSizePercent) + 'px';

      // контейнер добавляется сразу за полем INPUT
      this.input.after(this._messagesContainer);
    }

    // добавляем сообщения в контейнер
    if (!this._messageItems) {
      this._messageItems = messages.map((message) => this._createMessageItem(message));
      this._messagesContainer.append(...this._messageItems);
    }

    // обновляем статус сообщений валидации
    status.forEach((valid, index) => this._updateMessageStatus(this._messageItems[index], valid));
  }

  /**
   * Удаляет блок с сообщениями валидации
   */
  destroy() {
    if (this._messagesContainer) {
      this._messagesContainer.remove();
      this._messagesContainer = null;
      this._messageItems = null;
    }
  }

  /**
   * Создает отдельное сообщение для заданого критерия валидации
   * @param {string} message - строка сообщения с критерием, которому должно соответствовать валидируемое поле
   * @return {object} - элемент LI со строкой критерия
   */
  _createMessageItem(message) {
    let messageItem = document.createElement('li');
    messageItem.textContent = message;
    return messageItem;
  }

  /**
   * Обновляет статус критерия валидации добавляя соотвествующий клас CSS, если критерий не пройден
   * @param {objec} messageItem - ссылка на HTML-элемент, который содержит критерий валидации
   * @param {boolean} status - true - поле соответствует критерию, false - не соответствует
   */
  _updateMessageStatus(messageItem, status) {
    messageItem.className = status ? CSS_CLASSES.messageItem : (CSS_CLASSES.messageItem + ' ' + CSS_CLASSES.messageError);
  }
}
