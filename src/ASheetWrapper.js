class SheetWrapper {
  constructor({ sheetName, fields, numHeaders }) {
    this._fields = fields || ['id'];
    this._numHeaders = numHeaders;
    this._sheetName = sheetName || 'Sheet 1';
  }

  get sheet() {
    if (this._sheet === undefined) {
        this._sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(this._sheetName);
    }
    return this._sheet;
  };

  get sheetName() {
    return this._sheetName;
  }

  get fields() {
    return this._fields;
  }

  get sheetData() {
    if (this._sheetData === undefined) {
      const dataRange = this.sheet.getDataRange();
      const valuesColl = dataRange.getValues();
      this._sheetData = this.convert(valuesColl, this.fields, this._numHeaders);
    }
    return this._sheetData;
  };

  get firstRow() {
    return this._numHeaders + 1;
  }

  convert(valuesColl, fields, numHeaders) {
    
    // remove header
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

  makeValuesFromObject(object) {
    return Helper.makeValuesFromObject(object, this.fields);
  };

  makeObjectFromValues(values) {
    return Helper.makeObjectFromValues(values, this.fields);
  };

  convertToValuesColl(objectColl) {
    return Helper.convertToValuesColl(objectColl, this.fields);
  };

  findColumnId(name) {
    const fieldsNames = this.fields;
    return Helper.find(name, fieldsNames) + 1;
  };

  getRowRange(rowId) {
    const { sheet, fields } = this;
    const numColumns = fields.length;
    return sheet.getRange(rowId, 1, 1, numColumns);
  };

  getDataFromRange(range) {
    const values = range.getValues();
    return this.makeObjectFromValues(values[0]);
  };

  getRowData(rowId) {
    const range = this.getRowRange(rowId);
    const data = this.getDataFromRange(range);
    return { ...data, rowId };
  };

  getSelectedRow() {
    return this.sheet.getActiveCell().getRowIndex();
  };

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

  // array version
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

  // object version
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

  insertRow() {
    this.sheet.insertRowBefore(this.firstRow);
    return this.firstRow;
  };

  appendRow(values) {
    if (!values instanceof Array) {
      return;
    }
    this.sheet.appendRow(values);
  };

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

  showAll() {
    const length = this.sheet.getLastRow();
    this.sheet.showRows(3, length);
  }

};

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