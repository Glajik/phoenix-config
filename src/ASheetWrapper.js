/**
 * @class Инкапсулирует работу с содержимым листа
 */
class SheetWrapper {
  /**
   * @param {*} sheetConfiguration Cтруктура данных, где: 
   * sheetName - имя листа; fields - список полей, 
   * или названия колонок, начиная слева; numHeaders - количество строк 
   * начиная с самой верхней, которые являются заголовком.
   */
  constructor(sheetConfiguration) {
    const { sheetName, fields, numHeaders } = sheetConfiguration;
    this._fields = fields || ['id'];
    this._numHeaders = numHeaders;
    this._sheetName = sheetName || 'Sheet 1';
  }

  /**
   * Геттер возвращает объект листа таблицы
   * @return {Object} лист таблицы, из Sreadsheet API
   */
  get sheet() {
    if (this._sheet === undefined) {
        this._sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(this._sheetName);
    }
    return this._sheet;
  };

  /**
   * Геттер возвращает название листа, указанное пользователем
   * @return {String} название листа
   */
  get sheetName() {
    return this._sheetName;
  }

  /**
   * Геттер возвращает список полей
   * @return {Array} поля
   */
  get fields() {
    return this._fields;
  }

  /**
   * Геттер возвращает все данные листа, ввиде массива строк, которые представлены
   * объектами, где каждая колонка проименована из fields.
   * Заголовки исключены. Поле rowId обозначает реальный номер строки (отсчет с единицы).
   */
  get sheetData() {
    if (this._sheetData === undefined) {
      const dataRange = this.sheet.getDataRange();
      const valuesColl = dataRange.getValues();
      this._sheetData = this.convert(valuesColl, this.fields, this._numHeaders);
    }
    return this._sheetData;
  };

  /**
   * Геттер возвращает реальный номер первой строки с данными
   */
  get firstRow() {
    return this._numHeaders + 1;
  }

  /**
   * @private Метод преобразует двумерный массив данных таблицы в 
   * массив объектов, в которых представлены строки
   * @param {*} valuesColl двумерный массив
   * @param {*} fields список полей
   * @param {*} numHeaders количество строк-заголовков
   */
  convert(valuesColl, fields, numHeaders) {
    if (numHeaders) {
      for (let i = 0; i < numHeaders; i++) {
        valuesColl.shift();
      }
    };

    const objectColl = [];
    const valuesCount = valuesColl.length;
    const fieldsCount = fields.length;

    for (let i = 0; i < valuesCount; i++) {
      let obj = {};
      for (var j = 0; j < fieldsCount; j++) {
        obj[fields[j]] = valuesColl[i][j];
      }
      obj.index = i;
      obj.rowId = i + 1 + numHeaders;
      objectColl.push(obj);
    }

    return objectColl;
  }; 

  /**
   * Метод преобразует стуктуру строки в массив значений
   * @param {*} object Структура строки
   */
  makeValuesFromObject(object) {
    return Helper.makeValuesFromObject(object, this.fields);
  };

  /**
   * Метод преобразует данные из таблицы, представленные ввиде
   * [['1', 'a'], ['2', 'b'], ... ], в массив структур строк
   * @param {*} values двумерный массив
   */
  makeObjectFromValues(values) {
    return Helper.makeObjectFromValues(values, this.fields);
  };

  /**
   * Метод преобразует массив структур строк в двумерный массив
   * @param {*} objectColl массив структур строк
   */
  convertToValuesColl(objectColl) {
    return Helper.convertToValuesColl(objectColl, this.fields);
  };

  /**
   * Возвращает номер столбца по названию
   * @param {*} name название столбца
   */
  findColumnId(name) {
    const fieldsNames = this.fields;
    return Helper.find(name, fieldsNames) + 1;
  };

  /**
   * Возвращает название поля для столбца
   * @param {Number} column Номер столбца
   */
  findColumnFieldName(column) {
    return this.fields[column - 1];
  };

  /**
   * Возвращает диапазон строки - объект range, из Sreadsheet API
   * @param {*} rowId номер строки
   */
  getRowRange(rowId) {
    const { sheet, fields } = this;
    const numColumns = fields.length;
    return sheet.getRange(rowId, 1, 1, numColumns);
  };

  /**
   * Возвращает данные диапазона строки ввиде масива значений
   * @param {*} range объект range, из Sreadsheet API
   */
  getDataFromRange(range) {
    const values = range.getValues();
    return this.makeObjectFromValues(values[0]);
  };

  /**
   * Возвращает данные строки ввиде списка ключ-значение (объект строки)
   * @param {*} rowId номер строки
   */
  getRowData(rowId) {
    const range = this.getRowRange(rowId);
    const data = this.getDataFromRange(range);
    return { ...data, rowId };
  };

  /**
   * Метод возвращает номер строки с активной ячейкой (с фокусом на ней)
   */
  getSelectedRow() {
    return this.sheet.getActiveCell().getRowIndex();
  };

  /**
   * Обновляет данные во всем листе. Перед обновлением лист очищается
   * @param {*} objectColl массив структур строк
   */
  updateSheet(objectColl) {
    const { sheet } = this;
    
    this.clearSheet();

    const row = 2;
    const column = 1;
    const numColumns = this.fields.length;
    const valuesColl = this.convertToValuesColl(objectColl);
    const numRows = objectColl.length;
    sheet.getRange(row, column, numRows, numColumns).setValues(valuesColl);
  };

