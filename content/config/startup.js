'use strict';

/**
 * this function is used to add additional customizations to the express application before the express server starts. The function is bound with the periodic singleton instance
 * 
 * @returns 
 */
function customExpressConfiguration() {
  return new Promise((resolve, reject) => {
    /**
     * this.app// is a reference to periodic's express instance
     * app.use((req,res,next)=>{
     * //custom middleware
     * next(); 
     * })
     */
    this.app.use((req, res, next) => {
      req.user = {
        _id:'roboloki',
        name:'roboloki',
        email:'roboloki@localhost:8123',
      };
      next();
    });
    // this.app.all('*', function(req, res, next) {
    //   res.setHeader('Access-Control-Allow-Credentials', 'true');
    //   res.setHeader('Access-Control-Allow-Origin', '*');
    //   res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,DELETE,DEL,PUT');
    //   res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, entitytype, clientid, username, password, x-access-token, X-Access-Token');
    //   console.log('req.method',req.method)
    //   console.log('req.originalUrl',req.originalUrl)
    //   console.log('req.headers',req.headers)
    //   if (req.method === 'OPTIONS') {
    //     res.sendStatus(200);
    //     // next();
    //   } else {
    //     next();
    //   }
    //   // res.send({status:'ok'})
    // });
    resolve(true);
  });
}

module.exports = {
  customExpressConfiguration,
};