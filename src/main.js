function onOpen(e) {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('Phoenix')
  .addItem('Обновить', 'onClickMenuItem_refreshSheet')
  .addItem('Добавить', 'onClickMenuItem_newItem')
  .addItem('Удалить', 'onClickMenuItem_deleteItem')
  .addSeparator()
  .addItem('Показать настройки доступа', 'serviceShowCredentials')
  .addItem('Сброс настроек доступа', 'serviceResetCredentials')
  .addToUi();
}

/**
 * Обработчик событий при редактировании таблицы
 * @param {Object} e объект события при редактировании таблицы { range, value, oldValue }, где:
 * - range это
 * - value это
 * - oldValue это
 */
function onEditInstall(e) {
  const { range, value, oldValue } = e;
  
  // data from event
  const sheet = range.getSheet();
  const sheetName = sheet.getName();
  const row = range.getRow();
  const numRows = e.range.getNumRows();
  const column = range.getColumn();
  const numColumns = e.range.getNumColumns();

  // Если одна ячейка редактировалась
  const isOneCell = numRows === 1 && numColumns === 1;

  if (isOneCell) {
    const onEditEventStructure = { sheetName, sheet, row, column, numRows, numColumns, value, oldValue };
    new Task(Tasks.SINGLE_CELL_EDITED, onEditEventStructure);
  }

  // TODO:
  // Если одна ячейка была очищена
  // Если несколько ячеек
};

function serviceShowCredentials() {
  const options = new Options();
  const firebase_credentials = options.load('firebase_credentials');
  const { client_email, project_id, private_key } = firebase_credentials;

  const prompt = `client_email: ${client_email}\n
  project_id: ${project_id}\n
  private_key: \n${private_key}`;
  
  SpreadsheetApp.getUi().alert(prompt);
};

function serviceResetCredentials() {
  new Options().setup('firebase_credentials');
};

/**
 * Создать документ
 */
function onClickMenuItem_newItem() {
  Logger.log('Создание документа');
  // TODO: 
  // - определить лист на котором находимся
  // - получить путь документу в зависимости от листа
  // - как-то определить каким должен быть шаблон в зависимости от листа
  
  const coll_path = 'PartTypes';
  
  const template = {
    class: 'NEW_CLASS',
    type: 'NEW_TYPE',
    sub_type: 'NEW_SUB_TYPE',
    name: 'Новое имя',
  };
  
  new Task(Tasks.CREATE_DOC, { coll_path, template });
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
  const sheetName = SpreadsheetApp.getActiveSheet().getName();
  
  const key = composeMsg(Msg.ON_CLICK_REFRESH_SHEET, sheetName);
  
  const results = broadcast(key);
  
  Logger.log(results);
};

/**
 * Удалить документ
 */
function onClickMenuItem_deleteItem() {
  Logger.log('Удалить документ');
  
  // TODO:
  // - определить лист на котором находимся
  // - получить путь документу в зависимости от листа

  const partTypesTab = new PartTypesTab();

  // номер выбранной строки
  const rowId = partTypesTab.getSelectedRow();

  if (!rowId) {
    throw 'Не определен rowId';
  }

  // данные строки
  const rowData = partTypesTab.getRowData(rowId);

  if (!rowData) {
    throw 'Нет данных rowData';
  }

  // извлекаем путь к документу, который нужно удалить
  const { full_path } = rowData;

  // TODO:
  // - валидация пути надо?
  if (!full_path) {
    throw 'Нет full_path';
  }
  
  new Task(Tasks.DELETE_DOC, { full_path });
};