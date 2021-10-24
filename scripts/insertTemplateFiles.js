const fse = require('fs-extra');
const argv = require('../lib/yargs');
const devMode = argv.dev;
const { root } = require('../lib/refs')

exports.insertTemplateFiles = async function(templateDir, gitignoreTemplatePath, outputPath) {
  console.log('Inserting autograding files');
  if(!devMode) await fse.copy(templateDir, root);
  // .gitignore needs to be generated because of a bug in npm v7 https://github.com/npm/cli/issues/2144
  let gitignoreTemplate =  await fse.readFile(gitignoreTemplatePath, 'utf8')
  await fse.writeFile(outputPath, gitignoreTemplate);
}