class PartTypesTab extends SheetWrapper {
  constructor() {
    super({
      sheetName: 'Типы деталей',
      numHeaders: 1,
      fields: [
        'full_path',
        'class',
        'type',
        'sub_type',
        'name',
      ]
    });
  };

  onEdit(e) {
    if (e.range.getSheet().getName() !== this.sheetName) {
      return;
    };

    const obj = {
      rowId: e.range.getRow(),
      rows: e.range.getNumRows(),
      column: e.range.getColumn(),
      columns: e.range.getNumColumns(),
      range: e.range,
      oldValue: e.oldValue,
      newValue: e.value,
    };

    const { rowId, rows, columns } = obj;
    const isOneCell = rows === 1 && columns === 1;
    const isHeadersRow = rowId < this.firstRow;

    if (!isOneCell || isHeadersRow) {
      return;
    }

    Logger.log('Cell %s %s edited', rowId, obj.column);
  }
}