'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Занимается роутингом сообщений внутри приложения.
 * (TODO: Другие классы могут подписываться и отписываться на события по 
 * ключам). 
 * - Ключи определенным в списке k.
 * - Обработчики размещаются в списке handlers.
 */
var Task =
/**
 * Отправляет сообщение с данными обработчикам, подписанным на событие по ключу
 * @param { String } key Ключ, по которому будут вызваны обработчики
 * @param { Object } data Список ключ-значение, структура для каждого ключа
 * @return { Array } список объектов с результатами, или ошибками ввиде { handler, result }
 * - handler это тело обработчика в текстовом виде, для отладки
 * - result содержит true если успешно (обработчик должен вернуть или true или объект ошибки или throw exception)
 */
function Task(key, data) {
  _classCallCheck(this, Task);

  // Проверяем наличие ключа
  if (!Tasks[key]) {
    throw 'Task: \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D \u043A\u043B\u044E\u0447 ' + key + ' \u0432 \u0441\u043F\u0438\u0441\u043A\u0435 \u043A\u043B\u044E\u0447\u0435\u0439';
  }

  // вызываем обработчики с телом сообщения, возвращаем результаты
  return Task.handlers.map(function (handler) {
    try {
      var result = handler(key, data);
      return { handler: handler.toString(), result: result };
    } catch (e) {
      var message = 'Task: \u041F\u0440\u043E\u0438\u0437\u043E\u0448\u043B\u0430 \u043E\u0448\u0438\u0431\u043A\u0430 \u0432 \u043E\u0431\u0440\u0430\u0431\u043E\u0442\u0447\u0438\u043A\u0435 ' + handler.toString() + ' \u043F\u043E \u043A\u043B\u044E\u0447\u0443 ' + key + '.\n\u041F\u043E\u0434\u0440\u043E\u0431\u043D\u043E\u0441\u0442\u0438: ' + e;
      console.log(message);
      return { handler: handler.toString(), result: new Error(message) };
    }
  });
}

/**
 * Перечисление получателей сообщений (обработчиков)
 * Ключ и данные пересылаются всем обработчикам. Их задача решать обработать сообщение
 * или ингорировать.
 * (TODO: Тут по идее должна быть динамическая реализация регистрации обработчиков
 * но как это сделать пока не представляю)
 */
;

Task.handlers = [
// (key, data) => new AutocrashDB().create(key, data),
function (key, data) {
  return new AutocrashDB().read(key, data);
},
// (key, data) => new AutocrashDB().update(key, data),
// (key, data) => new AutocrashDB().remove(key, data),
// (key, data) => new AutocrashDB().query(key, data),
// (key, data) => new PartTypesTab().onEdit(key, data),
function (key, data) {
  return new PartTypesTab().updateSheet(key, data);
}];
;

/**
 * Перечисление ключей
 * Тут по идее должна быть динамическая подпись обработчиков на ключи.
 */
var Tasks = {
  'CREATE_DOC': 'CREATE_DOC',
  'READ_DOC': 'READ_DOC',
  'UPDATE_DOC': 'UPDATE_DOC',
  'DELETE_DOC': 'DELETE_DOC',
  'READ_ALL_DOCS': 'READ_ALL_DOCS',

  'SINGLE_CELL_EDITED': 'SINGLE_CELL_EDITED',
  'UPDATE_SHEET': 'UPDATE_SHEET'
};

Object.freeze(Tasks);