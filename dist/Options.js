'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Class for manipulate PropertiesService API and interaction 
// with user in dialogs to get missing data.
// 
// Query is a key data structure for this class, where:
// 
//       key: key that will return in object from storage or user input, like { 'answer1': 4 }.
//  propName: property name, that will value is saved in storage.
//    prompt: text with question for user for prompt box.
// errorText: text, which user see in alert box, after entering invalid data.
//   isValid: function for validation value which user is entered
// 
// const query = [
//   {
//     key: 'answer1',
//     propName: 'USER_ANSWER_1', // key for properties service
//     prompt: 'How is 2 + 2',
//     errorText: 'You aren\'t right, try again',
//     isValid: (value) => parseInt(value) === 4,
//   },
//   {...},
//   {...},
// ]
var Options = function () {
  function Options(propsAPI) {
    _classCallCheck(this, Options);

    this.propsAPI = propsAPI || PropertiesService.getDocumentProperties();

    this.configuration = {
      firebase_credentials: {
        title: 'Настройка доступа к Firebase',
        prompt: 'Приготовьте client_email, project_id и private_key для доступа к Firebase. Готовы начать?',
        query: [{
          key: 'client_email',
          propName: 'FIREBASE_CREDENTIALS_CLIENT_EMAIL',
          prompt: 'client_email',
          errorText: 'Ошибка - неверный email',
          isValid: function isValid(email) {
            return (/^\w+[\w-\.]*\@\w+(([-\w]+)|(\w*))(\.[a-z]{2,20}){1,3}$/.test(email)
            );
          }
        }, {
          key: 'project_id',
          propName: 'FIREBASE_CREDENTIALS_PROJECT_ID',
          prompt: 'project_id',
          errorText: 'Ошибка - неверный project_id',
          isValid: function isValid(project_id) {
            return (/^[\w-]+$/.test(project_id)
            );
          }
        }, {
          key: 'private_key',
          propName: 'FIREBASE_CREDENTIALS_PRIVATE_KEY',
          prompt: 'private_key',
          errorText: 'Ошибка - неверный private_key',
          isValid: function isValid(private_key) {
            return (/^[\S ]+$/.test(private_key)
            );
          }
        }]
      }
    };
  }

  // Validate data collections by isValid function from each query item
  // data - { key1: value1, key2: value2 }
  // query - see structure in top of this module
  // Return: true or false;


  _createClass(Options, [{
    key: 'isValidAll',
    value: function isValidAll(data, query) {
      if (!data || (typeof data === 'undefined' ? 'undefined' : _typeof(data)) !== 'object') {
        return false;
      }
      return query.every(function (_ref) {
        var key = _ref.key,
            isValid = _ref.isValid;
        return isValid(data[key]);
      });
    }
  }, {
    key: 'getData',


    // Get data from storage, by query structure
    // Return structure like { key1: value1, key2: value2 }
    // No validate;
    value: function getData(query) {
      var propsAPI = this.propsAPI;

      return query.reduce(function (result, item) {
        var key = item.key,
            propName = item.propName;

        var value = propsAPI.getProperty(propName);
        return _extends({}, result, _defineProperty({}, key, value));
      }, {});
    }
  }, {
    key: 'setData',


    // Store data to storage by query
    value: function setData(data, query) {
      var propsAPI = this.propsAPI;

      query.forEach(function (item) {
        var key = item.key,
            propName = item.propName;

        var value = data[key];
        propsAPI.setProperty(propName, value);
      });
    }
  }, {
    key: 'eraseData',
    value: function eraseData(query) {
      var propsAPI = this.propsAPI;

      query.forEach(function (item) {
        return propsAPI.deleteProperty(item.propName);
      });
    }
  }, {
    key: 'load',


    // Common flow to get options data - try to get from storage,
    // if nothing, ask from user
    value: function load(name) {
      var query = this.configuration[name].query;

      // try get data from storage

      var data = this.getData(query);

      // validate
      if (this.isValidAll(data, query)) {
        return data;
      };

      this.setup(name);
    }
  }, {
    key: 'setup',
    value: function setup(name) {
      var _this = this;

      var ui = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : SpreadsheetApp.getUi();
      var _configuration$name = this.configuration[name],
          title = _configuration$name.title,
          prompt = _configuration$name.prompt,
          query = _configuration$name.query;

      // Ask from user if he want to start dialog

      var buttons = ui.ButtonSet.YES_NO;
      var isUserWantToStart = ui.alert(title, prompt, buttons) === ui.Button.YES;

      if (!isUserWantToStart) {
        return null;
      }

      // ask from user for every item from query
      // and save in specified key to response object
      var answers = query.reduce(function (response, item) {
        var key = item.key,
            prompt = item.prompt,
            isValid = item.isValid,
            errorText = item.errorText;

        var answer = _this.showPrompt(title, prompt, isValid, errorText, ui);
        return _extends({}, response, _defineProperty({}, key, answer));
      }, {});

      // validate answers and save
      if (this.isValidAll(answers, query)) {
        this.setData(answers, query);
        SpreadsheetApp.getActiveSpreadsheet().toast('Data saved');
        return answers;
      }

      // if data from all source is invalid
      SpreadsheetApp.getActiveSpreadsheet().toast('Data NOT saved');
      return null;
    }
  }, {
    key: 'showPrompt',


    // Show prompt to user, with answer validation
    value: function showPrompt(title, prompt, isValid, errorText) {
      var ui = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : SpreadsheetApp.getUi();

      var buttons = ui.ButtonSet.OK_CANCEL;
      var response = ui.prompt(title, prompt, buttons);

      var isUserCancel = response.getSelectedButton() !== ui.Button.OK;
      if (isUserCancel) {
        return null;
      }

      var answer = response.getResponseText();

      if (!isValid(answer)) {
        ui.alert(errorText);
        return this.showPrompt(title, prompt, isValid, errorText, ui); // next retry (recursive)
      }
      return answer;
    }
  }]);

  return Options;
}();

