// import { WebService_Test } from '../Tests/WebService_Test';
// import { MessagesProcessing_Test } from '../Tests/MessagesProcessing_Test';

/**
 * @class Входная точка для тестирования
 * Используйте метод doAllTests() для всех тестов, перечисленных в списке 
 * this.tests в конструкторе. Можно так же передать свои тесты в конструктор - это 
 * должны быть классы в котором реализованы методы doTests().
 * Эти методы должны возвращать экземпляр класса TestModule
 */
class Tests {
  /**
   * Список тестов в this.tests
   */
  constructor() {
    this.tests = [
      new WebService_Test(),
    ]
  }

  /**
   * Выполнить тесты
   * @returns строку с результатами теста, вывод строки ложится на вас
   */
  doAllTests() {
    const results = this.tests.map(test => test.doTests());
    
    const output = results.map(r => r.output).join('\n');

    const errors = results.map(r => r.errCount)
    .reduce((acc, errCount) => errCount > 0 ? acc + 1 : acc, 0);

    const total = this.tests.length;

    return '\n'
    + output + '\n'
    + '===================================' + '\n'
    + `${errors === 0 ? 'PASSED' : 'NOT PASSED'} - Tested modules: ${total}, not passed: ${errors}`;
  }
}

