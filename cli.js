#!/usr/bin/env node
const {exec} = require('child_process');
const fse = require('fs-extra');
const path = require('path');

const root = path.resolve('./');
const orig = __dirname;
const templateDir = path.resolve(orig, 'template');

console.log('Setup autograding');

function insertTemplateFiles() {
  console.log('Inserting autograding files');
  fse.copySync(templateDir, root);
}

insertTemplateFiles();

console.log('done')
process.exit();