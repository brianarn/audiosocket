// Tiny module to effectively shim AudioContext
define(function(){
	return window.AudioContext || window.webkitAudioContext;
});
