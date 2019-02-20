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
class Options {
  constructor(propsAPI) {
    this.propsAPI = propsAPI || PropertiesService.getDocumentProperties();

    this.configuration = {
      firebase_credentials: {
        title: 'Настройка доступа к Firebase',
        prompt: 'Приготовьте client_email, project_id и private_key для доступа к Firebase. Готовы начать?',
        query: [
          {
            key: 'client_email',
            propName: 'FIREBASE_CREDENTIALS_CLIENT_EMAIL',
            prompt: 'client_email',
            errorText: 'Ошибка - неверный email',
            isValid: (email) => /^\w+[\w-\.]*\@\w+(([-\w]+)|(\w*))(\.[a-z]{2,20}){1,3}$/.test(email),
          },
          {
            key: 'project_id',
            propName: 'FIREBASE_CREDENTIALS_PROJECT_ID',
            prompt: 'project_id',
            errorText: 'Ошибка - неверный project_id',
            isValid: (project_id) => /^[\w-]+$/.test(project_id),            
          },
          {
            key: 'private_key',
            propName: 'FIREBASE_CREDENTIALS_PRIVATE_KEY',
            prompt: 'private_key',
            errorText: 'Ошибка - неверный private_key',
            isValid: (private_key) => /^[\S ]+$/.test(private_key),            
          }          
        ],
      },
    }    
  }

  // Validate data collections by isValid function from each query item
  // data - { key1: value1, key2: value2 }
  // query - see structure in top of this module
  // Return: true or false;
  isValidAll(data, query) {
    if (!data || typeof(data) !== 'object') {
      return false;
    }
    return query.every( ({key, isValid }) => isValid(data[key]) );
  };

  // Get data from storage, by query structure
  // Return structure like { key1: value1, key2: value2 }
  // No validate;
  getData(query) {
    const { propsAPI } = this;
    return query.reduce((result, item) => {
      const { key, propName } = item;
      const value = propsAPI.getProperty(propName);
      return ({ ...result, [key]: value });
    }, {});
  };

  // Store data to storage by query
  setData(data, query) {
    const { propsAPI } = this;
    query.forEach((item) => {
      const { key, propName } = item;
      const value = data[key];
      propsAPI.setProperty(propName, value);
    });
  };

  eraseData(query) {
    const { propsAPI } = this;
    query.forEach(item => propsAPI.deleteProperty(item.propName));
  };

  // Common flow to get options data - try to get from storage,
  // if nothing, ask from user
  load(name) {
    const { query } = this.configuration[name];

    // try get data from storage
    const data = this.getData(query);

    // validate
    if (this.isValidAll(data, query)) {
      return data;
    };

    this.setup(name)
  };


