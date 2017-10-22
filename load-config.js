const copyFile = require('fs-copy-file-sync')

const target = 'src/env-config.js'
let source

function copy (env) {
  switch (env) {
    case 'production':
      source = './env-config/config.prod.js'
      break;
    case 'development':
    default:
      source = './env-config/config.dev.js'
  }

  copyFile(source, target)
}

module.exports = copy
