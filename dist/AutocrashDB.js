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

    this.path = {
      root: 'projects/' + this.project_id + '/databases/(default)/documents/',

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
  // для работы с путями, возможно будет отдельным классом


  _createClass(AutocrashDB, [{
    key: 'create',


    /**
     * Создание документа
     * @param {*} key ключ сообщения
     * @param {*} data { coll_path }, которая содержит путь к коллекции
     */
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
     * @param {*} data { coll_pathб sheetName }, где:
     * - coll_path это путь к коллекции
     * - sheetName - получатель данных
     */

  }, {
    key: 'read',
    value: function read(key, data) {
      switch (key) {

        case Tasks.DB_READ_COLL:
          Logger.log('AutocrashDB.read(%s, %s)', key, data);

          var coll_path = data.coll_path,
              recipient = data.recipient;

          // REST API метод

          var documents = this.db.getDocuments(coll_path);

          // посылаем данные получателю
          new Task(recipient, documents);

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

    /**
     * Возвращает объект для работы с базой данных
     */

  }, {
    key: 'onEvent',
    value: function onEvent(key, data) {
      // const CREATE
      var READ = Msg.DB_READ_COLL;
      // const UPDATE
      // const DELETE
      // const QUERY

      switch (key) {
        case READ:
          Logger.log('AutocrashDB.onEvent(%s, %s)', key, data);

          var coll_path = data.coll_path,
              replyMsg = data.replyMsg;

          // REST API метод

          var documents = this.db.getDocuments(coll_path);

          // посылаем данные получателю
          broadcast(replyMsg, documents);

          // success
          return documents;

        default:
          return false;
      }
    }
  }, {
    key: 'db',
    get: function get() {
      if (!this.db_) {
        // загружаем разрешения
        var _load = new Options().load('firebase_credentials'),
            client_email = _load.client_email,
            raw_private_key = _load.private_key,
            project_id = _load.project_id;

        this.project_id_ = project_id;
        var private_key = raw_private_key.replace(/\\n/g, '\n');
        // доступ к базе данных
        this.db_ = new Firestore(client_email, private_key, project_id);
      }

      return this.db_;
    }
  }, {
    key: 'project_id',


    /**
     * Немного мудрено, но проще пока не придумал, чтобы при этом не светить private_key
     */
    get: function get() {
      if (!this.project_id_) {
        var _load2 = new Options().load('firebase_credentials'),
            project_id = _load2.project_id;

        this.project_id_ = project_id;
      }
      return this.project_id_;
    }
  }]);

  return AutocrashDB;
}();