  setup(name, ui = SpreadsheetApp.getUi()) {
    const { title, prompt, query } = this.configuration[name];

    // Ask from user if he want to start dialog
    const buttons = ui.ButtonSet.YES_NO;
    const isUserWantToStart = ui.alert(title, prompt, buttons) === ui.Button.YES;

    if (!isUserWantToStart) {
      return null;
    }

    // ask from user for every item from query
    // and save in specified key to response object
    const answers = query.reduce((response, item) => {
      const { key, prompt, isValid, errorText } = item;
      const answer = this.showPrompt(title, prompt, isValid, errorText, ui);
      return ({ ...response, [key]: answer });
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
  };

  // Show prompt to user, with answer validation
  showPrompt(title, prompt, isValid, errorText, ui = SpreadsheetApp.getUi()) {
    const buttons = ui.ButtonSet.OK_CANCEL;
    const response = ui.prompt(title, prompt, buttons);
    
    const isUserCancel = response.getSelectedButton() !== ui.Button.OK;
    if (isUserCancel) {
      return null;
    }

    const answer = response.getResponseText();

    if (!isValid(answer)) {
      ui.alert(errorText);
      return this.showPrompt(title, prompt, isValid, errorText, ui); // next retry (recursive)
    }
    return answer;
  }; 
}



// *************** TESTS ********************************
function test_isValidAll() {
  const query = [
    {
      key: 'answer1',
      propName: 'no need',
      prompt: 'How is 2 + 2',
      errorText: 'You aren\'t right, try again',
      isValid: (value) => parseInt(value) === 4,
    },
    {
      key: 'answer2',
      propName: 'no need',
      prompt: 'How is 2 + 2 * 2',
      errorText: 'You aren\'t right, try again',
      isValid: (value) => parseInt(value) === 6,
    },
    {
      key: 'answer3',
      propName: 'no need',
      prompt: 'How is sqrt(144)',
      errorText: 'You aren\'t right, try again',
      isValid: (value) => parseInt(value) === 12,
    }    
  ];

  const options = new Options();

  (() => {
    Logger.log('test_isValidAll. #1');
    const data = null;
    const result = options.isValidAll(data, query);
    Logger.log('Must be false: %s', result);
  })();
  (() => {
    Logger.log('test_isValidAll. #2');
    const data = { 'answer1': 4, 'answer3': 12 };
    const result = options.isValidAll(data, query);
    Logger.log('Must be false: %s', result);
  })();
  (() => {
    Logger.log('test_isValidAll. #3');
    const data = { 'answer1': 4, 'answer2': 0, 'answer3': 12 };
    const result = options.isValidAll(data, query);
    Logger.log('Must be false: %s', result);
  })();
  (() => {
    Logger.log('test_isValidAll. #4');
    const data = { 'answer1': 4, 'answer2': 6, 'answer3': 12 };
    const result = options.isValidAll(data, query);
    Logger.log('Must be true: %s', result);
  })();
  (() => {
    Logger.log('test_isValidAll. #5');
    const data = { 'answer1': 4, 'answer2': 6, 'answer3': 12, 'answer4': 12345 };
    const result = options.isValidAll(data, query);
    Logger.log('Must be true: %s', result);
  })();    
}

function test_setData_getData() {
  const query = [
    {
      key: 'answer1',
      propName: 'answer1',
      prompt: 'How is 2 + 2',
      errorText: 'You aren\'t right, try again',
      isValid: (value) => parseInt(value) === 4,
    },
    {
      key: 'answer2',
      propName: 'answer2',
      prompt: 'How is 2 + 2 * 2',
      errorText: 'You aren\'t right, try again',
      isValid: (value) => parseInt(value) === 6,
    },
    {
      key: 'answer3',
      propName: 'answer3',
      prompt: 'How is sqrt(144)',
      errorText: 'You aren\'t right, try again',
      isValid: (value) => parseInt(value) === 12,
    }    
  ];

  const data = { 'answer1': 4, 'answer2': 6, 'answer3': 12 };

  (() => {
    Logger.log('prepare to test: erase props from storage');
    const options = new Options();
    options.eraseData(query);
  })();
  (() => {
    Logger.log('test_setData_getData #1: setData');
    const options = new Options();
    options.setData(data, query);
  })();
  (() => {
    Logger.log('test_setData_getData #2: getData');
    const options = new Options();
    const newData = options.getData(query);
    const isObjEqual = Object.keys(newData).every(key => data[key] == newData[key]);
    Logger.log('is saved data equal to source data? %s', isObjEqual);
  })();
  (() => {
    Logger.log('cleaning after test: erase props from storage');
    const options = new Options();
    options.eraseData(query);
  })();  
}

function test_getFolderSettings() {
  const options = new Options();
  const { propsAPI } = options;

  // previous values
  Logger.log(propsAPI.getProperty('HOME_FOLDER_URL'));
  Logger.log(propsAPI.getProperty('ORDERCARDS_FOLDER_URL'));

  // prepare
  propsAPI.deleteProperty('HOME_FOLDER_URL');
  propsAPI.deleteProperty('ORDERCARDS_FOLDER_URL');

  // Must ask from user
  const result = options.load('folders_setting');
  Logger.log('Must ask from user before output: %s', result);  

  // If user input all right, must be saved props
  const home_folder_url = propsAPI.getProperty('HOME_FOLDER_URL');
  const ordercards_folder_url = propsAPI.getProperty('ORDERCARDS_FOLDER_URL');

  if (home_folder_url && ordercards_folder_url) {
    Logger.log('Props saved');
  } else {
    Logger.log('Props NOT saved');
    return;
  }

  Logger.log('Second time is saved output: %s', options.load('folders_setting'));  
}

function test_load() {
  const options = new Options();
  const result = options.load('folders_setting');
  Logger.log(result);
}
