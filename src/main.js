function onOpen(e) {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('Phoenix')
  .addItem('Refresh', 'service_refresh')
  .addToUi();
}

function onEdit(e) {
  new PartTypesTab().onEdit(e);
}

function service_refresh() {

}
