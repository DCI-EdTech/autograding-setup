#!/usr/bin/env node
const {exec} = require('child_process');
const fse = require('fs-extra');
const path = require('path');

console.log('Setup autograding');

const root = path.resolve('./');
console.log('root', root);

// install dependencies
exec('npm install');

// copy files
fse.copySync('./template/testfile', root, { overwrite: true }, function (err) {
  if (err) {                 
    console.error(err);
  } else {
    console.log("copy success!");
  }
});