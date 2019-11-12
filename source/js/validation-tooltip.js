const CSS_CLASSES = {
  messagesContainer: 'field-validation',
  messageItem: 'field-validation__item',
  messageError: 'field-validation__item--error'
};

// устанавливаем размер шрифта сообщений в 80% от шрифта валидируемого поля
const fontSizePercent = 0.8;

export class ValidationTooltip {

  constructor(validationInput) {
    this.input = validationInput;
  }

  addMessages({status, messages}) {

    if (!this._messagesContainer) {
      this._messagesContainer = document.createElement('ol');
      this._messagesContainer.className = CSS_CLASSES.messagesContainer;

      // устанавливаем размер шрифта валидационных сообщений
      let inputStyle = getComputedStyle(this.input);
      this._messagesContainer.style.fontSize = Math.trunc(parseInt(inputStyle.fontSize, 10) * fontSizePercent) + 'px';

      this.input.after(this._messagesContainer);
    }

    if (!this._messageItems) {
      this._messageItems = messages.map((message) => this._createMessageItem(message));
      this._messagesContainer.append(...this._messageItems);
    }

    status.forEach((valid, index) => this._updateMessageStatus(this._messageItems[index], valid));
  }

  destroy() {
    if (this._messagesContainer) {
      this._messagesContainer.remove();
      this._messagesContainer = null;
      this._messageItems = null;
    }
  }

  _createMessageItem(message) {
    let messageItem = document.createElement('li');
    messageItem.textContent = message;
    return messageItem;
  }

  _updateMessageStatus(messageItem, status) {
    messageItem.className = status ? CSS_CLASSES.messageItem : (CSS_CLASSES.messageItem + ' ' + CSS_CLASSES.messageError);
  }
}
