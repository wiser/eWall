var zoneInfos;
var infoEraser;
var io;
var planche;

function globalInit() {
	//variables
	planche = document.getElementById('planche');
	zoneInfos = document.getElementById('infosArea');

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

function getActualDisplayMode() {
	if (planche.className.indexOf("horizontal") >= 0) {
		return "horizontal";
	} else if (planche.className.indexOf("cdf") >= 0) {
		return "cdf";
	} else {
		throw "Unknown display mode";
	}
}

function dispachEvent(data, route) {
	route = typeof route !== 'undefined' ? route : 'dispatcher';
	io.emit(route, data);
}