var pages = [];

pages.push("page-0.jpeg");
for (var i=1; i <= 128; i++) {
	pages.push("page-"+i+".jpeg");
};
pages.push("page-"+i+".jpeg");

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
		pages: pages 
	});
};