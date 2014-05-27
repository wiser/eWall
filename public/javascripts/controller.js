window.onload = init;

function init() {
	globalInit();
	// variables declaration
	var imageResizer = document.getElementById('resizer');
	var imageScroller = document.getElementById('staticPagesContainer');
	var imageScrollers = document.getElementsByClassName('scroller');

	//events
	io.on('connect', function() {
		io.emit('new_controller');
	});

	// imageScroller.ontouchmove = function(e) {
	// 	// on traduit l'offset absolu du scroll en pourcentage de la longueur du div moins la partie affichée
	// 	maximumScrollOffset = imageScroller.scrollWidth - imageScroller.offsetWidth;
	// 	percentScroll = imageScroller.scrollLeft * 100 / maximumScrollOffset;
	// 	dispachEvent(
	// 		{
	// 			action: 'SCROLL_TO_OFFSET',
	// 			value: percentScroll
	// 		}
	// 	);
	// };

	imageScroller.onscroll = function(e) {
		// on traduit l'offset absolu du scroll en pourcentage de la longueur du div moins la partie affichée
		maximumScrollOffset = imageScroller.scrollWidth - imageScroller.offsetWidth;
		percentScroll = imageScroller.scrollLeft * 100 / maximumScrollOffset;
		dispachEvent(
			{
				action: 'SCROLL_TO_OFFSET',
				value: percentScroll
			}
		);
	};

	imageResizer.oninput = function(e) {
		dispachEvent(
			{
				action: 'PAGE_RESIZING',
				value: this.value
			}
		);
	}

	for (var i = imageScrollers.length - 1; i >= 0; i--) {
		imageScrollers[i].onclick = function() {
			dispachEvent(
				{
					action: 'SCROLL_TO_PAGE_ID',
					value: this.hash.substring(1)
				}
			);
		}
	};
}

function pinch(e) {
	dispachEvent(
		{
			action: 'SCALE',
			value: e.scale
		}
	);
}