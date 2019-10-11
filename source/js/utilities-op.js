export {eventMixin, getUniqueRandomArrayNumbers};

/**
 * Миксин для добавления функционала генерации событий другим объектам
 */
let eventMixin = {
  /**
   * Подписаться на событие, использование:
   * menu.on('select', function(item) { ... }
   * @param {string} eventName - имя события на которое подписываемся
   * @param {function} handler - функция-каллбэк, которая будет вызвана при генерации события
   */
  on(eventName, handler) {
    if (!this._eventHandlers) {
      this._eventHandlers = {};
    }

    if (!this._eventHandlers[eventName]) {
      this._eventHandlers[eventName] = [];
    }
    // в объекте по имени события сохранить массив обработчиков
    this._eventHandlers[eventName].push(handler);
  },

  /**
   * Отменить подписку, использование:
   * menu.off('select', handler)
   * @param {string} eventName - имя события от которого отписываемся
   * @param {function} handler - функция-каллбэк, которая которая была передана при подписи на событие
   */
  off(eventName, handler) {
    let handlers = this._eventHandlers && this._eventHandlers[eventName];

    if (!handlers) {
      return;
    }

    // в объекте по имени события удалить обработчики, которые совпадаются с переданным handler
    for (let i = 0; i < handlers.length; i++) {
      if (handlers[i] === handler) {
        handlers.splice(i--, 1);
      }
    }
  },

  /**
   * Сгенерировать событие с указанным именем и данными
   * this.trigger('select', data1, data2);
   * @param {string} eventName - имя события для вызова обработчиков, которые были добавлены при подписке на событие
   * @param {array} args - параметры, которые должны быть переданы из объекта наружу для получаетелей события
   */
  trigger(eventName, ...args) {
    if (!this._eventHandlers || !this._eventHandlers[eventName]) {
      return; // обработчиков для этого события нет
    }

    // вызовем обработчики
    this._eventHandlers[eventName].forEach((handler) => handler.apply(this, args));
  }
};

/**
 * Используется для генерации массива уникальных случайных чисел в заданном диапазоне
 * @param {number} arrLength - количество уникальных числев в результирующем массиве
 * @param {number} rangeMin - нижний предел от которого (включая) генерируются случайные числа
 * @param {number} rangeMax - верхний предел до которого (не включая) генерируются случайные числа
 * @return {array}  - массив уникальных случайных чисел
 */
function getUniqueRandomArrayNumbers(arrLength, rangeMin = 0, rangeMax) {

  if (rangeMin >= rangeMax) {
    return [];
  }

  // создаем новое множество
  let randomArray = new Set();

  // заполняем множество случайными числами до величины, согласно arrLength
  while (randomArray.size < arrLength) {
    let newNumber = Math.floor(Math.random() * (rangeMax - rangeMin) + rangeMin);
    randomArray.add(newNumber);
  }

  // преобразуем множество в массив и возвращаем значение
  return Array.from(randomArray);
}
