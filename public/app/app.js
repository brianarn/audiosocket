define([
  'module',
  'jquery',
  //'socket.io',
  'AudioContext'
], function (module, $, /*io,*/ AudioContext) {
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
      node: "#audiosocket",
      gain: 0.1
    };
    var options = $.extend({}, defaults, args);

    // Create our user interface
    this.connectUI(options.node);

    // Create an audio context
    var context = this.context = new AudioContext();

    // Create some gain because ow, my ears if I don't
    var gainNode = this.gainNode = context.createGainNode();
    gainNode.gain.value = options.gain;

    // Wire up some outputs
    gainNode.connect(context.destination);
  };

  // connectUI: Wire up all the events
  app.connectUI = function (node) {
    log('connectUI');

    var $node = this.$node = $(node);

    // Bind up the events!
    var $start = this.$start = $('#start');
    var $stop = this.$stop = $('#stop');
    var $waveform = this.$waveform = $('#waveform');
    var $volume = this.$volume = $('#volume');
    var $volumeValue = this.$volumeValue = $('#volume-value');
    var $frequency = this.$frequency = $('#frequency');
    var $frequencyValue = this.$frequencyValue = $('#frequency-value');

    $start.on('click', this.startOscillator.bind(this));
    $stop.on('click', this.stopOscillator.bind(this));
    $waveform.on('change', function(event){
      var value = this.value;
      var oscillator = app.oscillator;

      console.log('Changing waveform to %s', value);

      // If we have an oscillator, make adjustments
      if (oscillator){
        oscillator.type = oscillator[value];
      }

    });
    $volume.on('change', function(event){
      var value = this.value;
      console.log('Setting gain value to %s', value);
      app.gainNode.gain.value = value;
      $volumeValue.html(value);
    });
    $frequency.on('change', function(event){
      var value = this.value;
      var oscillator = app.oscillator;

      // Adjust values
      console.log('Setting frequency to %s', value);
      $frequencyValue.html(value);

      // If we have an oscillator, make adjustments directly
      if (oscillator) {
        oscillator.frequency.value = value;
      }
    });
  };

  // startOscillator: Create and start an oscillator playing
  app.startOscillator = function (event) {
    log('startOscillator');

    // If we received a DOM event, keep any defaults from happening
    if (event && event.preventDefault) { event.preventDefault(); }

    // Create an oscillator, hook it up to the gain, and start it
    var oscillator = this.oscillator = this.context.createOscillator();
    oscillator.type = oscillator[this.$waveform.val()];
    oscillator.frequency.value = this.$frequency.val();
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
