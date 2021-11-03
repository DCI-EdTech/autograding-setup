const fse = require('fs-extra');
const argv = require('../lib/yargs')
const lintingLevels = require('../settings/linting-levels')
const devMode = argv.dev;
const lintingStringency = argv.lintingStringency
const devDependencies = require('../settings/devDependencies')

exports.modifyPackageJson = async function(packageJsonPath) {
  const packageJson = require(packageJsonPath);
  const originalPackageJson = JSON.parse(JSON.stringify(packageJson))
  const isReact = (packageJson.dependencies.react || packageJson.devDependencies.react) && packageJson.scripts.test.includes('react-scripts');
  console.log('Modifying package.json')
  packageJson.scripts = Object.assign({
    "test": "jest",
    "prepare": "npm_config_yes=true npx husky install"
  }, packageJson.scripts);

  // if devMode set up script to restore original packageJson
  if(devMode) {
    Object.assign(packageJson.scripts, {
      "postinstall": `echo '${JSON.stringify(originalPackageJson, null, 2)}' > 'package.json'`,
      "prepare": ""
    });
  }

  if(!isReact) packageJson.stylelint = Object.assign({
    "extends": "stylelint-config-standard",
    "rules": lintingLevels[lintingStringency]['css']
  }, packageJson.stylelint);
  
  Object.assign(packageJson, {
    "eslintIgnore": [
      "__tests__/*.js",
      "jest.config.js"
    ],
    "lint-staged": Object.assign({
      "*.{js,html}": [
        "npx eslint --cache"
      ]}, (!isReact && {
      "*.css": "stylelint",
      "*.scss": "stylelint --syntax=scss"
    }))
  });

  packageJson.eslintConfig = isReact ? { "extends": "react-app" } : Object.assign({
    "plugins": ["@html-eslint"],
    "overrides": [{
      "files": ["*.html"],
      "parser": "@html-eslint/parser",
      "extends": ["plugin:@html-eslint/recommended"]
    }],
    "env": {
      "es6": true,
      "node": true
    },
    "extends": ["airbnb", "airbnb/hooks"],
    "parserOptions": {
      "ecmaVersion": 6
    },
    "rules": lintingLevels[lintingStringency]['js/html']
  }, packageJson.eslintConfig);

  packageJson.jest = Object.assign({
    "coveragePathIgnorePatterns": [
      "/node_modules/"
    ]
  }, packageJson.jest);
  
  packageJson.devDependencies = Object.assign((isReact ? devDependencies.minimal : devDependencies.full), packageJson.devDependencies);
  
  await fse.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2));
}