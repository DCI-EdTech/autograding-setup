const fse = require('fs-extra');
const path = require('path');

exports.generateAutogradingJSON = function(testsDir, outputPath) {
  // read test folder contents  
  const testFiles = fse.readdirSync(testsDir);
  // filer autograding test files
  const autogradingTests = testFiles.reduce((acc, file, i, list) => {
    const taskName = path.basename(file).match(/^tasks\.(.*)\.js$/)[1];
    if(taskName) acc.push({
      "name": `Task ${taskName}`,
      "setup": "npm install --ignore-scripts",
      "run": `npm test -- ${testsDir}/${file}`,
      "timeout": 10,
      "points": 100/list.length
    })
    return acc;
  }, [])
  const autogradingJSON = {
    tests: autogradingTests
  };
  fse.outputFileSync(outputPath, JSON.stringify(autogradingJSON, null, 2));
}