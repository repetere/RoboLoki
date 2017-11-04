'use strict';
const electron = require('electron'); // http://electron.atom.io/docs/api
const path = require('path');         // https://nodejs.org/api/path.html
const url = require('url');           // https://nodejs.org/api/url.html
const periodic = require('periodicjs');
let window = null;

// Wait until the app is ready
electron.app.once('ready', function () {
  // Create a new window
  window = new electron.BrowserWindow({
    // Set the initial width to 800px
    width: 800,
    // Set the initial height to 600px
    height: 600,
    // Set the default background color of the window to match the CSS
    // background color of the page, this prevents any white flickering
    // backgroundColor: '#D6D8DC',
    // Don't show the window until it ready, this prevents any white flickering
    show: false,
  });
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
      //   // Load a URL in the window to the local index.html path
      // window.loadURL(url.format({
      //   pathname: path.join(__dirname, 'index.html'),
      //   protocol: 'file:',
      //   slashes: true,
      // }));
      window.loadURL('http://localhost:8123/');
      
  // Show window when page is ready
      window.once('ready-to-show', function () {
        window.show();
      });
    })
    .catch(e => {
      console.error(e);
    });

});


/**
 *
 const express = require('./express'); //your express app

app.on('ready', function() {
  express();
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    autoHideMenuBar: true,
    useContentSize: true,
    resizable: false,
  });
  mainWindow.loadURL('http://localhost:5000/');
  mainWindow.focus();

});

 *
 */