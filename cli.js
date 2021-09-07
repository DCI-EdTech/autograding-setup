#!/usr/bin/env node
const { exec } = require('child_process');
const fse = require('fs-extra');
const path = require('path');

const { root, orig }                = require('./lib/refs')
const argv                          = require(path.resolve(orig, 'lib/yargs'))
const templateDir                   = path.resolve(orig, 'template');
const packageJsonPath               = path.resolve(root, 'package.json');
const readmePath                    = path.resolve(root, 'README.md');
const autogradingReadmePath         = path.resolve(orig, 'AUTOGRADING.md');
const packageJson                   = require(packageJsonPath);
const { modifyReadme }              = require(path.resolve(orig, 'scripts/modifyReadme'))
const { generateAutogradingJSON }   = require(path.resolve(orig, 'scripts/generateAutogradingJSON'))
const { insertTemplateFiles }       = require(path.resolve(orig, 'scripts/insertTemplateFiles'))
const testsDir                      = path.resolve(root, '__tests__');
const autogradingJSONPath           = path.resolve(root, '.github/classroom', 'autograding.json');
const devMode                       = argv.dev;
const gitIgnoreTargetPath           = path.resolve(root, '.gitignore');
const gitignore                     = ['node_modules', '.vscode', '.eslintcache'];

console.log('Setup autograding');
if(devMode) console.log('DEV mode')

function modifyPackageJson() {
  const  originalPackageJson = JSON.parse(JSON.stringify(packageJson))
  Object.assign(packageJson.scripts, {
    "test": "jest",
    "test:watch": "jest --watch",
    "prepare": "npx husky install"
  });

  // if devMode set up script to restore original packageJson
  if(devMode) {
    Object.assign(packageJson.scripts, {
      "postinstall": `echo '${JSON.stringify(originalPackageJson, null, 2)}' > 'package.json'`,
      "prepare": ""
    });
  }
  
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
}

insertTemplateFiles(templateDir, gitignore, gitIgnoreTargetPath);
modifyPackageJson();
if(!devMode) {
  generateAutogradingJSON(testsDir, autogradingJSONPath);
  modifyReadme(readmePath, autogradingReadmePath);
  exec('git add . && git commit -m "added autograding setup"')
}

console.log('autograding pre-setup done')
process.exit();