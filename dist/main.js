'use strict';

function onOpen(e) {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Phoenix').addItem('Обновить', 'serviceReadAll').addItem('Добавить', 'serviceCreate').addItem('Удалить', 'serviceDelete').addSeparator().addItem('Показать настройки доступа', 'serviceShowCredentials').addItem('Сброс настроек доступа', 'serviceResetCredentials').addToUi();
}

/**
 * Обработчик событий при редактировании таблицы
 * @param {Object} e объект события при редактировании таблицы { range, value, oldValue }, где:
 * - range это
 * - value это
 * - oldValue это
 */
function onEditInstall(e) {
  var range = e.range,
      value = e.value,
      oldValue = e.oldValue;

  // data from event

  var sheet = range.getSheet();
  var sheetName = sheet.getName();
  var row = range.getRow();
  var numRows = e.range.getNumRows();
  var column = range.getColumn();
  var numColumns = e.range.getNumColumns();

  // Если одна ячейка редактировалась
  var isOneCell = numRows === 1 && numColumns === 1;

  if (isOneCell) {
    var onEditEventStructure = { sheetName: sheetName, sheet: sheet, row: row, column: column, numRows: numRows, numColumns: numColumns, value: value, oldValue: oldValue };
    new Task(Tasks.SINGLE_CELL_EDITED, onEditEventStructure);
  }

  // TODO:
  // Если одна ячейка была очищена
  // Если несколько ячеек
};

function serviceShowCredentials() {
  var options = new Options();
  var firebase_credentials = options.load('firebase_credentials');
  var client_email = firebase_credentials.client_email,
      project_id = firebase_credentials.project_id,
      private_key = firebase_credentials.private_key;


  var prompt = 'client_email: ' + client_email + '\n\n  project_id: ' + project_id + '\n\n  private_key: \n' + private_key;

  SpreadsheetApp.getUi().alert(prompt);
};

function serviceResetCredentials() {
  new Options().setup('firebase_credentials');
};

/**
 * Создать документ
 */
function serviceCreate() {
  Logger.log('Создание документа');
  // TODO: 
  // - определить лист на котором находимся
  // - получить путь документу в зависимости от листа
  // - как-то определить каким должен быть шаблон в зависимости от листа

  var coll_path = 'PartTypes';

  var template = {
    class: 'NEW_CLASS',
    type: 'NEW_TYPE',
    sub_type: 'NEW_SUB_TYPE',
    name: 'Новое имя'
  };

  new Task(Tasks.CREATE_DOC, { coll_path: coll_path, template: template });
};

/**
 * Получить все документы и обновить таблицу
 */
function serviceReadAll() {
  // TODO:
  // - определить лист на котором находимся
  // - получить путь к коллекции в зависимости от листа

  var coll_path = 'PartTypes';

  new Task(Tasks.READ_ALL_DOCS, { coll_path: coll_path });
};

/**
 * Удалить документ
 */
function serviceDelete() {
  Logger.log('Удалить документ');

  // TODO:
  // - определить лист на котором находимся
  // - получить путь документу в зависимости от листа

  var partTypesTab = new PartTypesTab();

  // номер выбранной строки
  var rowId = partTypesTab.getSelectedRow();

  if (!rowId) {
    throw 'Не определен rowId';
  }

  // данные строки
  var rowData = partTypesTab.getRowData(rowId);

  if (!rowData) {
    throw 'Нет данных rowData';
  }

  // извлекаем путь к документу, который нужно удалить
  var full_path = rowData.full_path;

  // TODO:
  // - валидация пути надо?

  if (!full_path) {
    throw 'Нет full_path';
  }

  new Task(Tasks.DELETE_DOC, { full_path: full_path });
};