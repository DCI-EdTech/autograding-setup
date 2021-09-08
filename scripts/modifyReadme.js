const fse = require('fs-extra');
const path = require('path');
const {escapeRegExp} = require('../lib/helpers')

const readmeInfoPath = path.resolve(orig, 'AUTOGRADING.md');
const setupInfoPath = path.resolve(orig, 'SETUP.md');
const pointsBadgeString = `![Points badge](../../blob/badges/.github/badges/points.svg)\n\r`;
const infoDelimiters = ['[//]: # (autograding info start)', '[//]: # (autograding info end)'];
const setupDelimiters = ['[//]: # (autograding setup start)', '[//]: # (autograding setup end)'];

exports.modifyReadme = function (readmePath) {
  const readmeInfo = fse.readFileSync(readmeInfoPath, 'utf8');
  const setupInfo = fse.readFileSync(setupInfoPath, 'utf8');
  let readme = fse.readFileSync(readmePath, 'utf8')
  const infoRE = new RegExp(`[\n\r]*${escapeRegExp(infoDelimiters[0])}([\\s\\S]*)${escapeRegExp(infoDelimiters[1])}`, 'gsm');
  const setupRE = new RegExp(`[\n\r]*${escapeRegExp(setupDelimiters[0])}([\\s\\S]*)${escapeRegExp(setupDelimiters[1])}[\n\r]*`, 'gsm');

  // remove badge line
  readme = readme.replace(/\!\[Points badge\]\(.*[\n\r]*/g, '')

  // remove autograding info
  .replace(infoRE, '')

  // remove setup instructions
  .replace(setupRE, '\n')

  // add setup instructions after
  .replace(/^#[^#].*$/m, `$&\n\r${setupDelimiters[0]}\n${setupInfo}\n\r${setupDelimiters[1]}\n`);

  // insert badge line and autograding info
  fse.writeFileSync(readmePath, `${pointsBadgeString}${readme}\n\r${infoDelimiters[0]}\n${readmeInfo}\n\r${infoDelimiters[1]}`);
}