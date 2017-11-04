'use strict';
const path = require('path');
const periodic = require('periodicjs');

function disableFileSave(req, res, next){
  req.save_file_to_asset = false;
  next();
}

function addNewDocument(req, res, next) {
  try {
    const modelname = req.headers.referer.split('/')[ req.headers.referer.split('/').length - 1 ];
    const newdoc = JSON.parse(req.body.newdoc);
    const coreDataModel = periodic.datas.get(modelname);
    newdoc[ '$notstrict' ] = true;
    // console.log({ newdoc, modelname, });
    coreDataModel.create({ newdoc, })
      .then(createdDoc => {
        res.send(periodic.utilities.routing.formatResponse({ newdoc: createdDoc, }));
      })
      .catch(next);
  } catch (e) {
    next(e);
  }
}

function removeDocument(req, res, next) {
  try {
    const modelname = req.headers.referer.split('/')[ req.headers.referer.split('/').length - 1 ];
    const deleteid = req.params.id;
    const coreDataModel = periodic.datas.get(modelname);
    coreDataModel.delete({ deleteid, })
      .then(removedDoc => {
        res.send(periodic.utilities.routing.formatResponse({ newdoc: removedDoc, }));
      })
      .catch(next);
  } catch (e) {
    next(e);
  }
}

function getDatabaseDocuments(req, res, next) {
  try {
    const model_name = req.headers.referer.split('/')[ req.headers.referer.split('/').length - 1 ];
    const model = periodic.datas.get(model_name);
    req.query = Object.assign({
      pagenum: 0,
      limit: 100,
      pagelength: 15,
      skip: 0,
      format:'json',
    }, req.query);
    periodic.controllers.core.get(model_name).protocol.api.initialize.PAGINATE({
      skip_json_post_transforms:true,
      model_name,
      model,
      protocol: {
        db: {
          [model_name]:model,
        },
        respond: (req, res, responseData) => {
          res.send(periodic.utilities.routing.formatResponse({ data:responseData.data, }));
        },
      }, })(req, res, next);
    // const docid = req.params.id;
    // coreDataModel.load({ query:{ _id:docid,  }, })
    //   .then(data => {
    //     console.log({ data, });
    //     res.send(periodic.utilities.routing.formatResponse({ data, }));
    //   })
    //   .catch(next);
  } catch (e) {
    next(e);
  }
}

function getDocument(req, res, next) {
  try {
    const modelname = req.headers.referer.split('/')[ req.headers.referer.split('/').length - 1 ];
    const docid = req.params.id;
    const coreDataModel = periodic.datas.get(modelname);
    coreDataModel.load({ query:{ _id:docid,  }, })
      .then(data => {
        console.log({ data, });
        res.send(periodic.utilities.routing.formatResponse({ data, }));
      })
      .catch(next);
  } catch (e) {
    next(e);
  }
}

function editDocument(req, res, next) {
  try {
    const modelname = req.headers.referer.split('/')[ req.headers.referer.split('/').length - 1 ];
    const docid = req.body.docid;
    const coreDataModel = periodic.datas.get(modelname);
    // console.log('req.body',req.body)
    const updatedoc = typeof req.body.data === 'string' ? JSON.parse(req.body.data) : req.body.data;
    
    // console.log('updating', { docid, updatedoc, });
    coreDataModel.load({ query:{ _id:docid,  }, })
      .then(data => {
        return coreDataModel.update({
          id: data._id,
          updatedoc,
        });
      })
      .then(updateddoc => {
        // console.log({ updateddoc, });
        res.send(periodic.utilities.routing.formatResponse({ updateddoc, }));
      })
      .catch(next);
  } catch (e) {
    next(e);
  }
}

module.exports = {
  disableFileSave,
  addNewDocument,
  removeDocument,
  getDatabaseDocuments,
  getDocument,
  editDocument,
};