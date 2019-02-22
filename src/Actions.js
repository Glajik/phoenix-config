// 1. serviceReadAll() -> "ON_UPDATE_SHEET:Типы деталей", null
// 2. -> PartTypesTab.onUpdateSheetEvent() -> "DB_READ_COLL", { coll_path, recipient: "UPDATE_SHEET:Типы деталей" }
// 3. -> AutocrashDB.read() -> "UPDATE_SHEET:Типы деталей", { fields }
// 4. -> PartTypesTab.updateSheetHandler()

/**
 * Отправляет сообщение с данными обработчикам, подписанным на событие по ключу
 * @param { String } key Ключ, по которому будут вызваны обработчики
 * @param { Object } data Список ключ-значение, структура для каждого ключа
 * @return { Array } [{ handler, result }, ...] , где:
 * - handler это тело обработчика в текстовом виде, для отладки
 * - result содержит true если успешно (обработчик должен вернуть или true или объект ошибки или throw exception)
 */
const broadcast = (key, data) => {
  // вызываем обработчики с телом сообщения, возвращаем результаты
  const handlersNames = Object.keys(Handlers);

  const results = handlersNames.map((hName) => send(hName, key, data));

  const handled = results.some(({ result }) => result && true);
  
  Logger.log('handled: %s', handled);

  if (!handled) {
    throw `Task: ни один обработчик не обработал сообщение "${key}"`;
  }

  return results;
};

/**
 * Отправляет сообщение конкретному обработчику
 * @param {*} key ключ
 * @param {*} data данные ключ-значение
 */
const send = (handlerName, key, data) => {
  const getHandler = name => Handlers[name];

  try {
    const handler = getHandler(handlerName);

    if (!handler) {
      throw `Task: не найден обработчик ${handlerName}`;
    }

    const result = handler(key, data);
    
    return { handler: handler.toString(), result }
  
  } catch (e) {
    throw `Task: Произошла ошибка "${e}" по ключу "${key}" в обработчике:\n${handler.toString()}`;
    // return { handler: handler.toString(), result: new Error(message) }
  }
}

const Handlers = {
  // (key, data) => new AutocrashDB().create(key, data),
  'dbRead': (key, data) => new AutocrashDB().read(key, data),
  // (key, data) => new AutocrashDB().update(key, data),
  // (key, data) => new AutocrashDB().remove(key, data),
  // (key, data) => new AutocrashDB().query(key, data),
  // (key, data) => new PartTypesTab().onEdit(key, data),
  'updateSheetEvent': (key, data) => new PartTypesTab().onUpdateSheetEvent(key, data),
  'updateSheetHandler': (key, data) => new PartTypesTab().updateSheetHandler(key, data),
};

/**
 * Точки входа. Последовательности выполнения. Только через сообщения.
 * Допустим вызов чистых функций.
 * const Flows = {
 *   handlers: {},
 *   actions: {},
 *   keys: {},
 * };
 */

class FlowsForSheet {
  constructor() {
  }

  keys = {
    'DB_READ_COLL': 'DB_READ_COLL',
    'updateSheetHandler': 'updateSheetHandler',
    'refreshSheetMenuItem_onClick': 'refreshSheetMenuItem_onClick',
  };

  handlers = [
    (key, data) => new PartTypesTab().onUpdateSheetEvent(key, data),
    (key, data) => new PartTypesTab().updateSheetHandler(key, data),
  ];
  
  // получить путь к коллекции
  getCollPath = sheetName => {
    const ref = {
      'Типы деталей': 'PartTypes',
    }
    return ref[sheetName] || null;
  };

  // соединитель ключей
  join = (...args) => args.join(':');

  /**
   * Обновление листа
   * @param {*} sheetName имя листа
   */
  refreshSheet(sheetName) {
    const { sheetName } = data;

  }
};

  const 
  // Эта идея лучше, т.к. нет жесткой привязки к методам классов
  // классы по прежнему не знают друг о друге, и кто примет сообщение
  // Плюс - наглядно видна последовательность действий и 
  'updateSheetFlow': (data) => {
    const { sheetName } = data;

    // получить путь к коллекции
    const getCollPath = sheetName => {
      const ref = {
        'Типы деталей': 'PartTypes',
      }
      return ref[sheetName] || null;
    };

    // соединитель ключей
    const join = (...args) => args.join(':');

    // вариант вызова чистой функции
    const coll_path = getCollPath(sheetName);

    // вариант отправки сообщения и его обработка здесь же
    const { result } = send('DB_READ_COLL', { coll_path });

    if (!result) {
      throw `Flows: Данные не получены`;
    }

    // отправки результата
    const newKey = join('UPDATE_SHEET', sheetName);
    broadcast(newKey, { sheetData: result.map(item => item.fields) });
    
    // const coll_path = send('getCollPath', { sheetName });
    
    // вариант отправки сообщения и его перехват затем в другом Action
    broadcast('DB_READ_COLL', { coll_path });
  },

  // вызовы методов классов на прямую (НЕ ГУД)
  // хотя классы и не знают друг о друге
  'badUpdateSheetFlow': (key, data) => {
    const partTypesTab = new PartTypesTab();
    
    const partTypesTabKey = join(Keys.sheet.updateSheet, partTypesTab.sheetName);

    switch (key) {
      case partTypesTabKey:
        // узнаем путь к коллекции в зависимости от листа
        const coll_path = getCollPath(sheetName);
    
        const documentColl = new AutocrashDB().read(coll_path);
        const sheetData = documentColl.map(item => item.fields);
        partTypesTab.updateSheet(sheetData);
      break;
    }
    
    // вариант отправки сообщения и его перехват затем в другом Action
    broadcast('DB_READ_COLL', { coll_path });
  },


};

const Keys = {
  'db': {
    'readColl': 'DB_READ_COLL',
    // 'CREATE_DOC': 'CREATE_DOC',
    // 'READ_DOC': 'READ_DOC',
    // 'UPDATE_DOC': 'UPDATE_DOC',
    // 'DELETE_DOC': 'DELETE_DOC',
  },

  'sheet': {
    'onUpdateSheet':'ON_UPDATE_SHEET',
    'updateSheet':'UPDATE_SHEET',
  },
};

// const Actions = {
//   [Keys.sheet.onUpdateSheet]: {
//     [Flows.updateSheetFlow]: true,
//     [Flows.someAnotherFlow]: false,
//   }
// };

/**
 * Списки действий, выполняемых при перехвате события
 */
const Actions = {
  'ON_UPDATE_SHEET': {
    'updateSheetFlow': true,
    'someAnotherFlow': false,
  },
  'DB_READ_COLL': {
    'updateSheetFlow': true,
  }
};


/**
 * Вариант для класса, если использовать методы класса
 */
// const Actions = {
//   'ON_UPDATE_SHEET': [
//     this.updateSheetFlow(), 
//     this.someAnotherFlow(),
//   ]
// };
