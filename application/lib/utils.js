/*
 *  Module which handles the common functions.
 *  Re-usable utility functions
 */
'use strict';
let bcrypt = require('bcrypt');
const saltRounds = 10;

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

function getPasswordHashSync(password) {
  var hash = bcrypt.hashSync(password, saltRounds);
  return hash;
}

async function getPasswordHashAsync(password) {
  await bcrypt.hash(password, saltRounds, async (err, hash) => {
    return await hash;
  });
}

module.exports = {
  getHeaderToken: getHeaderToken,
  getPasswordHashSync: getPasswordHashSync,
  getPasswordHashAsync: getPasswordHashAsync
}