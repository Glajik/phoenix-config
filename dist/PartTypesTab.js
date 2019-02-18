'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PartTypesTab = function (_SheetWrapper) {
  _inherits(PartTypesTab, _SheetWrapper);

  function PartTypesTab() {
    _classCallCheck(this, PartTypesTab);

    return _possibleConstructorReturn(this, (PartTypesTab.__proto__ || Object.getPrototypeOf(PartTypesTab)).call(this, {
      sheetName: 'Типы деталей',
      numHeaders: 1,
      fields: ['document', 'uuid', 'orderId', 'type', 'sub_type', 'name']
    }));
  }

  _createClass(PartTypesTab, [{
    key: 'onEdit',
    value: function onEdit(e) {
      if (e.range.getSheet().getName() !== this.sheetName) {
        return;
      };

      var obj = {
        rowId: e.range.getRow(),
        rows: e.range.getNumRows(),
        column: e.range.getColumn(),
        columns: e.range.getNumColumns(),
        range: e.range,
        oldValue: e.oldValue,
        newValue: e.value
      };

      var rowId = obj.rowId,
          rows = obj.rows,
          columns = obj.columns;

      var isOneCell = rows === 1 && columns === 1;
      var isHeadersRow = rowId < this.firstRow;

      if (!isOneCell || isHeadersRow) {
        return;
      }

      Logger.log('Cell %s %s edited', rowId, obj.column);
    }
  }]);

  return PartTypesTab;
}(SheetWrapper);