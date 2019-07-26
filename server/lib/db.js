/*
 *  Module which handles the database operations.
 */
'use strict';
let mongoose = require('mongoose'),
  async = require('async'),
  _ = require('lodash'),
  config = require('config'),
  dbSeedRecords = require('../db/db-setup-script'),
  utils = require('../lib/utils');
let connection;
let connected = false;
let dbCreateIndex = true;
let dbSeedCollection = true;
let dbDropCollection = true;
let dbIgnoreForDropCollection = true;
let dbIgnoreDropCollections = [];
let dbIgnoreForSeedCollection = true;
let dbIgnoreSeedCollections = ['payments', 'reservations', 'travelers'];
let dbSeedCollections = ['aircrafts', 'airports', 'flights', 'inventory', 'payments', 'reservations', 'travelers', 'users'];
let dbIgnoreForIndexCollection = true;
let dbIgnoreIndexCollections = ['payments', 'reservations', 'travelers'];
let dbIndexCollections = ['aircrafts', 'airports', 'flights', 'inventory', 'payments', 'reservations', 'travelers', 'users'];
var hashPassword;

async function connectToMongo() {
  logger.info('METHOD ENTRY - application.lib.db.connectToMongo');
  mongoose.Promise = global.Promise;
  await mongoose.set('debug', true);
  await mongoose.set('diagnosticDataCollectionEnabled', false);
  await mongoose.set('useFindAndModify', false);
  await mongoose.set('useCreateIndex', true);
  await mongoose.set('autoIndex', false);
  await mongoose.connect(config.get('database'), { useNewUrlParser: true }).
    catch(error => {
      logger.error('MongoDb connection error: ' + err);
      return error;
    });
  connected = true;
  logger.info('METHOD EXIT - application.lib.db.connectToMongo');
  return connected;
}
async function closeConnection() {
  logger.info('METHOD ENTRY - application.lib.db.closeConnection');
  await mongoose.disconnect();
  connected = false;
  logger.info('METHOD EXIT - application.lib.db.closeConnection');
  return connected;
}
async function setupDb() {
  await logger.info('METHOD ENTRY - application.lib.db.setupDb');
  await logger.info('=========== Starting:  master records Patch ==============');

  try {
    await removeCollections();
    await createIndexes();
    await addCollections();
    await logger.info('=========== Ending: master records Patch ==============');
  } catch (err) {
    await logger.error('Master records Patch failed with error:- ' + err);
  }

  await logger.info('METHOD EXIT - application.lib.db.setupDb');
}

