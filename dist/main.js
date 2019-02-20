'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function onOpen(e) {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Phoenix').addItem('Обновить', 'serviceRead').addItem('Добавить', 'serviceCreate').addItem('Удалить', 'serviceDelete').addSeparator().addItem('Показать настройки доступа', 'serviceShowCredentials').addItem('Сброс настроек доступа', 'serviceResetCredentials').addToUi();
}

function onEditInstall(e) {
  new PartTypesTab().onEdit(e);
}

function serviceShowCredentials() {
  var options = new Options();
  var firebase_credentials = options.load('firebase_credentials');
  var client_email = firebase_credentials.client_email,
      project_id = firebase_credentials.project_id,
      private_key = firebase_credentials.private_key;


  var prompt = 'client_email: ' + client_email + '\n\n  project_id: ' + project_id + '\n\n  private_key: \n' + private_key;

  SpreadsheetApp.getUi().alert(prompt);
}

function serviceResetCredentials() {
  new Options().setup('firebase_credentials');
}

function serviceRead() {
  // TODO:
  // get this from properties service
  var credentials = {
    "type": "service_account",
    "project_id": "autocrash-y19",
    "private_key_id": "90e71f6f4341f3dbd88f323a3e2e3bdf5801a82c",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQC4F6B/TUHYatGJ\nI+qFhyReSBnmBbPMkyY/CHHxYotHD3uHg8LxHWGtv4KUivtRzBsoq6OdXConO5Ox\nPgWAshdpp42YS7FGqLCljCk8TxL6zRJePaMtE1bf5z6sXnlLAmwz2Recs64mqmsC\nR7FU7eMoBgVx3nXGM6M9n8sEB1tYAut3ZrWSuSdKvmrZLh7V/dEmWOMHlaRlVTB6\ntXeZMyuuKUZI9p3YSBv47lEsznI2hCtTw8zlgAuqvjAn8UGgDFv5KJB8ydUYhFGk\na4jf/7jl8N3ZoIldvxXQOJg0gEJ2ev6ouu94yRIRtNCREtdCUWURkzoVK1j0xRqW\nXuGCfQdZAgMBAAECggEAGlUy3ZLRBOJ+t4W+Mbx7jMr2fWs6ZVx1H5YXKmakspT5\n4BAObgv8YWygApyAx5oRFne6zzMUSolgnn1XLyoKZFAV1n+ZS5isr/mFGn3bIqn7\n4yQg970o850x31kiM4MUtDPtBzrCggBljy1vJc1jbWGzHK8sHJ5dTt7RHPHqdIO0\nErg78UtxkqbFZhy5AjGHgmRxqx0897mi6+XmJi72Y9mCXtwL0OjGWFhsNm05MMC9\nMv4jt8aY+0RmY7mVb9eirlENDpF8qXLiwtIZWpjHo5zCKJ1YUcfkYpZqM13Pzu83\n44Ohg+1am7617nHJxlUnZYRZuIdoAUinUhmGIc/GaQKBgQDsbb27V7L1/Azjr4yr\nBTRlBLOsLzflnkXU85VhR/BwLL+rm2dE8ZfjWgygSw2yDaNYefYPit1s7VP9woZp\nxWYTJONlayh7JZH2SOwF08+g1uZGuaTw7prl6GxfSxNKKy0x9GdEfM97PqHn2BZb\nElZD5dYsWLGZy9OY/vd+L3jNpQKBgQDHVM260gAQx+QkZ+5LTmc0A+92nyiBfEma\nDIDML/EUQxWgLyOnI96m1TsqF9MjsszA464R9PjdolsQWmm0mfDjv91cH+lGUPQg\nTEcTLK5OQTIOi/x/mA6KeTEQNwx1TdRFCAMUsUN057XIlyHBNJWXeoeCdFZzNfqK\n14qN9O3MpQKBgFuBed6Jad1kyURSTHpgkE/MyxGIUPURFev+vsEhC8EOwLxVcFmx\nu9ylnJ9pjQpt1tvGkGKhl2OyU0Cyyj0jxocATvaQy+ElwGF3BcqXmROiOQwEi/8o\nClGTbGZRc0zQezSLaHCMce08Z4OJEdX7ueGbkhIl3c8toV7kx7tR+kp1AoGAD1m5\nijSX6rLqH9+dG1GLYxcWfuUc4nPm2yUxWggrIatU5AQdU8bQY7qyFrjE+s/PMt+V\nzS43aCITrzu3PkBIq9Ffw7N1bIPZeQ9GvfRH7CDbMQGYzV6xZ/qTS7NhkzsOKM7I\nJfTMxBkAB9WTtOROzN6TxvkcmzzB8aVNt0bwdT0CgYBgpXPwCACvx9hjvVunKMsl\nWXAnlytaKS/wgX6QosvQaImp/jQNsv+pJ/I4vpYmpiHz9aYJQO8UNfdX/DFIEqjA\nbof99s2Q9dnhAycZ+Q8YDVorX/3eYigLc6l5rfTXuYGrUjiMmdQzn0jL7TurGp1Q\nUiQVBT5ck2U3RSqSMpHtaA==\n-----END PRIVATE KEY-----\n",
    "client_email": "phoenix-configeditor@autocrash-y19.iam.gserviceaccount.com",
    "client_id": "100733862697916701409",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/phoenix-configeditor%40autocrash-y19.iam.gserviceaccount.com"
  };

  var email = credentials.client_email,
      key = credentials.private_key,
      projectId = credentials.project_id;


  var firestore = new Firestore(email, key, projectId);

  var coll = 'PartTypes';

  var partTypesRaw = firestore.getDocuments(coll);

  var partTypes = partTypesRaw.map(function (_ref) {
    var document_path = _ref.name,
        fields = _ref.fields;

    return _extends({
      document_path: document_path
    }, fields);
  });

  var partTypesTab = new PartTypesTab();

  var result = partTypesTab.updateSheet(partTypes);

  Logger.log(result);
}

