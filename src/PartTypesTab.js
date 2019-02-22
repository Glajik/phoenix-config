class PartTypesTab extends SheetWrapper {
  constructor() {
    super({
      sheetName: 'Типы деталей',
      numHeaders: 1,
      fields: [
        'doc_create_time',
        'doc_update_time',
        'doc_path',
        'classname',
        'type',
        'subtype',
        'name',
        'aliases',
      ]
    });

    this.coll_path = 'PartTypes';

    this.template = {
      classname: 'NEW_CLASS',
      type: 'NEW_TYPE',
      subtype: 'NEW_SUB_TYPE',
      name: 'Новая деталь',
      aliases: {
        'Карточка': 'Нов. дет.',
        'Корешок мастера': 'Н.дт.',
        'Приемка': 'Деталь'
      },
    };
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
        const { doc_path } = super.getRowData(row);
    
        // update document in datapase
        new Task(Tasks.UPDATE_DOC, { doc_path, content });
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
    const ON_NEW = composeMsg(Msg.ON_CLICK_NEW_ITEM, this.sheetName);
    
    const DB_CREATE = Msg.DB_CREATE_DOC;
    const ON_CREATED = composeMsg(Msg.DB_ON_CREATED, this.sheetName);
    
    const DB_READ = Msg.DB_READ_COLL;
    const ON_DATA = composeMsg(Msg.DB_ON_DATA, this.sheetName);

    switch (key) {
      case ON_REFRESH:
        Logger.log('PartTypesTab.onEvent(%s, %s)', key, data);

        broadcast(DB_READ, {
            coll_path: this.coll_path,
            replyMsg: ON_DATA,
          });

        return 'success';

      case ON_NEW:
        Logger.log('PartTypesTab.onEvent(%s, %s)', key, data);

        broadcast(DB_CREATE, {
          coll_path: this.coll_path,
          content: this.template,
          replyMsg: ON_CREATED,
        });

      return 'success';

      case ON_DATA:
        Logger.log('PartTypesTab.onEvent(%s, %s)', key, data);

        // подготавливаем данные для записи в лист
        const sheetData = data.documents.map(item => {
          const {
            createTime: doc_create_time,
            updateTime: doc_update_time,
            name: doc_path,
            fields
          } = item;

          return { doc_create_time, doc_update_time, doc_path, ...fields };
        });          

        super.updateSheet(sheetData);
        
        return 'success';

      case ON_CREATED:
        Logger.log('PartTypesTab.onEvent(%s, %s)', key, data);

        // добавляем данные в лист
        super.appendRow(data.document.fields);
        
        return 'success';        

      default:
        return; // ignored
    }
  };
}