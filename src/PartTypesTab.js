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
   * Обработчик сообщений
   * @param {*} key ключ
   * @param {*} data данные, в зависимости от сообщения
   */
  onEvent(key, data) {
    const ON_REFRESH = composeMsg(Msg.ON_CLICK_REFRESH_SHEET, this.sheetName);
    const ON_DATA = composeMsg(Msg.DB_ON_DATA, this.sheetName);
    const DB_READ = Msg.DB_READ_COLL;

    switch (key) {
      case ON_REFRESH:
        Logger.log('PartTypesTab.onEvent(%s, %s)', key, data);

        broadcast(DB_READ, {
            coll_path: this.coll_path,
            replyMsg: ON_DATA,
          });

        return 'success';

      case ON_DATA:
        Logger.log('PartTypesTab.onEvent(%s, %s)', key, data);

        // подготавливаем данные для записи в лист
        const sheetData = data.map(items => items.fields);

        super.updateSheet(sheetData);
        
        return 'success';

      default:
        return; // ignored
    }
  };
}