function serviceCreate() {
  // TODO:
  // get this from properties service
  var credentials = {
    "type": "service_account",
    "project_id": "autocrash-y19",
    "private_key_id": "90e71f6f4341f3dbd88f323a3e2e3bdf5801a82c",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQC4F6B/TUHYatGJ\nI+qFhyReSBnmBbPMkyY/CHHxYotHD3uHg8LxHWGtv4KUivtRzBsoq6OdXConO5Ox\nPgWAshdpp42YS7FGqLCljCk8TxL6zRJePaMtE1bf5z6sXnlLAmwz2Recs64mqmsC\nR7FU7eMoBgVx3nXGM6M9n8sEB1tYAut3ZrWSuSdKvmrZLh7V/dEmWOMHlaRlVTB6\ntXeZMyuuKUZI9p3YSBv47lEsznI2hCtTw8zlgAuqvjAn8UGgDFv5KJB8ydUYhFGk\na4jf/7jl8N3ZoIldvxXQOJg0gEJ2ev6ouu94yRIRtNCREtdCUWURkzoVK1j0xRqW\nXuGCfQdZAgMBAAECggEAGlUy3ZLRBOJ+t4W+Mbx7jMr2fWs6ZVx1H5YXKmakspT5\n4BAObgv8YWygApyAx5oRFne6zzMUSolgnn1XLyoKZFAV1n+ZS5isr/mFGn3bIqn7\n4yQg970o850x31kiM4MUtDPtBzrCggBljy1vJc1jbWGzHK8sHJ5dTt7RHPHqdIO0\nErg78UtxkqbFZhy5AjGHgmRxqx0897mi6+XmJi72Y9mCXtwL0OjGWFhsNm05MMC9\nMv4jt8aY+0RmY7mVb9eirlENDpF8qXLiwtIZWpjHo5zCKJ1YUcfkYpZqM13Pzu83\n44Ohg+1am7617nHJxlUnZYRZuIdoAUinUhmGIc/GaQKBgQDsbb27V7L1/Azjr4yr\nBTRlBLOsLzflnkXU85VhR/BwLL+rm2dE8ZfjWgygSw2yDaNYefYPit1s7VP9woZp\nxWYTJONlayh7JZH2SOwF08+g1uZGuaTw7prl6GxfSxNKKy0x9GdEfM97PqHn2BZb\nElZD5dYsWLGZy9OY/vd+L3jNpQKBgQDHVM260gAQx+QkZ+5LTmc0A+92nyiBfEma\nDIDML/EUQxWgLyOnI96m1TsqF9MjsszA464R9PjdolsQWmm0mfDjv91cH+lGUPQg\nTEcTLK5OQTIOi/x/mA6KeTEQNwx1TdRFCAMUsUN057XIlyHBNJWXeoeCdFZzNfqK\n14qN9O3MpQKBgFuBed6Jad1kyURSTHpgkE/MyxGIUPURFev+vsEhC8EOwLxVcFmx\nu9ylnJ9pjQpt1tvGkGKhl2OyU0Cyyj0jxocATvaQy+ElwGF3BcqXmROiOQwEi/8o\nClGTbGZRc0zQezSLaHCMce08Z4OJEdX7ueGbkhIl3c8toV7kx7tR+kp1AoGAD1m5\nijSX6rLqH9+dG1GLYxcWfuUc4nPm2yUxWggrIatU5AQdU8bQY7qyFrjE+s/PMt+V\nzS43aCITrzu3PkBIq9Ffw7N1bIPZeQ9GvfRH7CDbMQGYzV6xZ/qTS7NhkzsOKM7I\nJfTMxBkAB9WTtOROzN6TxvkcmzzB8aVNt0bwdT0CgYBgpXPwCACvx9hjvVunKMsl\nWXAnlytaKS/wgX6QosvQaImp/jQNsv+pJ/I4vpYmpiHz9aYJQO8UNfdX/DFIEqjA\nbof99s2Q9dnhAycZ+Q8YDVorX/3eYigLc6l5rfTXuYGrUjiMmdQzn0jL7TurGp1Q\nUiQVBT5ck2U3RSqSMpHtaA==\n-----END PRIVATE KEY-----\n",
    "client_email": "phoenix-configeditor@autocrash-y19.iam.gserviceaccount.com",
    "client_id": "100733862697916701409",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/phoenix-configeditor%40autocrash-y19.iam.gserviceaccount.com"
  };

  var email = credentials.client_email,
      key = credentials.private_key,
      projectId = credentials.project_id;


  var firestore = new Firestore(email, key, projectId);

  var coll = 'PartTypes';

  var template = {
    class: 'NEW_CLASS',
    type: 'NEW_TYPE',
    sub_type: 'NEW_SUB_TYPE',
    name: 'Новое имя'
  };

  var result = firestore.createDocument(coll, template);

  Logger.log(result);

  serviceRead();
  // const partTypesTab = new PartTypesTab();

  // partTypesTab.updateSheet(partTypes);
}

