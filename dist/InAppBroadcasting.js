'use strict';

/**
 * Занимается роутингом сообщений внутри приложения.
 * (TODO: Другие классы могут подписываться и отписываться на события по 
 * ключам). 

/**
 * Отправляет сообщение с данными всем обработчикам, перечисленным в Handlers
 * @param { String } key Ключ, по которому будут вызваны обработчики
 * @param { Object } data Список ключ-значение, структура для каждого ключа
 * @return { Array } [{ handler, result }, ...] , где:
 * - handler это тело обработчика в текстовом виде, для отладки
 * - result содержит true если успешно (обработчик должен вернуть или true или объект ошибки или throw exception)
 */
var broadcast = function broadcast(key, data) {
  // Проверяем наличие ключа
  var prefix = key.split(':')[0];
  var isValid = function isValid(key) {
    return Msg[key] || prefix && Msg[prefix];
  };
  if (!isValid(key)) {
    throw 'broadcast: \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u043E \u0441\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u0435 ' + key + ' \u0432 \u0441\u043F\u0438\u0441\u043A\u0435 \u043A\u043B\u044E\u0447\u0435\u0439';
  }

  // вызываем обработчики с телом сообщения, возвращаем результаты
  var results = Subscribers.map(function (handler) {
    try {
      var result = handler(key, data);
      return { handler: handler.toString(), result: result };
    } catch (e) {
      throw 'broadcast: \u041F\u0440\u043E\u0438\u0437\u043E\u0448\u043B\u0430 \u043E\u0448\u0438\u0431\u043A\u0430 "' + e + '" \u043F\u043E \u0441\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u044E "' + key + '" \u0432 \u043E\u0431\u0440\u0430\u0431\u043E\u0442\u0447\u0438\u043A\u0435:\n' + handler.toString();
    }
  });

  var handled = results.some(function (_ref) {
    var result = _ref.result;
    return result && true;
  });

  Logger.log('handled: %s', handled);

  if (!handled) {
    throw 'broadcast: \u043D\u0438 \u043E\u0434\u0438\u043D \u043E\u0431\u0440\u0430\u0431\u043E\u0442\u0447\u0438\u043A \u043D\u0435 \u043E\u0431\u0440\u0430\u0431\u043E\u0442\u0430\u043B \u0441\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u0435 "' + key + '"';
  }

  return results;
};

/**
 * Перечисление получателей сообщений (обработчиков)
 * Ключ и данные пересылаются всем обработчикам. Их задача решать обработать сообщение
 * или ингорировать.
 */
var Subscribers = [
// (key, data) => new AutocrashDB().create(key, data),
// (key, data) => new AutocrashDB().update(key, data),
// (key, data) => new AutocrashDB().remove(key, data),
// (key, data) => new AutocrashDB().query(key, data),
function (key, data) {
  return new AutocrashDB().onEvent(key, data);
}, function (key, data) {
  return new PartTypesTab().onEvent(key, data);
}];

/**
 * Перечисление стандартных ключей
 */
var Msg = {
  // 'CREATE_DOC': 'CREATE_DOC',
  // 'READ_DOC': 'READ_DOC',
  // 'UPDATE_DOC': 'UPDATE_DOC',
  // 'DELETE_DOC': 'DELETE_DOC',
  'DB_ON_DATA': 'DB_ON_DATA',
  'DB_READ_COLL': 'DB_READ_COLL',

  'ON_CLICK_REFRESH_SHEET': 'ON_CLICK_REFRESH_SHEET'

  // 'SINGLE_CELL_EDITED': 'SINGLE_CELL_EDITED',

};

var composeMsg = function composeMsg() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return args.join(':');
};