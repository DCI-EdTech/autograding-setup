#!/usr/bin/env node
const {exec} = require('child_process');
const fse = require('fs-extra');
const path = require('path');

const root = path.resolve('./');
const orig = __dirname;
const templateDir = path.resolve(orig, 'template');
const packageJsonPath = path.resolve(root, 'package.json');
const packageJson = require(packageJsonPath);

console.log('Setup autograding');

function insertTemplateFiles() {
  console.log('Inserting autograding files');
  fse.copySync(templateDir, root);
  // .gitignore needs to be generated because of a bug in npm v7 https://github.com/npm/cli/issues/2144
  fse.writeFileSync(path.resolve(root, '.gitignore'), 'node_modules\n.vscode\n.eslintcache');
}

function generateAutogradingJSON() {
  // read test folder contents  
  const testDir = path.resolve(root, '__tests__');
  const testFiles = fse.readdirSync(testDir);
  console.log('files', testFiles);
  // filer autograding test files
  const autogradingTests = testFiles.reduce((acc, file) => {
    const taskName = path.basename(file).match(/^tasks\.(.*)\.js$/)[0];
    if(taskName) acc.push({
      "name": `Task ${taskName}`,
      "setup": "npm install --ignore-scripts",
      "run": `npm test -- ${file}`,
      "timeout": 10,
      "points": 10
    })
    //return acc;
  }, [])
  console.log('tests', autogradingTests)
  const autogradingJSON = {
    tests: autogradingTests
  };
  fse.outputFile(path.resolve(root, '.github/classroom', 'autograding.json'), JSON.stringify(autogradingJSON, null, 2));
}

insertTemplateFiles();
generateAutogradingJSON();

Object.assign(packageJson.scripts, {
  "test": "jest",
  "test:watch": "jest --watch",
  "prepare": "husky install"
});

Object.assign(packageJson, {
  "devDependencies": {},
  "jest": {
    "testEnvironment": "node",
    "coveragePathIgnorePatterns": [
      "/node_modules/"
    ],
    "verbose": true
  },
  "eslintConfig": {
    "env": {
      "es6": true,
      "node": true
    },
    "extends": "airbnb-base",
    "parserOptions": {
      "ecmaVersion": 6
    },
    "rules": {
      "no-console": "off",
      "eol-last": "off",
      "prefer-template": "off"
    }
  },
  "eslintIgnore": [
    "__tests__/*.js",
    "jest.config.js"
  ],
  "lint-staged": {
    "*.js": [
      "npx eslint --cache"
    ]
  }
});

Object.assign(packageJson.devDependencies, {
  "eslint": "^7.32.0",
  "eslint-config-airbnb-base": "^14.2.1",
  "eslint-plugin-import": "^2.24.1",
  "eslint-plugin-node": "^11.1.0",
  "eslint-plugin-promise": "^5.1.0",
  "husky": "^7.0.1",
  "jest": "^26.6.3",
  "lint-staged": "^11.1.2",
  "rewire": "^5.0.0"
});

fse.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

exec('git add .')

console.log('autograding pre-setup done')
process.exit();