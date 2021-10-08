const fse = require('fs-extra');
const path = require('path');

exports.generateAutogradingJSON = function(testsDir, outputPath) {
  // read test folder contents  
  const testFiles = fse.readdirSync(testsDir)

  // filer autograding test files
  const autogradingTestFiles = testFiles.reduce((acc, file) => {
    const taskName = path.basename(file).match(/^tasks\.(.*)\.js$/)[1];
    if(taskName) acc.push({taskName, file});
    return acc;
  }, []);
  
  const autogradingTests = autogradingTestFiles.map((item, i, list) => {
    const pointsPerTask = Math.round(100/list.length)
    return {
      "name": `Task ${item.taskName}`,
      "setup": "npm install --ignore-scripts",
      "run": `npm test -- ${testsDir}/${item.file}`,
      "timeout": 10,
      "points": i === list.length-1 ? 100 - pointsPerTask * (list.length-1) : pointsPerTask
    }
  })
  const autogradingJSON = {
    tests: autogradingTests
  };
  fse.outputFileSync(outputPath, JSON.stringify(autogradingJSON, null, 2));
}