  /**
   * Очистить лист
   */
  clearSheet() {
    const { sheet } = this;
    const row = 2;
    const column = 1;
    const numRows = sheet.getLastRow() - 1;
    if (numRows < 1) {
      return;
    }    
    const numColumns = this.fields.length;
    sheet
      .getRange(row, column, numRows, numColumns)
      .clearContent();

    SpreadsheetApp.flush();
  };

  /**
   * Обновляет данные строки. Версия с массивом.
   * @param {*} rowId номер строки
   * @param {*} values массив значений строки
   */
  updateRow(rowId, values) {
    if (!values instanceof Array) {
      return;
    }

    const lock = LockService.getScriptLock();

    Logger.log('updateRow (arr.v.) hasLock?: %s', lock.hasLock());

    const { sheet } = this;
    const range = sheet.getRange(rowId, 1, 1, values.length);
    range.setFontWeight(null);
    range.setValues([values]);

    return range;
  };

  /**
   * Обновляет данные строки. Версия с массивом.
   * @param {*} rowId номер строки
   * @param {*} data структура строки
   */
  updateRow(rowId, data) {
    if (!data instanceof Object) {
      return;
    }

    const lock = LockService.getScriptLock();

    Logger.log('updateRow (obj.v.) hasLock?: %s', lock.hasLock());

    const { sheet } = this;
    const numColumns = this._fields.length;
    const range = sheet.getRange(rowId, 1, 1, numColumns);
    const keys = Object.keys(data);
    keys.forEach((key) => {
      const column = this.findColumnId(key);
      if (column <= 0) {
        return;
      }
      range.getCell(1, column).setValue(data[key]);
    });

    return range;
  };

  /**
   * Вставить новую строку в начале таблицы (после заголовку)
   */
  insertRow() {
    this.sheet.insertRowBefore(this.firstRow);
    return this.firstRow;
  };

  /**
   * Добавить строку в конце таблицы
   * @param {*} values массив значений 
   */
  appendRow(values) {
    if (!values instanceof Array) {
      return;
    }
    this.sheet.appendRow(values);
  };

  /**
   * Добавить строку в конце таблицы
   * @param {*} data структура строки
   */
  appendRow(data) {
    if (!data instanceof Object) {
      return;
    }
    const lastRowId = this.sheet.getLastRow();
    return this.updateRow(lastRowId, data);
  };

  /**
   * Спрятать строки по условию
   * @param {*} predicate условие (callback)
   */
  hide(predicate) {
    const data = this.sheetData;
    const filtered = data.filter(predicate);
    SpreadsheetApp.getActiveSpreadsheet().toast('Мне повезет)');

    const blocks = filtered.reduce(
      (acc, { rowId }) => {
        const [first, ...rest] = acc;
        // init acc
        if (!first) {
          return [{ rowId, count: 1 }];
        }
        
        // if current rowId is sequence - modify count of first element
        const count = first.count;
        if (first.rowId + count === rowId) {
          return [{ rowId: first.rowId, count: count + 1 }, ...rest];
        }
    
        // sequence break - add new element
        return [{ rowId, count: 1}, first, ...rest];
      }, []);
      
      blocks.forEach(
        ({ rowId, count }) => this.sheet.hideRows(rowId, count));
  };

  /**
   * Отобразить все строки
   */
  showAll() {
    const length = this.sheet.getLastRow();
    this.sheet.showRows(3, length);
  }

};

/**
 * Спрятать строки
 */
function hideRows() {
  const { sent, other, refund } = Reference.status;
  const statusOneFrom = [ sent, other, refund ];

  const d = new Date();
  // const month = d.getMonth();
  // const aMonthAgo = d.setMonth(month - 1);
  // const sentDateThanEarlierMonth = (date) => date === '' || new Date(date) < aMonthAgo;

  const days = d.getDate();
  const fourteenDaysAgo = d.setDate(days - 14);
  const sentDateThanEarlier = (date) => date === '' || new Date(date) < fourteenDaysAgo;

  const registrySheet = new SheetWrapper(registryConf);
  registrySheet.hide(order => Helper.has(order.status, statusOneFrom) && sentDateThanEarlier(order.delivery_sendDate));
}

function showAllRows() {  
  const registrySheet = new SheetWrapper(registryConf);
  registrySheet.showAll();
}

// *************************** TESTS ****************************
function testBlock() {
  const testFn = (data) => data.reduce(
    (acc, { rowId }) => {
      const [first, ...rest] = acc;
      // init acc
      if (!first) {
        return [{ rowId, count: 1 }];
      }
      
      const firstRowId = first.rowId;
      const count = first.count;
      // if current rowId is sequence - modify count of first element
      if (firstRowId + count === rowId) {
        return [{ rowId: firstRowId, count: count + 1 }, ...rest];
      }
  
      // sequence break - add new element
      return [{ rowId, count: 1}, first, ...rest];
    }, []
  );    
  
  (() => {
    const testSequence = [{ rowId: 1}, { rowId: 2}, { rowId: 3}, { rowId: 4}, { rowId: 5}];
    const result = testFn(testSequence);
    Logger.log('Test 1. (Must be & Has)');
    Logger.log('[{ rowId: 1, count: 5 }]');
    Logger.log('%s', result);
  })();

  (() => {
    const testSequence = [{ rowId: 1}, { rowId: 3}, { rowId: 4}, { rowId: 9}, { rowId: 10}];
    const result = testFn(testSequence);
    Logger.log('Test 2. (Must be & Has)');
    Logger.log('[{ rowId: 1, count: 1 }, { rowId: 3, count: 2 }, { rowId: 9, count: 2 }]');
    Logger.log('%s', result);
  })();

}