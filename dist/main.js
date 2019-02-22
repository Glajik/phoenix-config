'use strict';

function onOpen(e) {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Phoenix').addItem('Обновить', 'onClickMenuItem_refreshSheet').addItem('Добавить', 'onClickMenuItem_newItem').addItem('Удалить', 'onClickMenuItem_deleteItem').addSeparator().addItem('Показать настройки доступа', 'serviceShowCredentials').addItem('Сброс настроек доступа', 'serviceResetCredentials').addToUi();
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
function onClickMenuItem_newItem() {
  var sheetName = SpreadsheetApp.getActiveSheet().getName();

  var key = composeMsg(Msg.ON_CLICK_NEW_ITEM, sheetName);

  var results = broadcast(key);
};

/**
 * Получить все документы и обновить таблицу.
 * 1. оповещаем всех что произошло событие обновления листа
 * 2. обработчики в классах листов перехватывают событие проверяет его ли имя листа
 * затем один из них оповещает БД, что нужны данные и с каким ключом их рассылать.
 * 3. обработчик в классе БД перехватывает событие, выполняет запрос, и оповещает всех
 * что пришли данные
 * 4. обработчики в классах таблиц перехватывают сообщение с данными и проверяют есть ли
 * в ключе имя листа, и если да - обновляют лист
 */
function onClickMenuItem_refreshSheet() {
  var sheetName = SpreadsheetApp.getActiveSheet().getName();

  var key = composeMsg(Msg.ON_CLICK_REFRESH_SHEET, sheetName);

  var results = broadcast(key);

  // Logger.log(results);
};

/**
 * Удалить документ
 */
function onClickMenuItem_deleteItem() {
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