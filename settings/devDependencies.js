const minimal = {
  "husky": "^7.0.1",
  "lint-staged": "^11.1.2"
}

module.exports = {
  minimal,
  full: Object.assign({...minimal}, {
    "@html-eslint/eslint-plugin": "^0.12.0",
    "@html-eslint/parser": "^0.11.0",
    "eslint": "^7.32.0",
    "eslint-config-airbnb": "^18.2.1",
    "eslint-config-airbnb-base": "^15.0.0",
    "eslint-plugin-import": "^2.25.2",
    "eslint-plugin-node": "^11.1.0",
    "eslint-plugin-promise": "^5.1.0",
    "jest": "^26.6.3",
    "stylelint": "^13.13.1",
    "stylelint-config-standard": "^22.0.0"
  })
}