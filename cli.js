#!/usr/bin/env node
const {exec} = require('child_process');
const fse = require('fs-extra');
const path = require('path');

const root = path.resolve('./');
const orig = __dirname;
const templateDir = path.resolve(orig, 'template');

console.log('Setup autograding');

console.log('root', root);
console.log('orig', orig);

// install dependencies
exec('npm install');

function insertTemplateFiles() {
  const files = fse.readdirSync(templateDir);
  files.forEach(file => {
    const origFile = path.resolve(templateDir, file);
    const destFile = path.resolve(root, file);
    fse.copySync(origFile, destFile);
  });
}

insertTemplateFiles();