#!/usr/bin/env node
const { exec } = require('child_process');
const path = require('path');

const { root, orig }                = require('./lib/refs')
const argv                          = require(path.resolve(orig, 'lib/yargs'))
const templateDir                   = path.resolve(orig, 'template');
const packageJsonPath               = path.resolve(root, 'package.json');
const readmePath                    = path.resolve(root, 'README.md');
const { modifyReadme }              = require(path.resolve(orig, 'scripts/modifyReadme'))
const { generateAutogradingJSON }   = require(path.resolve(orig, 'scripts/generateAutogradingJSON'))
const { insertTemplateFiles }       = require(path.resolve(orig, 'scripts/insertTemplateFiles'))
const { modifyPackageJson }         = require(path.resolve(orig, 'scripts/modifyPackageJson'))
const testsDir                      = '__tests__';
const autogradingJSONPath           = path.resolve(root, '.github/classroom', 'autograding.json');
const devMode                       = argv.dev;
const gitIgnoreTargetPath           = path.resolve(root, '.gitignore');
const gitignore                     = ['node_modules', '.vscode', '.eslintcache'];

(async () => {
  console.log('Setup autograding');
  if(devMode) console.log('DEV mode')

  await insertTemplateFiles(templateDir, gitignore, gitIgnoreTargetPath);
  await modifyPackageJson(packageJsonPath);
  await modifyReadme(readmePath);
  if(!devMode) {
    await generateAutogradingJSON(testsDir, autogradingJSONPath, packageJsonPath);
    await exec('git add . && git commit -m "added autograding setup" --no-verify')
  }
  // clear self from npx cache for next run
  await exec(`rm -rf ${__dirname.match(/.*_npx\/[a-zA-Z0-9]*/)[0]}`);

  console.log('autograding pre-setup done')
  process.exit();
})();
