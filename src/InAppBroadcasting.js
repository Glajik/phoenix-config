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
const broadcast = (key, data) => {
  // Проверяем наличие ключа
  const prefix = key.split(':')[0];
  const isValid = key => Msg[key] || prefix && Msg[prefix];
  if (!isValid(key)) {
    throw `broadcast: не найдено сообщение ${key} в списке ключей`;
  }

  // вызываем обработчики с телом сообщения, возвращаем результаты
  const results = Subscribers.map((handler) => {
    try {
      const result = handler(key, data);
      return { handler: handler.toString(), result }
    } catch (e) {
      throw `broadcast: Произошла ошибка "${e}" по сообщению "${key}" в обработчике:\n${handler.toString()}`;
    }
  });

  const handled = results.some(({ result }) => result && true);
  
  Logger.log('handled: %s', handled);

  if (!handled) {
    throw `broadcast: ни один обработчик не обработал сообщение "${key}"`;
  }

  return results;
};

/**
 * Перечисление получателей сообщений (обработчиков)
 * Ключ и данные пересылаются всем обработчикам. Их задача решать обработать сообщение
 * или ингорировать.
 */
const Subscribers = [
  // (key, data) => new AutocrashDB().create(key, data),
  // (key, data) => new AutocrashDB().update(key, data),
  // (key, data) => new AutocrashDB().remove(key, data),
  // (key, data) => new AutocrashDB().query(key, data),
  (key, data) => new AutocrashDB().onEvent(key, data),
  (key, data) => new PartTypesTab().onEvent(key, data),
];

/**
 * Перечисление стандартных ключей
 */
const Msg = {
  'DB_CREATE_DOC': 'DB_CREATE_DOC',
  // 'READ_DOC': 'READ_DOC',
  // 'UPDATE_DOC': 'UPDATE_DOC',
  // 'DELETE_DOC': 'DELETE_DOC',
  'DB_READ_COLL': 'DB_READ_COLL',
  'DB_ON_CREATED': 'DB_ON_CREATED',
  'DB_ON_DATA': 'DB_ON_DATA',

  'ON_CLICK_REFRESH_SHEET': 'ON_CLICK_REFRESH_SHEET',

  'ON_CLICK_NEW_ITEM': 'ON_CLICK_NEW_ITEM',

  // 'SINGLE_CELL_EDITED': 'SINGLE_CELL_EDITED',

};

const composeMsg = (...args) => args.join(':');