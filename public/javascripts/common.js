var zoneInfos;
var infoEraser;
var io;
var planche;
var mediaBaseUrl = 'http://wwg-svmapppsbx1.siege.la.priv/filestore/';

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

	io.on('PAGES_UPDATE', function(data) {
		handlePagesUpdate(data);
	})

	io.on('RESET', function(data) {
		window.location.reload();
	})
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

function getActualDisplayMode() {
	if (planche.className.indexOf("horizontal") >= 0) {
		return "horizontal";
	} else if (planche.className.indexOf("cdf") >= 0) {
		return "cdf";
	} else {
		throw "Unknown display mode";
	}
}

function determinePagePreview(layout, page, rendition) {
	switch (rendition) {
		case 'thumbnail':
			var renditionId = 1;
			break;
		case 'preview':
			var renditionId = 2;
			break;
		case 'output':
			var renditionId = 3;
			break;
	}
	var directory = '/';
	var directoryId = page.ParentLayoutId;
	while (directoryId % 100 != directoryId) {
		directory += Math.floor(directoryId / 100) + '/';
		directoryId = directoryId % 100;
	}

	return mediaBaseUrl + directory + page.ParentLayoutId + '-page' + page.PageNumber + '-' + renditionId + '.v' + layout.Version;
}