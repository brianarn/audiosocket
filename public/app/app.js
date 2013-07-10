define([
  'module',
  'jquery',
  'socket.io',
  'AudioContext'
], function (module, $, io, AudioContext) {
  // Some convenience variables
  var mid = module.id;

  // A simple logger to make debugging a bit easier
  function log(msg) {
    console.log(mid, msg);
  }

  // Create a simple object to use as the module value
  var app = {};

  // init: Simply get things rolling
  app.init = function (args) {
    log('init');

    // Set up options
    var defaults = {
      parentNode: document.body,
      gain: 0.1
    };
    var options = $.extend({}, defaults, args);
    if (typeof options.parentNode === 'string') {
      options.parentNode = document.getElementById(options.parentNode);
    }

    // Create our user interface
    this.renderUI(options.parentNode);

    // Create an audio context
    var context = this.context = new AudioContext();

    // Create some gain because ow, my ears if I don't
    var gainNode = this.gainNode = context.createGainNode();
    gainNode.gain.value = options.gain;

    // Wire up some outputs
    gainNode.connect(context.destination);
  };

  // renderUI: Create some DOM nodes, blah blah
  app.renderUI = function (parentNode) {
    log('renderUI');

    // Top-level DOM node
    var domNode = this.domNode = document.createElement('div');
    domNode.className = 'audiosocket';

    // A couple of child nodes
    var startNode = this.startNode = document.createElement('button');
    startNode.setAttribute('type', 'button');
    startNode.innerHTML = 'Start';
    startNode.addEventListener('click', this.startOscillator.bind(this), false);
    domNode.appendChild(startNode);

    var stopNode = this.stopNode = document.createElement('button');
    stopNode.setAttribute('type', 'button');
    stopNode.innerHTML = 'Stop';
    stopNode.addEventListener('click', this.stopOscillator.bind(this), false);
    domNode.appendChild(stopNode);

    // Append it in
    parentNode.appendChild(domNode);
  };

  // startOscillator: Create and start an oscillator playing
  app.startOscillator = function (event) {
    log('startOscillator');

    // If we received a DOM event, keep any defaults from happening
    if (event && event.preventDefault) { event.preventDefault(); }

    // Create an oscillator, hook it up to the gain, and start it
    var oscillator = this.oscillator = this.context.createOscillator();
    oscillator.type = oscillator.SQUARE;
    oscillator.connect(this.gainNode);
    oscillator.start(0);
  };

  // Stop the oscillator currently playing
  app.stopOscillator = function () {
    log('stopOscillator');

    // If we have one, simply clean up
    var oscillator = this.oscillator;
    if (oscillator) {
      oscillator.stop(0);
      oscillator.disconnect();
      this.oscillator = null;
    }
  };

  // Don't forget to return it
  return app;
});
// vim: set et ts=2 sts=2 sw=2:
