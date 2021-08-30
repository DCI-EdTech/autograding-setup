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
  //fse.copySync(templateDir, root);
  exec(`shopt -s dotglob | rsync -a ${templateDir}/. ${root}`)
}

insertTemplateFiles();

Object.assign(packageJson.scripts, {
  "test": "jest",
  "test:watch": "jest --watch",
  "prepare": "husky install"
});

fse.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

console.log('autograding pre-setup done')
process.exit();