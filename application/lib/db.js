/*
 *  Module which handles the database operations.
 */
'use strict';
let mongoose = require('mongoose'),
  async = require('async'),
  config = require('../../config/database'),
  dbSetup = require('../../db/db-setup-script');
let connection;
let connected = false;

async function connectToMongo() {
  logger.info('METHOD ENTRY - application.lib.db.connectToMongo');
  mongoose.Promise = global.Promise;
  await mongoose.set('debug', true);
  await mongoose.set('diagnosticDataCollectionEnabled', false);
  await mongoose.set('useFindAndModify', false);
  await mongoose.set('useCreateIndex', true);
  await mongoose.set('autoIndex', false);
  await mongoose.connect(config.database, {useNewUrlParser: true}).
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
  connection = await mongoose.connection;
  if (!connection) {
    await logger.error('DB Connection promise not passed to setup DB');
  }
  await logger.info('=========== Starting:  master records Patch ==============');

  async.waterfall([
    async function(cb) {
      await removeCollections(function(err) {
        if (err) {
          return cb('Remove collections failed: ' + err);
        }
        return cb();
      });
    },
    async function(cb) {
      await createIndex('aircrafts', 'aircraft_no', function(err) {
        if (err) {
          return cb('Create index failed: ' + err);
        }
        return cb();
      });
    },
    async function(cb) {
      await updateCollection('aircrafts', dbSetup.aircraftRecords, function(err) {
        if (err) {
          return cb('Update collection failed ' + err);
        }
        return cb();
      });
    }],
    async function(err) {
      if (err) {
        await logger.error('Master records Patch failed with error:- ' + err);
        return err;
      }
      await logger.info('=========== Ending: master records Patch ==============');
      await logger.info('METHOD EXIT - application.lib.db.setupDb');
      return;
    });
}

async function removeCollections() {
  await logger.info('METHOD ENTRY - application.lib.db.removeCollections');

  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.drop();
  }
  await logger.info('METHOD EXIT - application.lib.db.removeCollections');
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
      {[index_field]: 1},
      {unique: true, background: true}
      , function(err, indexName) {
        if (err) {
          logger.error('FAIL: Error occured while adding ' + indexName + '  to ' + collectionName + ' collection.')
          return err;
        }
      });
  });
  await logger.info('METHOD EXIT - application.lib.db.createIndex');
}
async function updateCollection(collectionName, data, cb) {
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
    async.each(data, function(obj, asynCb) {
      collection.insertOne(obj, function(err) {
        if (err) {
          logger.error('FAILED while resetting "' + collectionName + '" collection. Error: ' + err);
          return asynCb(err);
        }
        return asynCb();
      });
    }, function(err) {
      if (err) {
        logger.error('FAIL: Error occured while adding records to ' + collectionName + ' collection.')
        return err;
      }
    });
  });
  await logger.info('METHOD EXIT - application.lib.db.updateCollection');
}

module.exports = {
  connectToMongo: connectToMongo,
  closeConnection: closeConnection,
  setupDb: setupDb
}