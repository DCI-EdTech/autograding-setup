#!/usr/bin/env node
const { exec } = require('child_process');
const path = require('path');

const { root, orig }                = require('./lib/refs')
const argv                          = require(path.resolve(orig, 'lib/yargs'))
const templateDir                   = path.resolve(orig, 'template');
const packageJsonPath               = path.resolve(root, 'package.json');
const readmePath                    = path.resolve(root, 'README.md');
const autogradingReadmePath         = path.resolve(orig, 'AUTOGRADING.md');
const { modifyReadme }              = require(path.resolve(orig, 'scripts/modifyReadme'))
const { generateAutogradingJSON }   = require(path.resolve(orig, 'scripts/generateAutogradingJSON'))
const { insertTemplateFiles }       = require(path.resolve(orig, 'scripts/insertTemplateFiles'))
const { modifyPackageJson }         = require(path.resolve(orig, 'scripts/modifyPackageJson'))
const testsDir                      = path.resolve(root, '__tests__');
const autogradingJSONPath           = path.resolve(root, '.github/classroom', 'autograding.json');
const devMode                       = argv.dev;
const gitIgnoreTargetPath           = path.resolve(root, '.gitignore');
const gitignore                     = ['node_modules', '.vscode', '.eslintcache'];

console.log('Setup autograding');
if(devMode) console.log('DEV mode')

insertTemplateFiles(templateDir, gitignore, gitIgnoreTargetPath);
modifyPackageJson(packageJsonPath);
if(!devMode) {
  generateAutogradingJSON(testsDir, autogradingJSONPath);
  modifyReadme(readmePath, autogradingReadmePath);
  exec('git add . && git commit -m "added autograding setup"')
}

console.log('autograding pre-setup done')
process.exit();