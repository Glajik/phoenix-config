'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PartTypesTab = function (_SheetWrapper) {
  _inherits(PartTypesTab, _SheetWrapper);

  function PartTypesTab() {
    _classCallCheck(this, PartTypesTab);

    var _this = _possibleConstructorReturn(this, (PartTypesTab.__proto__ || Object.getPrototypeOf(PartTypesTab)).call(this, {
      sheetName: 'Типы деталей',
      numHeaders: 1,
      fields: ['full_path', 'classname', 'type', 'subtype', 'label_full']
    }));

    _this.coll_path = 'PartTypes';
    return _this;
  }

  _createClass(PartTypesTab, [{
    key: 'onEdit',


    /**
     * Обработчик события редактирования из таблицы
     * @param {String} key Ключ события
     * @param {onEditEventStructure} data Структура данных
     */
    value: function onEdit(key, data) {
      switch (key) {
        case Tasks.SINGLE_CELL_EDITED:
          var sheetName = data.sheetName;


          if (sheetName !== this.sheetName) {
            return;
          };

          Logger.log('onEdit event on sheet: %s', sheetName);

          var row = data.row,
              column = data.column;


          var isHeadersRow = row < this.firstRow;

          if (isHeadersRow) {
            Logger.log('is header row - exit');
            return;
          }

          Logger.log('cell %s %s edited', row, column);

          // подготавливаем данные для отправки
          var value = data.value;

          var field = this.findColumnFieldName(column);
          var content = _defineProperty({}, field, value);

          // получаем данные из таблицы, указывающие путь к документу

          var _get$call = _get(PartTypesTab.prototype.__proto__ || Object.getPrototypeOf(PartTypesTab.prototype), 'getRowData', this).call(this, row),
              full_path = _get$call.full_path;

          // update document in datapase


          new Task(Tasks.UPDATE_DOC, { full_path: full_path, content: content });
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

  }, {
    key: 'onEvent',
    value: function onEvent(key, data) {
      var ON_REFRESH = composeMsg(Msg.ON_CLICK_REFRESH_SHEET, this.sheetName);
      var ON_DATA = composeMsg(Msg.DB_ON_DATA, this.sheetName);
      var DB_READ = Msg.DB_READ_COLL;

      switch (key) {
        case ON_REFRESH:
          Logger.log('PartTypesTab.onEvent(%s, %s)', key, data);

          broadcast(DB_READ, {
            coll_path: this.coll_path,
            replyMsg: ON_DATA
          });

          return 'success';

        case ON_DATA:
          Logger.log('PartTypesTab.onEvent(%s, %s)', key, data);

          // подготавливаем данные для записи в лист
          var sheetData = data.map(function (items) {
            return items.fields;
          });

          _get(PartTypesTab.prototype.__proto__ || Object.getPrototypeOf(PartTypesTab.prototype), 'updateSheet', this).call(this, sheetData);

          return 'success';

        default:
          return; // ignored
      }
    }
  }]);

  return PartTypesTab;
}(SheetWrapper);