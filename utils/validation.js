import validator from 'validator'

export {isEmptyOrSpaces,validateUserName,validateEmail}

function isEmptyOrSpaces(str) {
  return str === null || str.match(/^ *$/) !== null
}
function validateUserName(username) {
  if (isEmptyOrSpaces(username)) {
    return { 'ok': false, 'err': 'empty' }
  }
  else if (username.length < 2) {
    return { 'ok': false, 'err': 'length' }
  }
  else if (username.match(/.?".?|.?&.?|.?\'.?|.?<.?|.?>.?/)) {
    return { 'ok': false, 'err': 'badchars' }
  }
  else{
    return { 'ok': true }
  }
}
function validateEmail(str) {
  return validator.isEmail(str);
}