/**
 * 
 * @param {Number} rowId Номер строки в таблице
 */
function service_edit(rowId) {
  // TODO:
  // get this from properties service

  var credentials = {
    "type": "service_account",
    "project_id": "autocrash-y19",
    "private_key_id": "90e71f6f4341f3dbd88f323a3e2e3bdf5801a82c",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQC4F6B/TUHYatGJ\nI+qFhyReSBnmBbPMkyY/CHHxYotHD3uHg8LxHWGtv4KUivtRzBsoq6OdXConO5Ox\nPgWAshdpp42YS7FGqLCljCk8TxL6zRJePaMtE1bf5z6sXnlLAmwz2Recs64mqmsC\nR7FU7eMoBgVx3nXGM6M9n8sEB1tYAut3ZrWSuSdKvmrZLh7V/dEmWOMHlaRlVTB6\ntXeZMyuuKUZI9p3YSBv47lEsznI2hCtTw8zlgAuqvjAn8UGgDFv5KJB8ydUYhFGk\na4jf/7jl8N3ZoIldvxXQOJg0gEJ2ev6ouu94yRIRtNCREtdCUWURkzoVK1j0xRqW\nXuGCfQdZAgMBAAECggEAGlUy3ZLRBOJ+t4W+Mbx7jMr2fWs6ZVx1H5YXKmakspT5\n4BAObgv8YWygApyAx5oRFne6zzMUSolgnn1XLyoKZFAV1n+ZS5isr/mFGn3bIqn7\n4yQg970o850x31kiM4MUtDPtBzrCggBljy1vJc1jbWGzHK8sHJ5dTt7RHPHqdIO0\nErg78UtxkqbFZhy5AjGHgmRxqx0897mi6+XmJi72Y9mCXtwL0OjGWFhsNm05MMC9\nMv4jt8aY+0RmY7mVb9eirlENDpF8qXLiwtIZWpjHo5zCKJ1YUcfkYpZqM13Pzu83\n44Ohg+1am7617nHJxlUnZYRZuIdoAUinUhmGIc/GaQKBgQDsbb27V7L1/Azjr4yr\nBTRlBLOsLzflnkXU85VhR/BwLL+rm2dE8ZfjWgygSw2yDaNYefYPit1s7VP9woZp\nxWYTJONlayh7JZH2SOwF08+g1uZGuaTw7prl6GxfSxNKKy0x9GdEfM97PqHn2BZb\nElZD5dYsWLGZy9OY/vd+L3jNpQKBgQDHVM260gAQx+QkZ+5LTmc0A+92nyiBfEma\nDIDML/EUQxWgLyOnI96m1TsqF9MjsszA464R9PjdolsQWmm0mfDjv91cH+lGUPQg\nTEcTLK5OQTIOi/x/mA6KeTEQNwx1TdRFCAMUsUN057XIlyHBNJWXeoeCdFZzNfqK\n14qN9O3MpQKBgFuBed6Jad1kyURSTHpgkE/MyxGIUPURFev+vsEhC8EOwLxVcFmx\nu9ylnJ9pjQpt1tvGkGKhl2OyU0Cyyj0jxocATvaQy+ElwGF3BcqXmROiOQwEi/8o\nClGTbGZRc0zQezSLaHCMce08Z4OJEdX7ueGbkhIl3c8toV7kx7tR+kp1AoGAD1m5\nijSX6rLqH9+dG1GLYxcWfuUc4nPm2yUxWggrIatU5AQdU8bQY7qyFrjE+s/PMt+V\nzS43aCITrzu3PkBIq9Ffw7N1bIPZeQ9GvfRH7CDbMQGYzV6xZ/qTS7NhkzsOKM7I\nJfTMxBkAB9WTtOROzN6TxvkcmzzB8aVNt0bwdT0CgYBgpXPwCACvx9hjvVunKMsl\nWXAnlytaKS/wgX6QosvQaImp/jQNsv+pJ/I4vpYmpiHz9aYJQO8UNfdX/DFIEqjA\nbof99s2Q9dnhAycZ+Q8YDVorX/3eYigLc6l5rfTXuYGrUjiMmdQzn0jL7TurGp1Q\nUiQVBT5ck2U3RSqSMpHtaA==\n-----END PRIVATE KEY-----\n",
    "client_email": "phoenix-configeditor@autocrash-y19.iam.gserviceaccount.com",
    "client_id": "100733862697916701409",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/phoenix-configeditor%40autocrash-y19.iam.gserviceaccount.com"
  };

  var email = credentials.client_email,
      key = credentials.private_key,
      projectId = credentials.project_id;


  var firestore = new Firestore(email, key, projectId);

  var partTypesTab = new PartTypesTab();

  var rowData = partTypesTab.getRowData(rowId);

  if (!rowData) {
    return;
  }

  var document_path = rowData.document_path,
      className = rowData.class,
      type = rowData.type,
      sub_type = rowData.sub_type,
      name = rowData.name;


  var data = {
    class: className,
    type: type,
    sub_type: sub_type,
    name: name
  };

  var coll = 'PartTypes';
  var doc = document_path.split('/').slice(-1);
  var path = coll + '/' + doc;
  var result = firestore.updateDocument(path, data);

  Logger.log(result);

  // serviceRead();

  // partTypesTab.updateSheet(partTypes);
}

