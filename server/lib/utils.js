/*
 *  Module which handles the common functions.
 *  Re-usable utility functions
 */
'use strict';
let bcrypt = require('bcrypt');
const saltRounds = 10;

async function getHeaderToken(headers) {
  await logger.info('METHOD ENTRY - server.lib.utils.getHeaderToken');
  if (headers && headers.authorization) {
    let parted = await headers.authorization.split(' ');
    if (parted.length === 2) {
      await logger.info('METHOD EXIT - server.lib.utils.getHeaderToken');
      return parted[1];
    } else {
      await logger.error('ERROR IN METHOD - server.lib.utils.getHeaderToken - failed to fetch token from headers');
      return null;
    }
  } else {
    await logger.error('ERROR IN METHOD - server.lib.utils.getHeaderToken - failed to fetch token from headers');
    return null;
  }
}

function getPasswordHashSync(password) {
  // logger.info('METHOD ENTRY - server.lib.utils.getPasswordHashSync');
  var hash = bcrypt.hashSync(password, saltRounds);
  // logger.info('METHOD EXIT - server.lib.utils.getPasswordHashSync');
  return hash;
}

async function getPasswordHashAsync(password) {
  await logger.info('METHOD ENTRY - server.lib.utils.getPasswordHashAsync');
  await bcrypt.hash(password, saltRounds, async (err, hash) => {
    if (err) {
      await logger.error('ERROR IN METHOD - server.lib.utils.getPasswordHashAsync - failed with error: ' + err);
      return;
    }
    await logger.info('METHOD EXIT - server.lib.utils.getPasswordHashAsync');
    return await hash;
  });
}

module.exports = {
  getHeaderToken: getHeaderToken,
  getPasswordHashSync: getPasswordHashSync,
  getPasswordHashAsync: getPasswordHashAsync
}