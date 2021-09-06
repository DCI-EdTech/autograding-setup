const path = require('path');
const { modifyReadme } = require('../scripts/modifyReadme')

describe('Modify README', () => {
  test('function should run', () => {
    modifyReadme(path.resolve('__tests__/TEST_README.md'), 'AUTOGRADING.md');
  })
})