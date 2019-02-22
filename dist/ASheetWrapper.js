'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @class Инкапсулирует работу с содержимым листа
 */
var SheetWrapper = function () {
  /**
   * @param {*} sheetConfiguration Cтруктура данных, где: 
   * sheetName - имя листа; fields - список полей, 
   * или названия колонок, начиная слева; numHeaders - количество строк 
   * начиная с самой верхней, которые являются заголовком.
   */
  function SheetWrapper(sheetConfiguration) {
    _classCallCheck(this, SheetWrapper);

    var sheetName = sheetConfiguration.sheetName,
        fields = sheetConfiguration.fields,
        numHeaders = sheetConfiguration.numHeaders;

    this._fields = fields || ['id'];
    this._numHeaders = numHeaders;
    this._sheetName = sheetName || 'Sheet 1';
  }

  /**
   * Геттер возвращает объект листа таблицы
   * @return {Object} лист таблицы, из Sreadsheet API
   */


  _createClass(SheetWrapper, [{
    key: 'convert',


    /**
     * @private Метод преобразует двумерный массив данных таблицы в 
     * массив объектов, в которых представлены строки
     * @param {*} valuesColl двумерный массив
     * @param {*} fields список полей
     * @param {*} numHeaders количество строк-заголовков
     */
    value: function convert(valuesColl, fields, numHeaders) {
      if (numHeaders) {
        for (var i = 0; i < numHeaders; i++) {
          valuesColl.shift();
        }
      };

      var objectColl = [];
      var valuesCount = valuesColl.length;
      var fieldsCount = fields.length;

      for (var _i = 0; _i < valuesCount; _i++) {
        var obj = {};
        for (var j = 0; j < fieldsCount; j++) {
          obj[fields[j]] = valuesColl[_i][j];
        }
        obj.index = _i;
        obj.rowId = _i + 1 + numHeaders;
        objectColl.push(obj);
      }

      return objectColl;
    }
  }, {
    key: 'makeValuesFromObject',


    /**
     * Метод преобразует стуктуру строки в массив значений
     * @param {*} object Структура строки
     */
    value: function makeValuesFromObject(object) {
      return Helper.makeValuesFromObject(object, this.fields);
    }
  }, {
    key: 'makeObjectFromValues',


    /**
     * Метод преобразует данные из таблицы, представленные ввиде
     * [['1', 'a'], ['2', 'b'], ... ], в массив структур строк
     * @param {*} values двумерный массив
     */
    value: function makeObjectFromValues(values) {
      return Helper.makeObjectFromValues(values, this.fields);
    }
  }, {
    key: 'convertToValuesColl',


    /**
     * Метод преобразует массив структур строк в двумерный массив
     * @param {*} objectColl массив структур строк
     */
    value: function convertToValuesColl(objectColl) {
      return Helper.convertToValuesColl(objectColl, this.fields);
    }
  }, {
    key: 'findColumnId',


    /**
     * Возвращает номер столбца по названию
     * @param {*} name название столбца
     */
    value: function findColumnId(name) {
      var fieldsNames = this.fields;
      return Helper.find(name, fieldsNames) + 1;
    }
  }, {
    key: 'findColumnFieldName',


    /**
     * Возвращает название поля для столбца
     * @param {Number} column Номер столбца
     */
    value: function findColumnFieldName(column) {
      return this.fields[column - 1];
    }
  }, {
    key: 'getRowRange',


    /**
     * Возвращает диапазон строки - объект range, из Sreadsheet API
     * @param {*} rowId номер строки
     */
    value: function getRowRange(rowId) {
      var sheet = this.sheet,
          fields = this.fields;

      var numColumns = fields.length;
      return sheet.getRange(rowId, 1, 1, numColumns);
    }
  }, {
    key: 'getDataFromRange',


    /**
     * Возвращает данные диапазона строки ввиде масива значений
     * @param {*} range объект range, из Sreadsheet API
     */
    value: function getDataFromRange(range) {
      var values = range.getValues();
      return this.makeObjectFromValues(values[0]);
    }
  }, {
    key: 'getRowData',


    /**
     * Возвращает данные строки ввиде списка ключ-значение (объект строки)
     * @param {*} rowId номер строки
     */
    value: function getRowData(rowId) {
      var range = this.getRowRange(rowId);
      var data = this.getDataFromRange(range);
      return _extends({}, data, { rowId: rowId });
    }
  }, {
    key: 'getSelectedRow',


    /**
     * Метод возвращает номер строки с активной ячейкой (с фокусом на ней)
     */
    value: function getSelectedRow() {
      return this.sheet.getActiveCell().getRowIndex();
    }
  }, {
    key: 'updateSheet',


    /**
     * Обновляет данные во всем листе. Перед обновлением лист очищается
     * @param {*} objectColl массив структур строк
     */
    value: function updateSheet(objectColl) {
      var sheet = this.sheet;


      this.clearSheet();

      var row = 2;
      var column = 1;
      var numColumns = this.fields.length;
      var valuesColl = this.convertToValuesColl(objectColl);
      var numRows = objectColl.length;
      sheet.getRange(row, column, numRows, numColumns).setValues(valuesColl);
    }
  }, {
    key: 'clearSheet',


    /**
     * Очистить лист
     */
    value: function clearSheet() {
      var sheet = this.sheet;

      var row = 2;
      var column = 1;
      var numRows = sheet.getLastRow() - 1;
      if (numRows < 1) {
        return;
      }
      var numColumns = this.fields.length;
      sheet.getRange(row, column, numRows, numColumns).clearContent();

      SpreadsheetApp.flush();
    }
  }, {
    key: 'updateRow',


    /**
     * Обновляет данные строки. Версия с массивом.
     * @param {*} rowId номер строки
     * @param {*} values массив значений строки
     */
    value: function updateRow(rowId, values) {
      if (!values instanceof Array) {
        return;
      }

      var lock = LockService.getScriptLock();

      Logger.log('updateRow (arr.v.) hasLock?: %s', lock.hasLock());

      var sheet = this.sheet;

      var range = sheet.getRange(rowId, 1, 1, values.length);
      range.setFontWeight(null);
      range.setValues([values]);

      return range;
    }
  }, {
    key: 'updateRow',


    /**
     * Обновляет данные строки. Версия с массивом.
     * @param {*} rowId номер строки
     * @param {*} data структура строки
     */
    value: function updateRow(rowId, data) {
      var _this = this;

      if (!data instanceof Object) {
        return;
      }

      var lock = LockService.getScriptLock();

      Logger.log('updateRow (obj.v.) hasLock?: %s', lock.hasLock());

      var sheet = this.sheet;

      var numColumns = this._fields.length;
      var range = sheet.getRange(rowId, 1, 1, numColumns);
      var keys = Object.keys(data);
      keys.forEach(function (key) {
        var column = _this.findColumnId(key);
        if (column <= 0) {
          return;
        }
        range.getCell(1, column).setValue(data[key]);
      });

      return range;
    }
  }, {
    key: 'insertRow',


    /**
     * Вставить новую строку в начале таблицы (после заголовку)
     */
    value: function insertRow() {
      this.sheet.insertRowBefore(this.firstRow);
      return this.firstRow;
    }
  }, {
    key: 'appendRow',


    /**
     * Добавить строку в конце таблицы
     * @param {*} values массив значений 
     */
    value: function appendRow(values) {
      if (!values instanceof Array) {
        return;
      }
      this.sheet.appendRow(values);
    }
  }, {
    key: 'appendRow',


    /**
     * Добавить строку в конце таблицы
     * @param {*} data структура строки
     */
    value: function appendRow(data) {
      if (!data instanceof Object) {
        return;
      }
      var lastRowId = this.sheet.getLastRow();
      return this.updateRow(lastRowId, data);
    }
  }, {
    key: 'hide',


    /**
     * Спрятать строки по условию
     * @param {*} predicate условие (callback)
     */
    value: function hide(predicate) {
      var _this2 = this;

      var data = this.sheetData;
      var filtered = data.filter(predicate);
      SpreadsheetApp.getActiveSpreadsheet().toast('Мне повезет)');

      var blocks = filtered.reduce(function (acc, _ref) {
        var rowId = _ref.rowId;

        var _acc = _toArray(acc),
            first = _acc[0],
            rest = _acc.slice(1);
        // init acc


        if (!first) {
          return [{ rowId: rowId, count: 1 }];
        }

        // if current rowId is sequence - modify count of first element
        var count = first.count;
        if (first.rowId + count === rowId) {
          return [{ rowId: first.rowId, count: count + 1 }].concat(_toConsumableArray(rest));
        }

        // sequence break - add new element
        return [{ rowId: rowId, count: 1 }, first].concat(_toConsumableArray(rest));
      }, []);

      blocks.forEach(function (_ref2) {
        var rowId = _ref2.rowId,
            count = _ref2.count;
        return _this2.sheet.hideRows(rowId, count);
      });
    }
  }, {
    key: 'showAll',


    /**
     * Отобразить все строки
     */
    value: function showAll() {
      var length = this.sheet.getLastRow();
      this.sheet.showRows(3, length);
    }
  }, {
    key: 'sheet',
    get: function get() {
      if (this._sheet === undefined) {
        this._sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(this._sheetName);
      }
      return this._sheet;
    }
  }, {
    key: 'sheetName',


    /**
     * Геттер возвращает название листа, указанное пользователем
     * @return {String} название листа
     */
    get: function get() {
      return this._sheetName;
    }

    /**
     * Геттер возвращает список полей
     * @return {Array} поля
     */

  }, {
    key: 'fields',
    get: function get() {
      return this._fields;
    }

    /**
     * Геттер возвращает все данные листа, ввиде массива строк, которые представлены
     * объектами, где каждая колонка проименована из fields.
     * Заголовки исключены. Поле rowId обозначает реальный номер строки (отсчет с единицы).
     */

  }, {
    key: 'sheetData',
    get: function get() {
      if (this._sheetData === undefined) {
        var dataRange = this.sheet.getDataRange();
        var valuesColl = dataRange.getValues();
        this._sheetData = this.convert(valuesColl, this.fields, this._numHeaders);
      }
      return this._sheetData;
    }
  }, {
    key: 'firstRow',


    /**
     * Геттер возвращает реальный номер первой строки с данными
     */
    get: function get() {
      return this._numHeaders + 1;
    }
  }]);

  return SheetWrapper;
}();

