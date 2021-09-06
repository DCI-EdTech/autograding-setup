const fse = require('fs-extra');
const {escapeRegExp} = require('./lib/helpers')

module.exports = function modifyReadme(readmePath, readmeInfoPath, delimiters) {
  const readmeInfo = fse.readFileSync(readmeInfoPath, 'utf8');
  let readme = fse.readFileSync(readmePath, 'utf8')
  const re = new RegExp(`${escapeRegExp(delimiters[0])}(.*)${escapeRegExp(delimiters[1])}`, 'g');
  // remove badge line
  readme = readme.replace(/\!\[Points badge\]\(.*[\n\r]*/g, '')
  // remove autograding info
  console.log(readme.match(re))
  readme = readme.replace(re, '')
  // insert badge line and autograding info
  fse.writeFileSync(readmePath, `${pointsBadgeString}${readme}\n\r${delimiters[0]}${readmeInfo}${delimiters[1]}`);
}