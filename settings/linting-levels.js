module.exports = {
  'low': {
    'js/html': {
      'no-console': 'off',
      'eol-last': 'off',
      'semi': 'off', // don't enforce semicolon on end of line
      'prefer-template': 'off',
      'no-unused-vars': 'off',
      'quotes': 'off', // don't enforce single quotes
      //'@html-eslint/require-lang': 'off',
      'no-trailing-spaces': 'off'
    },
    'css': {
      "no-missing-end-of-source-newline": null
    }
  },
  'medium': {
    'js/html': {
      'no-console': 'off',
      'eol-last': 'off',
      'prefer-template': 'off',
      //'@html-eslint/require-lang': 'off',
      'no-trailing-spaces': 'off'
    },
    'css': {
      "no-missing-end-of-source-newline": null
    }
  },
  'high': {
    'js/html': {
      'eol-last': 'off'
    },
    'css': {
      "no-missing-end-of-source-newline": null
    }
  }
}