;

/**
 * Спрятать строки
 */
function hideRows() {
  var _Reference$status = Reference.status,
      sent = _Reference$status.sent,
      other = _Reference$status.other,
      refund = _Reference$status.refund;

  var statusOneFrom = [sent, other, refund];

  var d = new Date();
  // const month = d.getMonth();
  // const aMonthAgo = d.setMonth(month - 1);
  // const sentDateThanEarlierMonth = (date) => date === '' || new Date(date) < aMonthAgo;

  var days = d.getDate();
  var fourteenDaysAgo = d.setDate(days - 14);
  var sentDateThanEarlier = function sentDateThanEarlier(date) {
    return date === '' || new Date(date) < fourteenDaysAgo;
  };

  var registrySheet = new SheetWrapper(registryConf);
  registrySheet.hide(function (order) {
    return Helper.has(order.status, statusOneFrom) && sentDateThanEarlier(order.delivery_sendDate);
  });
}

function showAllRows() {
  var registrySheet = new SheetWrapper(registryConf);
  registrySheet.showAll();
}

// *************************** TESTS ****************************
function testBlock() {
  var testFn = function testFn(data) {
    return data.reduce(function (acc, _ref3) {
      var rowId = _ref3.rowId;

      var _acc2 = _toArray(acc),
          first = _acc2[0],
          rest = _acc2.slice(1);
      // init acc


      if (!first) {
        return [{ rowId: rowId, count: 1 }];
      }

      var firstRowId = first.rowId;
      var count = first.count;
      // if current rowId is sequence - modify count of first element
      if (firstRowId + count === rowId) {
        return [{ rowId: firstRowId, count: count + 1 }].concat(_toConsumableArray(rest));
      }

      // sequence break - add new element
      return [{ rowId: rowId, count: 1 }, first].concat(_toConsumableArray(rest));
    }, []);
  };

  (function () {
    var testSequence = [{ rowId: 1 }, { rowId: 2 }, { rowId: 3 }, { rowId: 4 }, { rowId: 5 }];
    var result = testFn(testSequence);
    Logger.log('Test 1. (Must be & Has)');
    Logger.log('[{ rowId: 1, count: 5 }]');
    Logger.log('%s', result);
  })();

  (function () {
    var testSequence = [{ rowId: 1 }, { rowId: 3 }, { rowId: 4 }, { rowId: 9 }, { rowId: 10 }];
    var result = testFn(testSequence);
    Logger.log('Test 2. (Must be & Has)');
    Logger.log('[{ rowId: 1, count: 1 }, { rowId: 3, count: 2 }, { rowId: 9, count: 2 }]');
    Logger.log('%s', result);
  })();
}