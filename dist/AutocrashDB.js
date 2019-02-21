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

    // загружаем разрешения
    var _load = new Options().load('firebase_credentials'),
        client_email = _load.client_email,
        private_key = _load.private_key,
        project_id = _load.project_id;

    // доступ к базе данных


    this.db = new Firestore(client_email, private_key.replace(/\\n/g, '\n'), project_id);

    // для работы с путями, возможно будет отдельным классом
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

  /**
   * Создание документа
   * @param {*} key ключ сообщения
   * @param {*} data { coll_path }, которая содержит путь к коллекции
   */


  _createClass(AutocrashDB, [{
    key: 'create',
    value: function create(key, data) {
      Logger.log('create() - key: %s, data: %s', key, data);

      switch (key) {
        case Tasks.CREATE_DOC:
          var coll_path = data.coll_path;

          try {
            // REST API метод
            var result = firestore.updateDocument(coll_path, content);
            Logger.log('result: %s', result);
          } catch (error) {
            console.log(error);
          }
          // succes
          return true;

        default:
          throw 'Ошибка - Неверный идендификатор ключа. AutocrashDB, create()';
      }
    }

    /**
     * Запрос всех документов в коллекции
     * @param {*} key ключ сообщения
     * @param {*} data { coll_path }, где:
     * - coll_path это путь к коллекции
     */

  }, {
    key: 'read',
    value: function read(key, data) {
      Logger.log('AutocrashDB.read(). key: %s, data: %s', key, data);

      switch (key) {

        case Tasks.READ_ALL_DOCS:
          var coll_path = data.coll_path;

          try {
            // REST API метод
            var result = this.db.getDocuments(coll_path);
            Logger.log('result: %s', result);

            // подготавливаем структуру для записи в таблицу
            var sheetData = result.map(function (items) {
              return items.fields;
            });

            new Task(Tasks.UPDATE_SHEET, sheetData);
          } catch (error) {
            console.log(error);
          }
          // success
          return true;

        default:
          return false;
      }
    }

    /**
     * Обновление документа
     * @param {String} key Ключ сообщения
     * @param {Object} data { full_path, content }, где:
     * - full_path это полный путь к документу
     * - content это список ключ-значение, которые надо обновить в док-те
     */

  }, {
    key: 'update',
    value: function update(key, data) {
      Logger.log('update() - key: %s, data: %s', key, data);

      switch (key) {
        case Tasks.UPDATE_DOC:
          var full_path = data.full_path,
              _content = data.content;

          // извлекаем частичный путь, от корневой коллекции текущей базы данных

          var path = this.path.fromRoot(full_path);

          try {
            // REST API метод
            var result = firestore.updateDocument(path, _content);
            Logger.log('result: %s', result);
          } catch (error) {
            console.log(error);
          }

          // success
          return true;

        default:
          throw 'Неверный идендификатор ключа. AutocrashDB, update()';
      }
    }
  }, {
    key: 'remove',


    /**
     * Удаление документа
     * @param {*} key Ключ сообщения
     * @param {*} data { full_path }, где:
     * - full_path это полный путь к документу
     */
    value: function remove(key, data) {
      Logger.log('remove() - key: %s, data: %s', key, data);

      switch (key) {
        case Tasks.DELETE_DOC:
          var full_path = data.full_path;

          var path = this.path.fromRoot(full_path);

          try {
            var result = firestore.deleteDocument(path);
            Logger.log('result: %s', result);
          } catch (error) {
            console.log(error);
          }

          // success
          return true;

        default:
          throw 'Неверный идендификатор ключа. AutocrashDB, remove()';
      }
    }
  }, {
    key: 'query',


    /**
     * Запрос
     * @param {*} key ключ сообщения
     * @param {*} data данные
     */
    value: function query(key, data) {}
  }]);

  return AutocrashDB;
}();