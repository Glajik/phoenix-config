/**
 * @class Занимается роутингом сообщений внутри приложения.
 * Другие классы могут подписываться и отписываться на события по 
 * ключам определенным в списке subjects. Обработчики размещаются в списке
 * recipients.
 */
class Rout {
  /**
   * Отправляет сообщение с данными обработчикам, подписанным на событие по ключу
   * @param { String } subject Ключ, по которому будут вызваны обработчики
   * @param { Object } body Список ключ-значение, структура для каждого ключа
   */
  constructor(subject, body) {
    const recipients = Rout.subjects[subject];

    if (!recipients) {
      throw `Не найден '${subject}' в списке subjects. Rout`;
    }

    if (recipients.length === 0) {
      console.log(`Список recipients для ключа '${subject}' пуст. Rout`);
      Logger.log (`Список recipients для ключа '${subject}' пуст. Rout`);
      return false;
    }

    // вытаскиваем получателя по ключу handler
    const getHandler = handler => {
      const handler = Rout.handlers[handler];
      if (!handler) {
        throw `Не найден recipient, зарегистрированный на ключ '${subject}'`;
      }
      return handler;
    }
    
    const sendTo = handler => getHandler(handler)({ subject, body });
    
    try {
      // вызываем обработчики с телом сообщения
      recipients.map(handler => sendTo(handler));
      
    } catch (e) {
      console.log(e);
      throw 'Произошла ошибка в одном из обработчиков. Rout';
    }

    // success
    return true;
  };

  /**
   * Перечисление получателей сообщений (обработчиков)
   * Тут по идее должна быть динамическая реализация регистрации обработчиков
   * но как это сделать пока не представляю.
   */
  static recipients = {
    'AutocrashCreate': ({ subject, body }) => new AutocrashDB().create(subject, body),
    'AutocrashRead': ({ subject, body }) => new AutocrashDB().read(subject, body),
    'AutocrashUpdate': ({ subject, body }) => new AutocrashDB().update(subject, body),
    'AutocrashDelete': ({ subject, body }) => new AutocrashDB().remove(subject, body),
    'AutocrashQueryAll': ({ subject, body }) => new AutocrashDB().query(subject, body),

    'PartTypesTabOnEditHandler': ({ subject, body }) => new PartTypesTab().onEdit(body),
  };

  /**
   * Перечисление тем сообщений (ключей), и получателей на сообщения (подписчиков)
   * Тут по идее должна быть динамическая подпись обработчиков на ключи.
   */

  static k = {
    'SINGLE_CELL_EDITED': [
      'PartTypesTabOnEditHandler',
    ],

    'CREATE_DOC': [
      'AutocrashCreate',
    ],

    'READ_DOC': [
      'AutocrashRead',
    ],

    'UPDATE_DOC': [
      'AutocrashUpdate',
    ],

    'DELETE_DOC': [
      'AutocrashDelete',
    ],

    'QUERY_ALL_DOCS': [
      'AutocrashQueryAll',
    ],
  };
  
};