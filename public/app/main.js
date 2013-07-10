require.config({
  paths: {
    domReady: '../vendor/bower/requirejs-domready/domReady',
    jquery: '../vendor/bower/jquery/jquery',
    'socket.io': '/socket.io/socket.io'
  }
});

require(['app', 'domReady!'], function (app) {
  app.init({
    parentNode: 'audiosocket'
  });
});
// vim: set et ts=2 sts=2 sw=2:
