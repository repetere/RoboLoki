'use strict';
const lowkie = require('lowkie');
const Schema = lowkie.Schema;
const ObjectId = Schema.ObjectId;
const scheme = {
  id: ObjectId,
  filename: String,
  name: String,
  description: {
    type: String,
    default:'Loki Database',
  },
  status: {
    filename: String,
    collections: [{
      filename:String,
      name:String,
      link:String,
    }, ],
    databaseVersion: Number,
    engineVersion: Number,
    autosave: Boolean,
    autosaveInterval: Number,
    autosaveHandle: Boolean,
    throttledSaves: Boolean,
    options: {
      env: String,
      serializationMethod:String,
      destructureDelimiter: String,
    },
    persistenceAdapter: Boolean,
    verbose: Boolean,
    ENV: String,
  },
};

module.exports = {
  scheme,
  options: {
    unique: ['filename',],
  },
  coreDataOptions: {
    docid: ['_id', 'name',],
    sort: { createdat: -1, },
    search: ['filename', 'name', 'description', ],
  },
};