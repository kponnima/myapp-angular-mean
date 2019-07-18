/*
 *  Library which handles the common application module operations.
 *  Re-usable utility functions
 */

async function getToken(headers) {
  if (headers && headers.authorization) {
    var parted = await headers.authorization.split(' ');
    if (parted.length === 2) {
      return parted[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
}

module.exports = {
  getToken: getToken
}