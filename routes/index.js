var pages = [];

for (var i=1; i <= 128; i++) {
	pages.push("page-"+i+".jpeg");
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
		pages: pages 
	});
};