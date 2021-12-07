#!/usr/bin/env node
const util = require('util');
const path = require('path');
const exec = util.promisify(require('child_process').exec);

const { root, orig }                = require('./lib/refs')
const argv                          = require(path.resolve(orig, 'lib/yargs'))
const templateDir                   = path.resolve(orig, 'template');
const packageJsonPath               = path.resolve(root, 'package.json');
const readmePath                    = path.resolve(root, 'README.md');
const { modifyReadme }              = require(path.resolve(orig, 'scripts/modifyReadme'))
const { insertTemplateFiles }       = require(path.resolve(orig, 'scripts/insertTemplateFiles'))
const { modifyPackageJson }         = require(path.resolve(orig, 'scripts/modifyPackageJson'))
const devMode                       = argv.dev;
const gitIgnoreTargetPath           = path.resolve(root, '.gitignore');
const gitignoreTemplatePath         = path.resolve(orig, 'settings/gitignore-template');

(async () => {
  console.log('Setup autograding');
  if(devMode) console.log('DEV mode')

  await modifyPackageJson(packageJsonPath);
  await exec('npm install --ignore-scripts');
  await insertTemplateFiles(templateDir, gitignoreTemplatePath, gitIgnoreTargetPath);
  await modifyReadme(readmePath);
  if(!devMode) {
    await exec('git add . && git commit -m "added autograding setup" --no-verify')
  }
  // clear self from npx cache for next run
  await exec(`rm -rf ${__dirname.match(/.*_npx\/[a-zA-Z0-9]*/)[0]}`);

  console.log('autograding pre-setup done')
  process.exit();
})();
