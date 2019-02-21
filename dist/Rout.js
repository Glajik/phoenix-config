'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @class Занимается роутингом сообщений внутри приложения.
 * Другие классы могут подписываться и отписываться на события по 
 * ключам определенным в списке subjects. Обработчики размещаются в списке
 * recipients.
 */
var Rout =
/**
 * Отправляет сообщение с данными обработчикам, подписанным на событие по ключу
 * @param { String } subject Ключ, по которому будут вызваны обработчики
 * @param { Object } body Список ключ-значение, структура для каждого ключа
 */
function Rout(subject, body) {
  _classCallCheck(this, Rout);

  // вытаскиваем получателя по ключу handler
  var getHandler = function getHandler(handler) {
    return Rout.recipients[handler];
  };

  // вызываем функцию получателя с телом сообщения
  var sendBodyTo = function sendBodyTo(handler) {
    return getHandler(handler)({ subject: subject, body: body });
  };
  var result = recipients.map(function (handler) {
    return sendBodyTo(handler);
  });
  return result;
}

/**
 * Перечисление получателей сообщений (обработчиков)
 * Тут по идее должна быть динамическая реализация регистрации обработчиков
 * но как это сделать пока не представляю.
 */


/**
 * Перечисление тем сообщений (ключей), и получателей на сообщения (подписчиков)
 * Тут по идее должна быть динамическая подпись обработчиков на ключи.
 */
;

Rout.recipients = {
  'AutocrashCreate': function AutocrashCreate(_ref) {
    var subject = _ref.subject,
        body = _ref.body;
    return new AutocrashDB().create(subject);
  },
  'AutocrashRead': function AutocrashRead(_ref2) {
    var subject = _ref2.subject,
        body = _ref2.body;
    return new AutocrashDB().read(subject);
  },
  'AutocrashUpdate': function AutocrashUpdate(_ref3) {
    var subject = _ref3.subject,
        body = _ref3.body;
    return new AutocrashDB().update(subject, body);
  },
  'AutocrashDelete': function AutocrashDelete(_ref4) {
    var subject = _ref4.subject,
        body = _ref4.body;
    return new AutocrashDB().delete(subject, body);
  },
  'AutocrashQueryAll': function AutocrashQueryAll(_ref5) {
    var subject = _ref5.subject;
    return new AutocrashDB().query(subject);
  },

  'PartTypesTabOnEditHandler': function PartTypesTabOnEditHandler(_ref6) {
    var subject = _ref6.subject,
        body = _ref6.body;
    return new PartTypesTab().onEdit(body);
  }
};
Rout.subjects = {
  'SINGLE_CELL_EDITED': ['PartTypesTabOnEditHandler'],

  'UPDATE_DOC': ['AutocrashUpdate']
};
;