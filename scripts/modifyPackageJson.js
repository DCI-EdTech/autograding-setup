const fse = require('fs-extra');
const argv = require('../lib/yargs')
const lintingLevels = require('../settings/linting-levels')
const devMode = argv.dev;
const lintingStringency = argv.lintingStringency

exports.modifyPackageJson = async function(packageJsonPath) {
  const packageJson = require(packageJsonPath);
  const originalPackageJson = JSON.parse(JSON.stringify(packageJson))
  packageJson.scripts = Object.assign({
    "test": "jest",
    "test:watch": "jest --watch",
    "prepare": "npm_config_yes=true npx husky install"
  }, packageJson.scripts);

  // if devMode set up script to restore original packageJson
  if(devMode) {
    Object.assign(packageJson.scripts, {
      "postinstall": `echo '${JSON.stringify(originalPackageJson, null, 2)}' > 'package.json'`,
      "prepare": ""
    });
  }
  
  Object.assign(packageJson, {
    "eslintIgnore": [
      "__tests__/*.js",
      "jest.config.js"
    ],
    "stylelint": {
      "extends": "stylelint-config-standard",
      "rules": lintingLevels[lintingStringency]['css']
    },
    "lint-staged": {
      "*.{js,html}": [
        "npx eslint --cache"
      ],
      "*.css": "stylelint",
      "*.scss": "stylelint --syntax=scss"
    }
  });

  packageJson.eslintConfig = Object.assign({
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

  Object.assign({
    "testEnvironment": "node",
    "coveragePathIgnorePatterns": [
      "/node_modules/"
    ]
  }, packageJson.jest);
  
  packageJson.devDependencies = Object.assign({
    "@html-eslint/eslint-plugin": "^0.11.0",
    "@html-eslint/parser": "^0.11.0",
    "eslint": "^7.32.0",
    "eslint-config-airbnb": "^18.2.1",
    "eslint-plugin-jsx-a11y": "^6.4.1",
    "eslint-plugin-react": "^7.26.1",
    "eslint-plugin-react-hooks": "^4.2.0",
    "eslint-plugin-import": "^2.25.2",
    "eslint-plugin-node": "^11.1.0",
    "eslint-plugin-promise": "^5.1.0",
    "husky": "^7.0.1",
    "jest": "^26.6.3",
    "lint-staged": "^11.1.2",
    "stylelint": "^13.13.1",
    "stylelint-config-standard": "^22.0.0"
  }, packageJson.devDependencies);
  
  await fse.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2));
}