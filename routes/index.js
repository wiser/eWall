var pagesControllers = [];
var pagesMonitor = [];
for (var i=0; i<148; i++) {
	pagesControllers[i] = "'/images/pages/controller/PMAT_3395_PMAG-page" + (i + 1) + ".jpg'";
	pagesMonitor[i] = "'/images/pages/monitor/jpg/PMAT_3395_PMAG " + (i + 1) + ".jpeg'";
};

var nbPages = pagesControllers.length;
var nbDoublesPages = nbPages / 2 + 1;

exports.controller = function(req, res){
	res.render('controller', { 
		title: 'Mur numérique ('+nbPages+' pages)',
		pages: pagesControllers,
		nbPages: nbPages,
		nbDoublesPages: nbDoublesPages,
	});
};

exports.monitor = function(req, res){
	res.render('monitor', { 
		title: 'Mur numérique',
		pages: pagesMonitor,
		nbPages: nbPages,
		nbDoublesPages: nbDoublesPages,
	});
};