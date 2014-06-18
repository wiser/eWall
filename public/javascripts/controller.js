window.onload = init;

function init() {
	globalInit();
	// variables declaration
	var pages = document.getElementsByClassName('pageContainer');
	var imageResizer = document.getElementById('resizer');
	var scrollerInput = document.getElementById('scroller');
	var smoothScroller = document.getElementById('smoothScroll');
	var modeSwitcher = document.getElementById('modeSwitcher');
	var resetMonitor = document.getElementById('resetMonitor');

	//events
	io.on('connect', function() {
		io.emit('new_controller');
	});

	smoothScroller.onchange = function(e) {
		if (this.checked) {
			planche.className += ' smoothScroll';
		} else {
			planche.className = planche.className.replace('smoothScroll', '');
		}
	}

	modeSwitcher.onchange = function(e) {
		if (this.checked) {
			dispachEvent(
				{
					action: 'CHANGE_DISPLAY_MODE',
					value: 'cdf'
				}
			);
		} else {
			dispachEvent(
				{
					action: 'CHANGE_DISPLAY_MODE',
					value: 'horizontal'
				}
			);
		}
	}

	planche.onscroll = function(e) {
		// on traduit l'offset absolu du scroll en pourcentage de la longueur du div moins la partie affichée
		var maximumScrollOffset = planche.scrollWidth - planche.offsetWidth;
		var percentScroll = planche.scrollLeft * 100 / maximumScrollOffset;
		flashMessage('Défilement à ' + parseInt(percentScroll) + '%');
		dispachEvent(
			{
				action: 'SCROLL_TO_PERCENT',
				value: percentScroll
			}
		);
		// On repercute la valeur du scroll sur le slider
		scroller.value = percentScroll;
	};

	scroller.oninput = function(e) {
		flashMessage('Défilement à ' + this.value + '%');
		scrollToPercent(this.value);
	}

	imageResizer.oninput = function(e) {
		var valueinPercent = this.value  * 100 / this.max;
		flashMessage('Zoom à ' + valueinPercent + '%');
		dispachEvent(
			{
				action: 'PAGE_RESIZING',
				value: this.value
			}
		);
	}

	resetMonitor.onclick = function(e) {
		dispachEvent(
			{
				action: 'RESET'
			}
		)
	}

	for (var i = pages.length - 1; i >= 0; i--) {
		pages[i].onclick = function() {
			dispachEvent(
				{
					action: 'SCROLL_TO_PAGE_ID',
					value: this.id
				}
			);
		}
	};
}

function scrollToPercent(percent) {
	var maximumScrollOffset = planche.scrollWidth - planche.offsetWidth;
	planche.scrollLeft =  percent * maximumScrollOffset / 100;
}

function pinch(e) {
	dispachEvent(
		{
			action: 'SCALE',
			value: e.scale
		}
	);
}

function handlePagesUpdate(data) {
	var layout = data.layout;
	var pages = data.pages;
	var updatedFolios = [];
	for (var i = pages.PageObjects.length - 1; i >= 0; i--) {
		var page = pages.PageObjects[i];
		var pagePreview = determinePagePreview(layout, page, 'thumbnail');
		var actualPage = document.getElementById('page_'+page.PageNumber);
		if (actualPage && page) {
			var actualBackgroundUrl = actualPage.style.backgroundImage;
			if (actualBackgroundUrl.indexOf(pagePreview) < 0 ) {
				//nouvelle image !!
				actualPage.style.backgroundImage = 'url('+pagePreview+')';
				updatedFolios.push(page.PageNumber);
			};
		};
		if (updatedFolios.length > 0) {
			flashMessage('Folios mis à jour : ' + updatedFolios.sort().join(', '));
		};
	};
}