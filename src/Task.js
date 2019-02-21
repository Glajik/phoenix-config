/**
 * Занимается роутингом сообщений внутри приложения.
 * (TODO: Другие классы могут подписываться и отписываться на события по 
 * ключам). 
 * - Ключи определенным в списке k.
 * - Обработчики размещаются в списке handlers.
 */
class Task {
  /**
   * Отправляет сообщение с данными обработчикам, подписанным на событие по ключу
   * @param { String } key Ключ, по которому будут вызваны обработчики
   * @param { Object } data Список ключ-значение, структура для каждого ключа
   * @return { Array } [{ handler, result }, ...] , где:
   * - handler это тело обработчика в текстовом виде, для отладки
   * - result содержит true если успешно (обработчик должен вернуть или true или объект ошибки или throw exception)
   */
  constructor(key, data) {       
    // Проверяем наличие ключа
    if (!Tasks[key]) {
      throw `Task: не найден ключ ${key} в списке ключей`;
    }

    // вызываем обработчики с телом сообщения, возвращаем результаты
    return Task.handlers.map(handler => {
      try {
        const result = handler(key, data);
        return { handler: handler.toString(), result }
      } catch (e) {
        const message = `Task: Произошла ошибка в обработчике ${handler.toString()} по ключу ${key}.\nПодробности: ${e}`;
        console.log(message);
        Logger.log(message);
        return { handler: handler.toString(), result: new Error(message) }
      }
    });
  };

  /**
   * Перечисление получателей сообщений (обработчиков)
   * Ключ и данные пересылаются всем обработчикам. Их задача решать обработать сообщение
   * или ингорировать.
   * (TODO: Тут по идее должна быть динамическая реализация регистрации обработчиков
   * но как это сделать пока не представляю)
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