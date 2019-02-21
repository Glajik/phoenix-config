/**
 * @class Занимается роутингом сообщений внутри приложения.
 * (TODO) Другие классы могут подписываться и отписываться на события по 
 * ключам определенным в списке k. Обработчики размещаются в списке
 * handlers.
 */
class Task {
  /**
   * Отправляет сообщение с данными обработчикам, подписанным на событие по ключу
   * @param { String } key Ключ, по которому будут вызваны обработчики
   * @param { Object } data Список ключ-значение, структура для каждого ключа
   */
  constructor(key, data) {       
    // Проверяем наличие ключа
    if (!Tasks[key]) {
      throw `Task: не найден ключ ${key} в списке ключей`;
    }

    try {
      // вызываем обработчики с телом сообщения
      Task.handlers.map(handler => handler(key, data));
    } catch (e) {
      const errorMessage = `Task: Произошла ошибка в одном из обработчиков по ключу ${key}`;
      console.log(errorMessage);
      console.log(e);
      throw errorMessage;
    }

    // success
    return true;
  };

  /**
   * Перечисление получателей сообщений (обработчиков)
   * (TODO) Тут по идее должна быть динамическая реализация регистрации обработчиков
   * но как это сделать пока не представляю.
   */
  static handlers = [
    // (key, data) => new AutocrashDB().create(key, data),
    (key, data) => new AutocrashDB().read(key, data),
    // (key, data) => new AutocrashDB().update(key, data),
    // (key, data) => new AutocrashDB().remove(key, data),
    // (key, data) => new AutocrashDB().query(key, data),
    // (key, data) => new PartTypesTab().onEdit(key, data),
    (key, data) => new PartTypesTab().updateSheet(key, data),
  ];  
};

/**
 * Перечисление ключей
 * Тут по идее должна быть динамическая подпись обработчиков на ключи.
 */
const Tasks = {
  'CREATE_DOC': 'CREATE_DOC',
  'READ_DOC': 'READ_DOC',
  'UPDATE_DOC': 'UPDATE_DOC',
  'DELETE_DOC': 'DELETE_DOC',
  'READ_ALL_DOCS': 'READ_ALL_DOCS',

  'SINGLE_CELL_EDITED': 'SINGLE_CELL_EDITED',
  'UPDATE_SHEET':'UPDATE_SHEET',
};

Object.freeze(Tasks);