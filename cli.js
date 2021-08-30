#!/usr/bin/env node
const {exec} = require('child_process');
const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');

const root = path.resolve('./');
const orig = __dirname;
const templateDir = path.resolve(orig, 'template');
const packageJson = require(path.resolve(root, 'package.json'));

console.log('Setup autograding');

function insertTemplateFiles() {
  console.log('Inserting autograding files');
  fse.copySync(templateDir, root);
}

insertTemplateFiles();

Object.assign(packageJson.scripts, {
  "test": "jest",
  "test:watch": "jest --watch"
});

console.log('autograding pre-setup done')
process.exit();