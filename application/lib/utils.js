/*
 *  Module which handles the common functions.
 *  Re-usable utility functions
 */
'use strict';

async function getHeaderToken(headers) {
  if (headers && headers.authorization) {
    let parted = await headers.authorization.split(' ');
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
  getHeaderToken: getHeaderToken
}