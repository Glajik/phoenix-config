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

    this.coll_path = 'PartTypes';
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
   * Обработчик отправляет сообщение на получение данных из базы,
   * с нужным именем коллекции, и именем листа, куда эти данные нужно
   * вернуть
   * @param {*} key ключ
   * @param {*} data { sheetName, sheetData }, где:
   * - sheetName - имя листа, которое надо обновить
   * - sheetData - массив строк, представленных списком ключ-значение
   */
  onUpdateSheetEvent(key, data) {
    if (key !== `${Tasks.ON_UPDATE_SHEET}:${this.sheetName}`) {
      return;
    }

    Logger.log('PartTypesTab.onUpdateSheetEvent(%s, %s)', key, data);

    new Task(Tasks.DB_READ_COLL,
      {
        coll_path: this.coll_path,
        recipient: `${Tasks.UPDATE_SHEET}:${this.sheetName}`,
      });
    
    return true;
  };

  /**
   * Обработчик который обновляет лист
   * @param {*} key имя листа
   * @param {*} data структура, возвращаемая из базы данных { fields, ...}, где:
   * - fields - список ключ-значение с данными документа
   */
  updateSheetHandler(key, data) {
    if (key !== `${Tasks.UPDATE_SHEET}:${this.sheetName}`) {
      return;
    }

    Logger.log('PartTypesTab.updateSheetHandler(%s, %s)', key, data);

    // подготавливаем данные для записи в лист
    const sheetData = data.map(items => items.fields);

    super.updateSheet(sheetData);

    return true;
  };


}