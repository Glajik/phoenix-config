'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @class Класс для базовых операций с базой данных, в качестве которой
 * используется Firestore.
 */
var AutocrashDB = function () {
  function AutocrashDB() {
    _classCallCheck(this, AutocrashDB);

    this.credentials = new Options().load('firebase_credentials');

    var project_id = this.credentials.project_id;


    this.path = {
      root: 'projects/' + project_id + '/databases/(default)/documents/',

      /**
       * Разбивает полный путь на компоненты
       * @param {*} full_path полный путь к документу
       */
      getComponents: function getComponents(full_path) {
        var rootElements = this.root.split('/');
        var has = function has(x, coll) {
          return coll.some(function (item) {
            return item === x;
          });
        };

        // удаляем элементы пути, которые есть в корневом пути
        var result = full_path.split('/').filter(function (item) {
          return !has(item, rootElements);
        });

        // переворачиваем список

        var _result$reverse = result.reverse(),
            _result$reverse2 = _toArray(_result$reverse),
            doc = _result$reverse2[0],
            collection = _result$reverse2.slice(1);

        // не забываем перевернуть обратно путь коллекций


        var coll = collection.reverse().join('/');
        return { coll: coll, doc: doc };
      },


      /**
       * возвращает путь к документу, но не от самого начала
       * @param {*} full_path полный путь к документу
       */
      fromRoot: function fromRoot(full_path) {
        var _getComponents = this.getComponents(full_path),
            coll = _getComponents.coll,
            doc = _getComponents.doc;

        return coll + '/' + doc;
      }
    };
  }

  _createClass(AutocrashDB, [{
    key: 'create',
    value: function create(key) {
      var _credentials = this.credentials,
          client_email = _credentials.client_email,
          project_id = _credentials.project_id,
          private_key = _credentials.private_key;
    }
  }, {
    key: 'read',
    value: function read() {
      var _credentials2 = this.credentials,
          client_email = _credentials2.client_email,
          project_id = _credentials2.project_id,
          private_key = _credentials2.private_key;
    }

    /**
     * Обновление документа, или всей коллекции, в зависимости от ключа.
     * Если ключ, не верный, ничего не делает, возвращает false
     * @param {String} key Ключ сообщения
     * @param {Object} data Структура данных { coll, doc, content }, где:
     * - field это поле, которое требуется обновить
     * - value это новое значение
     */

  }, {
    key: 'update',
    value: function update(key, data) {
      Logger.log('key: %s, data: %s', key, data);

      switch (key) {
        case 'UPDATE_DOC_BY_PATH':
          var credentials = new Options().load('firebase_credentials');
          var client_email = credentials.client_email,
              project_id = credentials.project_id,
              private_key = credentials.private_key;
          var full_path = data.full_path,
              content = data.content;

          var path = this.path.fromRoot(full_path);
          var firestore = new Firestore(client_email, private_key, project_id);
          var result = firestore.updateDocument(path, content);
          Logger.log('result: %s', result);
          return result;

        default:
          throw 'Ошибка - Неверный идендификатор ключа. AutocrashDB, Update()';
      }
    }
  }, {
    key: 'delete',
    value: function _delete() {
      var _credentials3 = this.credentials,
          client_email = _credentials3.client_email,
          project_id = _credentials3.project_id,
          private_key = _credentials3.private_key;
    }
  }, {
    key: 'extractPath',


    /**
     * Возвращает путь документа от корня базы данных. Например вернет 'PartTypes/ 
     * @param {String} full_path полный путь к документу
     */
    value: function extractPath(full_path) {}
  }]);

  return AutocrashDB;
}();