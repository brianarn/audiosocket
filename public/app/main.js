require.config({
  paths: {
    jquery: '../vendor/bower/jquery/jquery',
    socketio: '/socket.io/socket.io'
  }
});

require(['app', 'jquery'], function (app, $) {
  console.log(app);
  console.log('Running jQuery %s', $().jquery);
});
// vim: set et ts=2 sts=2 sw=2:
