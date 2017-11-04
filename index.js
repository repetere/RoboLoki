const periodic = require('periodicjs');

periodic.init({
  debug: true,
  environment: 'electron',
  settings: {
    name: 'RoboLoki',
    application: {
      check_for_updates: false,
      check_for_outdated_extensions: false,
      environment: 'electron',
      url: 'localhost:8123',
      protocol: 'http://',
      server: {
        http: {
          port: 8123,
        },
        https: {
          port: 8124,
        },
      },
    },
    express: {
      sessions: {
        enabled: true,
      },
    },
  },  
})
  .then(periodicInitStatus => {
    console.log({ periodicInitStatus, }
      // , periodic.settings
    );
  })
  .catch(e => {
    console.error(e);
  });