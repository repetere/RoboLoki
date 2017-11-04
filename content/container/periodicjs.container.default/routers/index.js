'use strict';

const periodic = require('periodicjs');
const extensionRouter = periodic.express.Router();
const reactAppControllers = periodic.controllers.extension.get('periodicjs.ext.reactapp');
const controllers = require('../controllers');
extensionRouter.put('*',
  controllers.helper.disableFileSave,  
  reactAppControllers.helper.handleFileUpload,
  reactAppControllers.helper.fixCodeMirrorSubmit,
  reactAppControllers.helper.fixFlattenedSubmit);
extensionRouter.post('*',
  controllers.helper.disableFileSave,  
  reactAppControllers.helper.handleFileUpload,
  reactAppControllers.helper.fixCodeMirrorSubmit,
  reactAppControllers.helper.fixFlattenedSubmit);
extensionRouter.use('/roboloki', periodic.routers.get('standard_loki').router);
extensionRouter.post('/add-coredata', controllers.helper.addNewDocument);
extensionRouter.delete('/remove-db-doc/:entitytype/:id', controllers.helper.removeDocument);
extensionRouter.get('/load-loki-doc/:entitytype/:id', controllers.helper.getDocument);
extensionRouter.put('/update-coredata', controllers.helper.editDocument);
extensionRouter.get('/loki-db-load', controllers.helper.getDatabaseDocuments);

module.exports = extensionRouter;