function serviceDelete() {
  // TODO:
  // get this from properties service
  var credentials = {
    "type": "service_account",
    "project_id": "autocrash-y19",
    "private_key_id": "90e71f6f4341f3dbd88f323a3e2e3bdf5801a82c",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQC4F6B/TUHYatGJ\nI+qFhyReSBnmBbPMkyY/CHHxYotHD3uHg8LxHWGtv4KUivtRzBsoq6OdXConO5Ox\nPgWAshdpp42YS7FGqLCljCk8TxL6zRJePaMtE1bf5z6sXnlLAmwz2Recs64mqmsC\nR7FU7eMoBgVx3nXGM6M9n8sEB1tYAut3ZrWSuSdKvmrZLh7V/dEmWOMHlaRlVTB6\ntXeZMyuuKUZI9p3YSBv47lEsznI2hCtTw8zlgAuqvjAn8UGgDFv5KJB8ydUYhFGk\na4jf/7jl8N3ZoIldvxXQOJg0gEJ2ev6ouu94yRIRtNCREtdCUWURkzoVK1j0xRqW\nXuGCfQdZAgMBAAECggEAGlUy3ZLRBOJ+t4W+Mbx7jMr2fWs6ZVx1H5YXKmakspT5\n4BAObgv8YWygApyAx5oRFne6zzMUSolgnn1XLyoKZFAV1n+ZS5isr/mFGn3bIqn7\n4yQg970o850x31kiM4MUtDPtBzrCggBljy1vJc1jbWGzHK8sHJ5dTt7RHPHqdIO0\nErg78UtxkqbFZhy5AjGHgmRxqx0897mi6+XmJi72Y9mCXtwL0OjGWFhsNm05MMC9\nMv4jt8aY+0RmY7mVb9eirlENDpF8qXLiwtIZWpjHo5zCKJ1YUcfkYpZqM13Pzu83\n44Ohg+1am7617nHJxlUnZYRZuIdoAUinUhmGIc/GaQKBgQDsbb27V7L1/Azjr4yr\nBTRlBLOsLzflnkXU85VhR/BwLL+rm2dE8ZfjWgygSw2yDaNYefYPit1s7VP9woZp\nxWYTJONlayh7JZH2SOwF08+g1uZGuaTw7prl6GxfSxNKKy0x9GdEfM97PqHn2BZb\nElZD5dYsWLGZy9OY/vd+L3jNpQKBgQDHVM260gAQx+QkZ+5LTmc0A+92nyiBfEma\nDIDML/EUQxWgLyOnI96m1TsqF9MjsszA464R9PjdolsQWmm0mfDjv91cH+lGUPQg\nTEcTLK5OQTIOi/x/mA6KeTEQNwx1TdRFCAMUsUN057XIlyHBNJWXeoeCdFZzNfqK\n14qN9O3MpQKBgFuBed6Jad1kyURSTHpgkE/MyxGIUPURFev+vsEhC8EOwLxVcFmx\nu9ylnJ9pjQpt1tvGkGKhl2OyU0Cyyj0jxocATvaQy+ElwGF3BcqXmROiOQwEi/8o\nClGTbGZRc0zQezSLaHCMce08Z4OJEdX7ueGbkhIl3c8toV7kx7tR+kp1AoGAD1m5\nijSX6rLqH9+dG1GLYxcWfuUc4nPm2yUxWggrIatU5AQdU8bQY7qyFrjE+s/PMt+V\nzS43aCITrzu3PkBIq9Ffw7N1bIPZeQ9GvfRH7CDbMQGYzV6xZ/qTS7NhkzsOKM7I\nJfTMxBkAB9WTtOROzN6TxvkcmzzB8aVNt0bwdT0CgYBgpXPwCACvx9hjvVunKMsl\nWXAnlytaKS/wgX6QosvQaImp/jQNsv+pJ/I4vpYmpiHz9aYJQO8UNfdX/DFIEqjA\nbof99s2Q9dnhAycZ+Q8YDVorX/3eYigLc6l5rfTXuYGrUjiMmdQzn0jL7TurGp1Q\nUiQVBT5ck2U3RSqSMpHtaA==\n-----END PRIVATE KEY-----\n",
    "client_email": "phoenix-configeditor@autocrash-y19.iam.gserviceaccount.com",
    "client_id": "100733862697916701409",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/phoenix-configeditor%40autocrash-y19.iam.gserviceaccount.com"
  };

  var email = credentials.client_email,
      key = credentials.private_key,
      projectId = credentials.project_id;


  var firestore = new Firestore(email, key, projectId);

  var partTypesTab = new PartTypesTab();

  var rowId = partTypesTab.getSelectedRow();

  if (!rowId) {
    return;
  }

  var rowData = partTypesTab.getRowData(rowId);

  if (!rowData) {
    return;
  }

  var document_path = rowData.document_path;


  var coll = 'PartTypes';
  var doc = document_path.split('/').slice(-1);
  // const result = firestore.deleteDocument(, data);
  var path = coll + '/' + doc;
  var result = firestore.deleteDocument(path);

  Logger.log(result);

  serviceRead();

  // partTypesTab.updateSheet(partTypes);
}