async function removeCollections() {
  await logger.info('METHOD ENTRY - application.lib.db.removeCollections');

  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    if (dbIgnoreForDropCollection) {
      let result = _.indexOf(dbIgnoreDropCollections, collection.s.name);
      if (result === -1) {
        await logger.info('Collection ' + collection.s.name + ' is now dropped');
        await collection.drop();
      } else {
        await logger.info('Collection ' + collection.s.name + ' drop is SKIPPED');
      }
    } else {
      await logger.info('Collection ' + collection.s.name + ' is now dropped');
      await collection.drop();
    }
  }
  await logger.info('METHOD EXIT - application.lib.db.removeCollections');
  return true;
}
async function removeCollection(collectionName, cb) {
  await logger.info('METHOD ENTRY - application.lib.db.removeCollection');
  if (!collectionName) {
    await logger.error('CollectionName not passed to update DB collection');
    return cb('CollectionName not passed to update DB collection');
  }
  mongoose.connection.db.collection(collectionName, async (err, collection) => {
    if (err) {
      await logger.error('FAIL: Error in dropping ' + collectionName + ' collection.');
      return cb(err);
    }
    await collection.drop();
  });

  await logger.info('METHOD EXIT - application.lib.db.removeCollection');
  return cb();
}
async function createIndex(collectionName, index_field, cb) {
  await logger.info('METHOD ENTRY - application.lib.db.createIndex');

  if (!collectionName) {
    await logger.error('CollectionName not passed to create index');
    return cb('CollectionName not passed to create index');
  }
  if (!index_field) {
    await logger.error('Index field not passed to create index');
    return cb('Index field not passed to create index');
  }
  mongoose.connection.db.collection(collectionName, async (err, collection) => {
    if (err) {
      await logger.error('FAIL: Error in adding index to ' + collectionName + ' collection.');
      return err;
    }
    // Create an index on the field
    collection.createIndex(
      { [index_field]: 1 },
      { unique: true, background: true }
      , function (err, indexName) {
        if (err) {
          logger.error('FAIL: Error occured while adding ' + indexName + '  to ' + collectionName + ' collection.')
          return err;
        }
      });
  });
  await logger.info('METHOD EXIT - application.lib.db.createIndex');
}
async function createIndexes() {
  await logger.info('METHOD ENTRY - application.lib.db.createIndexes');
  _.forEach(dbIndexCollections, async (value) => {
    if (dbIgnoreForIndexCollection) {
      let result = _.indexOf(dbIgnoreIndexCollections, value);
      if (result === -1) {
        await logger.info('Collection ' + value + ' is now indexed');
        await mongoose.connection.db.collection(value, async (err, collection) => {
          if (err) {
            await logger.error('FAIL: Error in dropping ' + value + ' collection.');
            return err;
          }
          // Create an index on the field
          collection.createIndex(
            { [dbSeedRecords.createIndex[value]]: 1 },
            { unique: true, background: true }
            , function (err, indexName) {
              if (err) {
                logger.error('FAIL: Error occured while adding ' + indexName + '  to ' + value + ' collection.')
                return err;
              }
            });
        });
      } else {
        await logger.info('Collection ' + value + ' indexing is SKIPPED');
      }
    } else {
      await logger.info('Collection ' + value + ' is now indexed');
      await mongoose.connection.db.collection(value, async (err, collection) => {
        if (err) {
          await logger.error('FAIL: Error in indexing ' + value + ' collection.');
          return await err;
        }
        // Create an index on the field
        await collection.createIndex(
          { [dbSeedRecords.createIndex[value]]: 1 },
          { unique: true, background: true }
          , async (err, indexName) => {
            if (err) {
              await logger.error('FAIL: Error occured while adding ' + indexName + '  to ' + value + ' collection.')
              return await err;
            }
          });
      });
    }
  });
  await logger.info('METHOD EXIT - application.lib.db.createIndexes');
  return true;
}
async function addCollection(collectionName, data, cb) {
  await logger.info('METHOD ENTRY - application.lib.db.updateCollection');

  if (!collectionName) {
    await logger.error('CollectionName not passed to update DB collection');
    return cb('CollectionName not passed to update DB collection');
  }
  if (!data) {
    await logger.error('Data not passed to update DB records');
    return cb('Data not passed to update DB records');
  }

  mongoose.connection.db.collection(collectionName, async (err, collection) => {
    if (err) {
      await logger.error('FAIL: Error in dropping ' + collectionName + ' collection.');
      return err;
    }
    async.each(data, function (obj, asynCb) {
      collection.insertOne(obj, function (err) {
        if (err) {
          logger.error('FAILED while resetting "' + collectionName + '" collection. Error: ' + err);
          return asynCb(err);
        }
        return asynCb();
      });
    }, function (err) {
      if (err) {
        logger.error('FAIL: Error occured while adding records to ' + collectionName + ' collection.')
        return err;
      }
      logger.info('Update collection name ' + collectionName + ' successful.');
    });
  });
  await logger.info('METHOD EXIT - application.lib.db.updateCollection');
}
async function addCollections() {
  await logger.info('METHOD ENTRY - application.lib.db.updateCollections');
  _.forEach(dbSeedCollections, async (value) => {
    if (dbIgnoreForSeedCollection) {
      let result = _.indexOf(dbIgnoreSeedCollections, value);
      if (result === -1) {
        await logger.info('Collection ' + value + ' is now updated');
        await mongoose.connection.db.collection(value, async (err, collection) => {
          if (err) {
            await logger.error('FAIL: Error in updating ' + value + ' collection.');
            return await err;
          }
          async.each(dbSeedRecords[value], function (obj, asynCb) {
            collection.insertOne(obj, function (err) {
              if (err) {
                logger.error('FAILED while updating "' + value + '" collection. Error: ' + err);
                return asynCb(err);
              }
              return asynCb();
            });
          }, function (err) {
            if (err) {
              logger.error('FAIL: Error occured while adding records to ' + value + ' collection.')
              return err;
            }
            return;
          });
        });
      } else {
        await logger.info('Collection ' + value + ' update is SKIPPED');
      }
    } else {
      await logger.info('Collection ' + value + ' is now update');
      mongoose.connection.db.collection(value, async (err, collection) => {
        if (err) {
          await logger.error('FAIL: Error in updating ' + value + ' collection.');
          return err;
        }
        async.each(dbSeedRecords[value], function (obj, asynCb) {
          collection.insertOne(obj, function (err) {
            if (err) {
              logger.error('FAILED while updating "' + value + '" collection. Error: ' + err);
              return asynCb(err);
            }
            return asynCb();
          });
        }, function (err) {
          if (err) {
            logger.error('FAIL: Error occured while adding records to ' + value + ' collection.')
            return err;
          }
          return;
        });
      });
    }
  });
  await logger.info('METHOD EXIT - application.lib.db.updateCollections');
  return true;
}
async function updateCollection(collectionName, unique_filter, data, cb) {
  await logger.info('METHOD ENTRY - application.lib.db.updateCollection');

  if (!collectionName) {
    await logger.error('CollectionName not passed to update DB collection');
    return cb('CollectionName not passed to update DB collection');
  }
  if (!unique_filter) {
    await logger.error('Unique key not passed to update DB records');
    return cb('Data not passed to update DB records');
  }
  if (!data) {
    await logger.error('Data not passed to update DB records');
    return cb('Data not passed to update DB records');
  }

  mongoose.connection.db.collection(collectionName, async (err, collection) => {
    if (err) {
      await logger.error('FAIL: Error in dropping ' + collectionName + ' collection.');
      return err;
    }
    await collection.replaceOne(unique_filter, data, async (err) => {
      if (err) {
        await logger.error('FAILED while updating "' + collectionName + '" collection. Error: ' + err);
      } else {
        await logger.info('Update collection name ' + collectionName + ' successful.');
      }
    });
  });
  await logger.info('METHOD EXIT - application.lib.db.updateCollection');
}

module.exports = {
  connectToMongo: connectToMongo,
  closeConnection: closeConnection,
  setupDb: setupDb,
  removeCollections: removeCollections,
  removeCollection: removeCollection,
  createIndex: createIndex,
  createIndexes: createIndexes,
  addCollection: addCollection,
  addCollections: addCollections,
  updateCollection: updateCollection
}