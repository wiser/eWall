var pages = [];
for (var i=0; i<56; i++) {
	pages[i] = "http://lorempixel.com/224/290/people?idx="+i;
};

exports.controller = function(req, res){
	res.render('controller', { 
		title: 'E-Wall',
		pages: pages
	});
};

exports.monitor = function(req, res){
	res.render('monitor', { 
		title: 'E-Wall', 
		nbPages: pages.length,
		nbDoublesPages: pages.length / 2 + 1,
		pages: pages 
	});
};