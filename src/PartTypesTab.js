class PartTypesTab extends SheetWrapper {
  constructor() {
    super({
      sheetName: 'Типы деталей',
      numHeaders: 1,
      fields: [
        'full_path',
        'classname',
        'type',
        'subtype',
        'label_full',
      ]
    });
  };

  /**
   * Обработчик события редактирования из таблицы
   * @param {String} key Ключ события
   * @param {onEditEventStructure} data Структура данных
   */
  onEdit(key, data) {
    switch (key) {
      case Tasks.SINGLE_CELL_EDITED:
        const { sheetName } = data;
    
        if (sheetName !== this.sheetName) {
          return;
        };
        
        Logger.log('onEdit event on sheet: %s', sheetName);
    
        const { row, column } = data;
    
        const isHeadersRow = row < this.firstRow;
    
        if (isHeadersRow) {
          Logger.log('is header row - exit');
          return;
        }
    
        Logger.log('cell %s %s edited', row, column);
    
        // подготавливаем данные для отправки
        const { value } = data;
        const field = this.findColumnFieldName(column);
        const content = { [field]: value };

        // получаем данные из таблицы, указывающие путь к документу
        const { full_path } = super.getRowData(row);
    
        // update document in datapase
        new Task(Tasks.UPDATE_DOC, { full_path, content });
      break;
    
      default:
        break;
    } 
  }

  /**
   * Обновление всего листа, с предварительной очисткой
   * @param {*} key ключ
   * @param {*} sheetData массив строк, представленных списком ключ-значение
   */
  updateSheet(key, sheetData) {
    Logger.log('PartTypesTab.updateSheet(). key: %s, data: %s', key, sheetData);

    if (key !== Tasks.UPDATE_SHEET) return;

    super.updateSheet(sheetData);
  }
}