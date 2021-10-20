const fse = require('fs-extra');
const argv = require('../lib/yargs');
const devMode = argv.dev;
const { root } = require('../lib/refs')

exports.insertTemplateFiles = async function(templateDir, ignoreList, outputPath) {
  console.log('Inserting autograding files');
  if(!devMode) await fse.copy(templateDir, root);
  // .gitignore needs to be generated because of a bug in npm v7 https://github.com/npm/cli/issues/2144
  if(devMode) ignoreList.push('.gitignore', 'package-lock.json')
  await fse.writeFile(outputPath, ignoreList.join('\n'));
  // wait for the file to be written
  await new Promise(resolve => setTimeout(resolve, 100));
}