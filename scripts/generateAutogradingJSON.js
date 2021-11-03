const fse = require('fs-extra');
const path = require('path');

exports.generateAutogradingJSON = async function(testsDir, outputPath, packageJsonPath) {
  // read test folder contents  
  // if testsDir does not exist, look in src folder
  if (!fse.existsSync(testsDir)) {
    testsDir = path.join('src', testsDir);
  }
  const testFiles = await fse.readdir(testsDir);
  const packageJson = require(packageJsonPath);

  // filer autograding test files
  const autogradingTestFiles = testFiles.reduce((acc, file) => {
    const taskName = path.basename(file).match(/^tasks\.(.*)\.js$/)[1];
    if(taskName) acc.push({taskName, file});
    return acc;
  }, []);
  
  const autogradingTests = autogradingTestFiles.map((item, i, list) => {
    const pointsPerTask = Math.round(100/list.length)
    const additionalSetup = packageJson.autograding && packageJson.autograding.setup
    const testOpts = packageJson.autograding && packageJson.autograding.testOpts
    return {
      "name": `Task ${item.taskName}`,
      "setup": `npm ci --ignore-scripts${additionalSetup ? ' && ' + additionalSetup : ''}`,
      "run": `npm test -- ${testsDir}/${item.file}${testOpts ? ' ' + testOpts : ''}`,
      "timeout": 10,
      "points": i === list.length-1 ? 100 - pointsPerTask * (list.length-1) : pointsPerTask
    }
  })
  const autogradingJSON = {
    tests: autogradingTests
  };
  await fse.outputFile(outputPath, JSON.stringify(autogradingJSON, null, 2));
}