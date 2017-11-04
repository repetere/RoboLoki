module.exports = {
  'periodicjs_ext_reactapp': {
    'manifests': [],
    'unauthenticated_manifests': [
      'content/container/periodicjs.container.default/views/home'
    ],
    'navigation': false,
    'components': {
      'login': false,
      'main': {},
      'error': {
        '400': false,
        '404': '/content/container/periodicjs.container.default/views/error/404error.manifest.js',
      },
    },
  },
};
