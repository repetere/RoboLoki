'use strict';
const periodic = require('periodicjs');
const Promisie = require('promisie');
const logger = periodic.logger;
const fs = require('fs-extra');
const path = require('path');
const dynamicDBLocals = periodic.locals.extensions.get('periodicjs.ext.dynamic_core_data');

function checkValidFile(options) {
  return new Promise((resolve, reject) => {
    try {
      const { file, } = options;
      if (!file) return reject(new Error('Invalid File'));
      else if (file.mimetype !== 'application/json') return reject(new Error('Valid Loki JSON db file required'));
      else return resolve(true);
    } catch (e) {
      reject(e);
    }
  });
}

function getFilePath(options) {
  const { file, } = options;
  return  path.join(periodic.config.app_root, 'public', file.fileurl);
  
}

function loadJSON(options) {
  return new Promise((resolve, reject) => {
    try {
      const { file, } = options;
      const filePath = getFilePath({ file, });
      // console.log('loadJSON',{filePath,file})
      return resolve(fs.readJson(filePath));
    } catch (e) {
      reject(e);
    }
  });
}

function formatLokiDB(options) {
  const { lokiDBConfig, } = options;
  let formattedLoki = {};
  formattedLoki.filename = lokiDBConfig.filename;
  formattedLoki.status = lokiDBConfig;
  if (!formattedLoki.name || formattedLoki.name==='undefined' || typeof formattedLoki.name ==='undefined') {
    formattedLoki.name = path.basename(formattedLoki.filename, '.json');
  }
  if (!formattedLoki.description || formattedLoki.description==='undefined' || typeof formattedLoki.description ==='undefined') {
    formattedLoki.description = path.basename(formattedLoki.filename);
  }
  lokiDBConfig.collections = lokiDBConfig.collections.map(collection => ({
    name: collection.name,
    filename: lokiDBConfig.filename,
    coredataname:`dcd_${formattedLoki.name}_${collection.name}`,
    dbname:formattedLoki.name,
    link:`/roboloki/lokis/${lokiDBConfig.filename}/${collection.name}`,
  }));
  
  return formattedLoki;
}

function createDynamicDbs(options) {
  return new Promise((resolve, reject) => {
    try {
      const { newdb, } = options;
      const dynamicCoredataDatabases = periodic.datas.get('dynamicdb_coredatadb');
      createModelDocs({ db: newdb, models: newdb.status.collections || [], })
        .then(createdModels => {
          const newdoc = getCoreDataDB({ db: newdb, models: createdModels, });
          // console.log('going to create', { newdoc, });
          return dynamicCoredataDatabases.create({ newdoc, });
        })
        .then(createdDB => {
          // console.log({ createdDB, });
          return dynamicDBLocals.connect.connectDynamicDatabases();
        })
        .then(() => {
          logger.silly('resynced database');
          resolve(true);
        })
        .catch(reject);
    } catch (e) {
      reject(e);
    }
  });
}

function createModelDocs(options) {
  return new Promise((resolve, reject) => {
    try {
      const dynamicCoredataModels = periodic.datas.get('dynamicdb_coredatamodel');
      let { models, db, } = options;
      models = models.map(model => getCoreModel({ model, db, }));
      return resolve(dynamicCoredataModels.create({
        newdoc: models,
        bulk_create:true,
      }));
    } catch (e) {
      return reject(e);
    }
  });
}

function getCoreModel(options) {
  const { model, db, } = options;
  return {
    // id: ObjectId,
    type: 'lowkie',
    name: model.name,
    title: model.name,
    description: `${model.name} model for ${db.name}`,
    database_name: db.name,
    scheme_fields: [
      {
        field_name: '_id',
        field_type: 'ObjectId',
        // field_default: String,
        // field_unique: Boolean,
        // field_index: Boolean,
        // field_expires: String,
        // field_ref: String,
      },
      {
        field_name: 'createdat',
        field_type: 'Date',
        // field_default: String,
        // field_unique: Boolean,
        // field_index: Boolean,
        // field_expires: String,
        // field_ref: String,
      },
    ],
    // scheme_options: Schema.Types.Mixed,
    // scheme_associations: Schema.Types.Mixed,
    scheme_core_data_options: {
      sort: '{ createdat: -1, }',
      docid: '["_id"]',
      search: '["_id","name","title","description"]',
      // population: String,
    },
  };
}

function getCoreDataDB(options) {
  const { models = [], db = {}, } = options;
  // const util = require('util');
  // console.log(util.inspect(db, { depth: 3, }));
  return {
    // id: ObjectId,
    type: 'lowkie',
    name: db.name,
    database_name: db.name,
    description: db.description,
    title: db.name,
    options: {
      dbpath: db.filename,
      dboptions: {
        strictSchemas: false,        
      },
    },
    core_data_models: models.map(model=>model._id),
  };
}

function removeAllReferences(options) {
  const { lokidbdocid, } = options;
  return new Promise((resolve, reject) => {
    try {
      const standard_loki_core_data = periodic.datas.get('standard_loki');
      const dynamicCoredataModels = periodic.datas.get('dynamicdb_coredatamodel');
      const dynamicCoredataDatabases = periodic.datas.get('dynamicdb_coredatadb');
      let dynamicdbdoc = {};
      standard_loki_core_data.load({ docid: lokidbdocid, })
        .then(lokidbdoc => { 
          // console.log({ lokidbdocid });
          dynamicdbdoc = lokidbdoc;
          return dynamicCoredataModels.query({ query: { database_name: lokidbdoc.name, }, });
        })
        .then(modelsToRemove => {
          // console.log({ modelsToRemove });
          const removeModelIds = modelsToRemove.map(model => model._id);

          return dynamicCoredataModels.delete({
            return_deleted: true,
            deleteid: removeModelIds,
          });
        })
        .then(removedIds => {
          // logger.silly('removed associated models', removedIds, 'removing dynamicdbdoc', dynamicdbdoc);
          dynamicCoredataDatabases.query({ query: { database_name: dynamicdbdoc.name, }, })
            .then(coreDB => { 
              // console.log('delete this id', {dynamicdbdoc });
              return dynamicCoredataDatabases.delete({
                deleteid: coreDB[0]._id,
                return_deleted: true,
              });
            })
            .catch(reject);
        })
        .then(removedDB => {
          dynamicDBLocals.connect.connectDynamicDatabases()
            .then(() => { 
              resolve(lokidbdocid);
            })
            .catch(reject);
          
          // logger.silly('removed associated db', removedDB);
        })
        .catch(reject);
    } catch (e) {
      reject(e);
    }
  });
}

module.exports = {
  checkValidFile,
  getFilePath,
  loadJSON,
  formatLokiDB,
  createDynamicDbs,
  getCoreModel,
  getCoreDataDB,
  removeAllReferences,
};