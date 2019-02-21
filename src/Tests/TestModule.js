/**
 * For testing.
 */
class TestModule {
  constructor(moduleName = '') {
    this._moduleName = moduleName;
    this.results = [];
  }

  make(task, fn) {
    try {
      // invoce funciton
      fn();

      this.results = [
        ...this.results,
        {
          task,
          result: 'OK',
          success: true,
        }
      ];

    } catch(e) {
      
      this.results = [
        ...this.results,
        {
          task,
          result: e,
          success: false,
        }
      ];

    }
  }
/**
 * Set module name that testing
 * @param {String} name module name
 */
  moduleName(name) {
    this._moduleName = name;
    return this;
  }

  /**
   * Check, if all keys and values from sample has comparing object.
   * @param {Object} reference Key-value object that used for sample for comparing
   * @returns {Function} that take as argument object for comparing
   */
  compareWith(reference) {
    return  source => {
      const keys = Object.keys(reference);
      const result = keys.map(key => this.isEqualByKey(source, reference, key))
      .reduce((acc, item) => item === true ? item : acc, false);
      return result;
    }
  };

  /**
   * Comparing values by same key in the two objects.
   * Throw exception, if is not equal.
   * @param {String} key Key by which the value will be checked
   * @param {Object} received Object, which compared 
   * @param {Object} expected Object, used as reference
   */
  isEqualByKey(received, expected, key) {
    if (received[key] === expected[key]) {
      return true;
    };

    throw `${key} expected ${expected[key]}, but received ${received[key]}`;
  };

  /**
   * Compare two primitive type values.
   * @param {*} received value, that compared
   * @param {*} expected sample value
   */
  isEqual(received, expected) {
    if (received instanceof Object || expected instanceof Object) {
      throw `only primitive types can be compared`;
    }

    if (received === expected) {
      return true;
    };

    throw `expected ${expected}, but received ${received}`;
  }

  /**
   * Return count of errors
   */
  get errCount() {
    return this.results.filter(item => !item.success).length;
  }

  /**
   * Make formatted text output of test results.
   * Start it at finish tests
   */
  get output() {
    const errors = this.errCount;
    const total = this.results.length;
    const results = this.results.map((item, index) => {
      const { task, success, result } = item;
      if (!success) {
        return `${index + 1}. ${task} - ERROR` + '\n'
        + `> ${result}` + '\n';
      }
      return `${index + 1}. ${task} - ${result}` + '\n';
    }).join('----\n');

    return '\n'
    + `${this._moduleName}:` + '\n'
    + '----' + '\n'
    + results
    + '----' + '\n'
    + `* Total: ${total}, errors:${errors}`;
  }
}