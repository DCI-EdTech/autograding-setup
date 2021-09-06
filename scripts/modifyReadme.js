const fse = require('fs-extra');
const {escapeRegExp} = require('../lib/helpers')

const pointsBadgeString = `![Points badge](../../blob/badges/.github/badges/points.svg)\n\r`;
const delimiters = ['[//]: # (autograding info start)', '[//]: # (autograding info end)'];

exports.modifyReadme = function (readmePath, readmeInfoPath) {
  const readmeInfo = fse.readFileSync(readmeInfoPath, 'utf8');
  let readme = fse.readFileSync(readmePath, 'utf8')
  const re = new RegExp(`[\n\r]*${escapeRegExp(delimiters[0])}([\\s\\S]*)${escapeRegExp(delimiters[1])}`, 'gsm');
  // remove badge line
  readme = readme.replace(/\!\[Points badge\]\(.*[\n\r]*/g, '')
  // remove autograding info
  readme = readme.replace(re, '')
  // insert badge line and autograding info
  fse.writeFileSync(readmePath, `${pointsBadgeString}${readme}\n\r${delimiters[0]}\n${readmeInfo}\n\r${delimiters[1]}`);
}