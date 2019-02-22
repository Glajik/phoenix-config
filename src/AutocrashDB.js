/**
 * @class Класс для базовых операций с базой данных, в качестве которой
 * используется Firestore.
 */
class AutocrashDB {
  // для работы с путями, возможно будет отдельным классом
  path = {
    root: `projects/${this.project_id}/databases/(default)/documents/`,

    /**
     * Разбивает полный путь на компоненты
     * @param {*} full_path полный путь к документу
     */
    getComponents(full_path) {
      const rootElements = this.root.split('/');
      const has = (x, coll) => coll.some(item => item === x);
      
      // удаляем элементы пути, которые есть в корневом пути
      const result = full_path.split('/').filter(item => !has(item, rootElements));
      
      // переворачиваем список
      const [ doc, ...collection ] = result.reverse();
      
      // не забываем перевернуть обратно путь коллекций
      const coll = collection.reverse().join('/');
      return { coll, doc };
    },

    /**
     * возвращает путь к документу, но не от самого начала
     * @param {*} full_path полный путь к документу
     */
    fromRoot(full_path) {
      const { coll, doc } = this.getComponents(full_path);
      return coll + '/' + doc;
    }
  };
  

  /**
   * Создание документа
   * @param {*} key ключ сообщения
   * @param {*} data { coll_path }, которая содержит путь к коллекции
   */
  create(key, data) {
    Logger.log('create() - key: %s, data: %s', key, data);

    switch (key) {
      case Tasks.CREATE_DOC:
        const { coll_path } = data;
        try {
          // REST API метод
          const result = firestore.updateDocument(coll_path, content);
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
  read(key, data) {
    switch (key) {
      
      case Tasks.DB_READ_COLL:
        Logger.log('AutocrashDB.read(%s, %s)', key, data);

        const { coll_path, recipient } = data;

        // REST API метод
        const documents = this.db.getDocuments(coll_path);
        
        // посылаем данные получателю
        new Task(recipient, documents);

        // success
        return true;
    
      default:
        return  false;
    }
  }

  /**
   * Обновление документа
   * @param {String} key Ключ сообщения
   * @param {Object} data { full_path, content }, где:
   * - full_path это полный путь к документу
   * - content это список ключ-значение, которые надо обновить в док-те
   */
  update(key, data) {
    Logger.log('update() - key: %s, data: %s', key, data);

    switch (key) {
      case Tasks.UPDATE_DOC:
        const { full_path, content } = data;
        
        // извлекаем частичный путь, от корневой коллекции текущей базы данных
        const path = this.path.fromRoot(full_path);
        
        try {
          // REST API метод
          const result = firestore.updateDocument(path, content);
          Logger.log('result: %s', result);
        } catch (error) {
          console.log(error);
        }
        
        // success
        return true;
    
      default:
        throw 'Неверный идендификатор ключа. AutocrashDB, update()';
    }
  };

  /**
   * Удаление документа
   * @param {*} key Ключ сообщения
   * @param {*} data { full_path }, где:
   * - full_path это полный путь к документу
   */
  remove(key, data) {
    Logger.log('remove() - key: %s, data: %s', key, data);

    switch (key) {
      case Tasks.DELETE_DOC:
        const { full_path } = data;
        const path = this.path.fromRoot(full_path);

        try {
          const result = firestore.deleteDocument(path);
          Logger.log('result: %s', result);
        } catch (error) {
          console.log(error);
        }

        // success
        return true;
    
      default:
        throw 'Неверный идендификатор ключа. AutocrashDB, remove()';
    }
  };

  /**
   * Запрос
   * @param {*} key ключ сообщения
   * @param {*} data данные
   */
  query(key, data) {

  }

  /**
   * Возвращает объект для работы с базой данных
   */
  get db() {
    if (!this.db_) {
      // загружаем разрешения
      const { client_email, private_key: raw_private_key, project_id } = new Options().load('firebase_credentials');
      this.project_id_ = project_id;
      const private_key = raw_private_key.replace(/\\n/g, '\n');
      // доступ к базе данных
      this.db_ = new Firestore(client_email, private_key, project_id);
    }

    return this.db_;
  };

  /**
   * Немного мудрено, но проще пока не придумал, чтобы при этом не светить private_key
   */
  get project_id() {
    if (!this.project_id_) {
      const { project_id } = new Options().load('firebase_credentials')
      this.project_id_ = project_id;
    }
    return this.project_id_;
  }

  onEvent(key, data) {
    // const CREATE
    const READ = Msg.DB_READ_COLL;
    // const UPDATE
    // const DELETE
    // const QUERY

    switch (key) {
      case READ:
        Logger.log('AutocrashDB.onEvent(%s, %s)', key, data);

        const { coll_path, replyMsg } = data;

        // REST API метод
        const documents = this.db.getDocuments(coll_path);
        
        // посылаем данные получателю
        broadcast(replyMsg, documents);

        // success
        return documents;
    
      default:
        return false;
    }
  }
}