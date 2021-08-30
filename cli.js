#!/usr/bin/env node
const {exec} = require('child_process');
const fs = require('fs');
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
  const gitignorePath = path.resolve(templateDir, '.gitignore');
  fse.copySync(templateDir, root);
  fse.copySync(gitignorePath, path.resolve(root, '.gitignore'));
}
// gitignore is not inserted

insertTemplateFiles();

Object.assign(packageJson.scripts, {
  "test": "jest",
  "test:watch": "jest --watch",
  "prepare": "husky install"
});

fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

console.log('autograding pre-setup done')
process.exit();