// *************** TESTS ********************************


function test_isValidAll() {
  var query = [{
    key: 'answer1',
    propName: 'no need',
    prompt: 'How is 2 + 2',
    errorText: 'You aren\'t right, try again',
    isValid: function isValid(value) {
      return parseInt(value) === 4;
    }
  }, {
    key: 'answer2',
    propName: 'no need',
    prompt: 'How is 2 + 2 * 2',
    errorText: 'You aren\'t right, try again',
    isValid: function isValid(value) {
      return parseInt(value) === 6;
    }
  }, {
    key: 'answer3',
    propName: 'no need',
    prompt: 'How is sqrt(144)',
    errorText: 'You aren\'t right, try again',
    isValid: function isValid(value) {
      return parseInt(value) === 12;
    }
  }];

  var options = new Options();

  (function () {
    Logger.log('test_isValidAll. #1');
    var data = null;
    var result = options.isValidAll(data, query);
    Logger.log('Must be false: %s', result);
  })();
  (function () {
    Logger.log('test_isValidAll. #2');
    var data = { 'answer1': 4, 'answer3': 12 };
    var result = options.isValidAll(data, query);
    Logger.log('Must be false: %s', result);
  })();
  (function () {
    Logger.log('test_isValidAll. #3');
    var data = { 'answer1': 4, 'answer2': 0, 'answer3': 12 };
    var result = options.isValidAll(data, query);
    Logger.log('Must be false: %s', result);
  })();
  (function () {
    Logger.log('test_isValidAll. #4');
    var data = { 'answer1': 4, 'answer2': 6, 'answer3': 12 };
    var result = options.isValidAll(data, query);
    Logger.log('Must be true: %s', result);
  })();
  (function () {
    Logger.log('test_isValidAll. #5');
    var data = { 'answer1': 4, 'answer2': 6, 'answer3': 12, 'answer4': 12345 };
    var result = options.isValidAll(data, query);
    Logger.log('Must be true: %s', result);
  })();
}

function test_setData_getData() {
  var query = [{
    key: 'answer1',
    propName: 'answer1',
    prompt: 'How is 2 + 2',
    errorText: 'You aren\'t right, try again',
    isValid: function isValid(value) {
      return parseInt(value) === 4;
    }
  }, {
    key: 'answer2',
    propName: 'answer2',
    prompt: 'How is 2 + 2 * 2',
    errorText: 'You aren\'t right, try again',
    isValid: function isValid(value) {
      return parseInt(value) === 6;
    }
  }, {
    key: 'answer3',
    propName: 'answer3',
    prompt: 'How is sqrt(144)',
    errorText: 'You aren\'t right, try again',
    isValid: function isValid(value) {
      return parseInt(value) === 12;
    }
  }];

  var data = { 'answer1': 4, 'answer2': 6, 'answer3': 12 };

  (function () {
    Logger.log('prepare to test: erase props from storage');
    var options = new Options();
    options.eraseData(query);
  })();
  (function () {
    Logger.log('test_setData_getData #1: setData');
    var options = new Options();
    options.setData(data, query);
  })();
  (function () {
    Logger.log('test_setData_getData #2: getData');
    var options = new Options();
    var newData = options.getData(query);
    var isObjEqual = Object.keys(newData).every(function (key) {
      return data[key] == newData[key];
    });
    Logger.log('is saved data equal to source data? %s', isObjEqual);
  })();
  (function () {
    Logger.log('cleaning after test: erase props from storage');
    var options = new Options();
    options.eraseData(query);
  })();
}

function test_getFolderSettings() {
  var options = new Options();
  var propsAPI = options.propsAPI;

  // previous values

  Logger.log(propsAPI.getProperty('HOME_FOLDER_URL'));
  Logger.log(propsAPI.getProperty('ORDERCARDS_FOLDER_URL'));

  // prepare
  propsAPI.deleteProperty('HOME_FOLDER_URL');
  propsAPI.deleteProperty('ORDERCARDS_FOLDER_URL');

  // Must ask from user
  var result = options.load('folders_setting');
  Logger.log('Must ask from user before output: %s', result);

  // If user input all right, must be saved props
  var home_folder_url = propsAPI.getProperty('HOME_FOLDER_URL');
  var ordercards_folder_url = propsAPI.getProperty('ORDERCARDS_FOLDER_URL');

  if (home_folder_url && ordercards_folder_url) {
    Logger.log('Props saved');
  } else {
    Logger.log('Props NOT saved');
    return;
  }

  Logger.log('Second time is saved output: %s', options.load('folders_setting'));
}

function test_load() {
  var options = new Options();
  var result = options.load('folders_setting');
  Logger.log(result);
}