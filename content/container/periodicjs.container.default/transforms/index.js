'use strict';
const periodic = require('periodicjs');
const fs = require('fs-extra');
const path = require('path');
const utilities = require('../utilities');

function stageDBCreate(req) {
  return new Promise((resolve, reject) => {
    try {
      if(!req.files) return reject(new Error('Please provide a valid Loki Database JSON'));
      const file = req.files[ 0 ];
      utilities.lokijson.checkValidFile({ file, })
        .then(() => {
          // periodic.logger.silly('sample pre transfrom', req.params.id);
          // console.log('req.controllerData', req.controllerData);
          // console.log('req.body', req.body);
          // console.log('req.files', req.files);
          return utilities.lokijson.loadJSON({ file, });
        })
        .then(lokiDBConfig => {
          // console.log({ lokiDBConfig, });
          req.body = utilities.lokijson.formatLokiDB({ lokiDBConfig, });
          utilities.lokijson.createDynamicDbs({ newdb: req.body, })
            .then(() => {
              resolve(req);
            })
            .catch(reject);
          // resolve(req);
          fs.remove(utilities.lokijson.getFilePath({ file, })).then(() => { }).catch(console.error);
        })
        .catch(reject); 
    } catch (e) {
      reject(e);
    }
  });
}

function removeAllReferences(req) {
  return new Promise((resolve, reject) => {
    try {
      utilities.lokijson.removeAllReferences({ lokidbdocid: req.params.id, })
        .then(() => {
          resolve(req);
        })
        .catch(reject);
    } catch (e) {
      reject(e);
    }
  });
}

module.exports = {
  pre: {
    GET: {
    },
    POST: {
      '/roboloki/lokis':[stageDBCreate, ],
    },
    DELETE: {
      '/roboloki/lokis/:id':[removeAllReferences, ],
    },
  },
  post: {
    GET: {
    },
    POST: {
      // '/roboloki/lokis':[cleanUpFile,],
    },
  },
};