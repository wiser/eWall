var pageRatio = Math.round(290 / 224 * 100) / 100; //1,29

window.onload = init;
window.onresize = function() {
	// resizeItems(pages, 100);
}

var container, doublesPagesContainers;

function init() {
	globalInit();
	// variables declaration
	container = document.getElementById('planche');
	doublesPagesContainers = document.getElementsByClassName('doublePagesContainer');

	// setInterval(function(){
	// 	if (container.offsetWidth + container.scrollLeft == container.scrollWidth) {
	// 		container.scrollLeft = 0;
	// 	} else {
	// 		container.scrollLeft += 1;
	// 	}
	// }, 50);

	//events
	io.on('connect', function() {
		io.emit('new_monitor');
	})

	io.on('CHANGE_DISPLAY_MODE', function(data) {
		flashMessage('Changement de mode pour : ' + data.value);
		switch (data.value) {
			case 'cdf':
				container.className = container.className.replace('horizontal', 'cdfMode');
				break;
			case 'horizontal':
				container.className = container.className.replace('cdfMode', 'horizontal');
				break;
		}	
	});

	io.on('PAGE_RESIZING', function(data) {
		flashMessage('Zooming...');
		var actualScrollInPercent = getActualScrollInPercent();
		resizePages(doublesPagesContainers, data.value);
		scrollToPercent(actualScrollInPercent);
	});

	io.on('SCROLL_TO_PAGE_ID', function(data) {
		scrollToPage(data.value);
	});

	io.on('SCROLL_TO_PERCENT', function(data) {
		// on traduit le pourcentage de la longueur de la planche moins la partie affichée en offset absolu de scroll
		flashMessage('Scrolling...');
		scrollToPercent(data.value);
	});
}

function resizePages(items, percent) {
	// La valeur reçue varie entre 1 et ...
	// Pour obtenir une valeur absolue on détermine que 1 unité vaut 100px
	var height = percent * 50;
	for (var i = 0; i < items.length; i++) {	
    	items[i].style.height = height + 'px';
    	items[i].style.minWidth = Math.ceil(height / pageRatio) * 2 + 'px';
	}
}

function scrollToPercent(percent) {
	var displayMode = getActualDisplayMode();
	switch (displayMode) {
		case "horizontal":
			maximumScrollOffset = container.scrollWidth - container.offsetWidth;
			container.scrollLeft =  percent * maximumScrollOffset / 100;
			break;
		case "cdf":
			maximumScrollOffset = container.scrollHeight - container.offsetHeight;
			container.scrollTop =  percent * maximumScrollOffset / 100;
			break;
		default:
			throw "Unknown mode";
	}
}

function scrollToPage(pageId) {
	var pages = document.getElementsByClassName('highlight');
	for (var i = pages.length - 1; i >= 0; i--) {
		pages[i].className = pages[i].className.replace('highlight', '');
	};
	var page = document.getElementById(pageId);
	// On va amener la page ciblée au centre de l'écran
	var displayMode = getActualDisplayMode();
	switch (displayMode) {
		case "horizontal":
			container.scrollLeft = page.offsetLeft - container.offsetWidth / 2 + page.offsetWidth / 2;
			break;
		case "cdf":
			container.scrollTop = page.offsetTop - container.offsetHeight / 2 + page.offsetHeight / 2;
			break;
		default:
			throw "Unknown mode";
	}
	page.className += ' highlight';
	flashMessage('Vous affichez actuellement la '+pageId);
}

function getActualDisplayMode() {
	if (container.className.indexOf("horizontal") >= 0) {
		return "horizontal";
	} else if (container.className.indexOf("cdf") >= 0) {
		return "cdf";
	} else {
		throw "Unknown mode";
	}
}

function getActualScrollInPercent() {
	var displayMode = getActualDisplayMode();
	switch (displayMode) {
		case "horizontal":
				var maximumScrollOffset = container.scrollWidth - container.offsetWidth;
				var percentScroll = container.scrollLeft * 100 / maximumScrollOffset;
			break;
		case "cdf":
			var maximumScrollOffset = container.scrollHeight - container.offsetHeight;
			var percentScroll = container.scrollTop * 100 / maximumScrollOffset;
			break;
		default:
			throw "Unknown mode";
	}

	return percentScroll;
}