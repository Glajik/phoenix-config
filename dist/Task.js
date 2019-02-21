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
 * @return { Array } [{ handler, result }, ...] , где:
 * - handler это тело обработчика в текстовом виде, для отладки
 * - result содержит true если успешно (обработчик должен вернуть или true или объект ошибки или throw exception)
 */
function Task(key, data) {
  _classCallCheck(this, Task);

  // Проверяем наличие ключа
  // if (!Tasks[key]) {
  //   throw `Task: не найдено сообщение ${key} в списке ключей`;
  // }

  // вызываем обработчики с телом сообщения, возвращаем результаты
  var results = Task.handlers.map(function (handler) {
    try {
      var result = handler(key, data);
      return { handler: handler.toString(), result: result };
    } catch (e) {
      throw 'Task: \u041F\u0440\u043E\u0438\u0437\u043E\u0448\u043B\u0430 \u043E\u0448\u0438\u0431\u043A\u0430 "' + e + '" \u043F\u043E \u043A\u043B\u044E\u0447\u0443 "' + key + '" \u0432 \u043E\u0431\u0440\u0430\u0431\u043E\u0442\u0447\u0438\u043A\u0435:\n' + handler.toString();
      // return { handler: handler.toString(), result: new Error(message) }
    }
  });

  var handled = results.some(function (_ref) {
    var result = _ref.result;
    return result && true;
  });

  Logger.log('handled: %s', handled);

  if (!handled) {
    throw 'Task: \u043D\u0438 \u043E\u0434\u0438\u043D \u043E\u0431\u0440\u0430\u0431\u043E\u0442\u0447\u0438\u043A \u043D\u0435 \u043E\u0431\u0440\u0430\u0431\u043E\u0442\u0430\u043B \u0441\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u0435 "' + key + '"';
  }

  return results;
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
  return new PartTypesTab().onUpdateSheetEvent(key, data);
}, function (key, data) {
  return new PartTypesTab().updateSheetHandler(key, data);
}];
;

/**
 * Перечисление ключей
 * Тут по идее должна быть динамическая подпись обработчиков на ключи.
 */
var Tasks = {
  // 'CREATE_DOC': 'CREATE_DOC',
  // 'READ_DOC': 'READ_DOC',
  // 'UPDATE_DOC': 'UPDATE_DOC',
  // 'DELETE_DOC': 'DELETE_DOC',
  'DB_READ_COLL': 'DB_READ_COLL',

  // 'SINGLE_CELL_EDITED': 'SINGLE_CELL_EDITED',
  'UPDATE_SHEET': 'UPDATE_SHEET',
  'ON_UPDATE_SHEET': 'ON_UPDATE_SHEET'
};

Object.freeze(Tasks);