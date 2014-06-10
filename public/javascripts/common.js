var zoneInfos;
var infoEraser;
var io;

function globalInit() {
	// variables
	zoneInfos = document.getElementById('footer');

	//routines
	io = io.connect();

	//events
	io.on('disconnect', function () {
  		flashMessage('Le serveur est injoignable...');
	});

	io.on('info', function(data) {
		flashMessage(data.message);
	});
}

function flashMessage(message, timeout) {
	duration = typeof timeout === 'undefined' ? 5000 : timeout;
	clearTimeout(infoEraser);
	zoneInfos.innerHTML = message;
	infoEraser = setTimeout(function(){
		zoneInfos.innerHTML = '';
	}, duration);
}

function dispachEvent(data, route) {
	route = typeof route !== 'undefined' ? route : 'dispatcher';
	io.emit(route, data);
}