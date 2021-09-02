# autograding-setup
Script to insert all files and configuration for autograding into exercise repositories
## Requirements for target repos
- Test files need to be in **`__tests__`** directory
- To be used for autograding test file names need to match the glob pattern `tasks.*.js` i.e. `tasks.1.js`
- The **package.json** needs to have
```
"scripts": {
   "preinstall": "npx github:DCI-EdTech/autograding-setup"
}
```
## What it does
### Inserted files
```
|
|   .gitignore
|___.husky
|   |    pre-commit
|___.github
    |___classroom
    |   |   autograding.json
    |___workflows
    |   |   classroom.yml
    |   .keep
```
### Generated and modified files
- **.github/classroom/autograding.json** is generated based on the [matching](#requirements-for-target-repos) test files in **`__tests__`**
- **package.json** is expanded with
  - devDependencies
  - `prepare` script: `husky install`
  - scripts for testing
  - eslint settings
  - jest settings
- **README.md** receives a line to include the result score of the autograding
### Commands executed during installation
- `husky install`
- `git add . && git commit -m "added autograding setup"`
