window.onload = init;
window.onresize = function() {
	resizeItems(pages, 100);
}

var container;

function init() {
	globalInit();
	// variables declaration
	container = document.getElementById('pagesContainer');
	// var pages = document.getElementsByClassName('page');

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

	io.on('PAGE_RESIZING', function(data) {
		resizeItems(pages, data.value);
	});

	io.on('SCROLL_TO_PAGE_ID', function(data) {
		scrollTo(data.value);
	});

	io.on('SCROLL_TO_OFFSET', function(data) {
		// on traduit le pourcentage de la longueur du div moins la partie affichée en offset absolu de scroll
		percentScroll = data.value;
		maximumScrollOffset = container.scrollWidth - container.offsetWidth;
		container.scrollLeft =  percentScroll * maximumScrollOffset / 100;
	});

	// addEventListener("click", function() {
	// 	if (document.webkitIsFullScreen) {
	// 		document.webkitExitFullscreen();
	// 	} else {
	//     	// document.documentElement.webkitRequestFullScreen(document.documentElement);
	//     	container.webkitRequestFullScreen(container);
	// 	}
	// });
}

function resizeItems(items, height) {
	for (var i = 0; i < items.length; i++) {	
    	items[i].style.height = height + '%';
	}
}

function scrollTo(pageId) {
	var pages = document.getElementsByClassName('highlight');
	for (var i = pages.length - 1; i >= 0; i--) {
		pages[i].className = pages[i].className.replace('highlight', '');
	};
	var page = document.getElementById(pageId);
	container.scrollLeft = page.offsetLeft;
	page.className += ' highlight';
	flashMessage('Vous affichez actuellement la '+pageId);
}