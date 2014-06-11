var pages = [];
for (var i=0; i<148; i++) {
	pages[i] = "http://lorempixel.com/224/290/people?idx="+i;
};

var nbPages = pages.length;
var nbDoublesPages = nbPages / 2 + 1;

exports.controller = function(req, res){
	res.render('controller', { 
		title: 'Mur de production ('+nbPages+' pages)',
		pages: pages,
		nbPages: nbPages,
		nbDoublesPages: nbDoublesPages,
	});
};

exports.monitor = function(req, res){
	res.render('monitor', { 
		title: 'Mur de production ('+nbPages+' pages)',
		pages: pages,
		nbPages: nbPages,
		nbDoublesPages: nbDoublesPages,
	});
};