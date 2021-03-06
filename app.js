// process.env.NODE_ENV = 'production';

/**
 * Module dependencies.
 */
var express = require('express.io');
var http = require('http');
var path = require('path');
var app = express();
var routes = require('./routes');
var woodwing = require('./services/woodwing');

var remoteController = {};
var refreshInterval = 15; //temps en seconde

app.http().io();

// environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon(path.join(__dirname, 'public', 'images', 'favicon.png')));
if ('development' == app.get('env')) {
	app.use(express.logger('dev'));
	app.use(express.errorHandler());
}
app.use(express.json());
app.use(express.urlencoded());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
	res.sendfile(path.join(__dirname, '/views/index.html'));
});
app.get('/controller', routes.controller);
app.get('/monitor', routes.monitor);

app.io.route('new_controller', function(req) {
	req.io.leave('monitors');
	if (Object.keys(remoteController).length > 0) {
		remoteController.emit('info', {
			message: 'Vous n\'êtes plus identifié en tant que "télécommande"...'
    	});
	}
	remoteController = req.socket;
    remoteController.emit('info', {
        message: 'Vous êtes identifié en tant que "télécommande" et il y a '+app.io.sockets.clients('monitors').length+' moniteur(s) a votre écoute'
    });
    req.io.room('monitors').broadcast('info', {
  		message : 'Il y a une nouvelle "télécommande"'
	});
});

app.io.route('new_monitor', function(req) {
	if (req.socket === remoteController) {
		remoteController = {}
	}
	req.io.join('monitors');
	req.io.emit('info', {
		message: 'Vous êtes identifié en tant que "moniteur"'
	});
	if (Object.keys(remoteController).length > 0) {
		remoteController.emit('info', {
			message: 'Un nouveau moniteur vient de se connecter, il y en a maintenant '+app.io.sockets.clients('monitors').length
		});
	}
});

app.io.route('disconnect', function(req) {
	if (req.socket === remoteController) {
  		remoteController = {};
  		req.io.room('monitors').broadcast('info', {
  			message : 'Il n\'y a plus de "télécommande"...'
  		});
  	}
  	if (("/monitors" in app.io.sockets.manager.roomClients[req.socket.id])) {
  		if (Object.keys(remoteController).length > 0) {
  			remoteController.emit('info', {
				message: 'Un moniteur vient de se déconnecter, il y en a maintenant '+(app.io.sockets.clients('monitors').length - 1)
			});
  		}
  	};
});

app.io.route('dispatcher', function(req) {
	if (req.socket === remoteController) {
		if (app.io.sockets.clients('monitors').length === 0) {		
			req.io.emit('info', {
				message: 'Il n\' y a aucun moniteur connecté...'
			});
		} else {
			// console.log('dispaching', req.data.action, req.data.value);
			req.io.room('monitors').broadcast(req.data.action, req.data);
		}
	} else {
		req.io.emit('info', {
			message: 'Vous n\'êtes pas reconnu en tant que télécommande !!'
		});
	}
});

setInterval(refreshPages, refreshInterval * 1000);

function refreshPages() {
	woodwing.getPages()
	.then(
		function(pagesInfos){
			app.io.sockets.emit('PAGES_UPDATE', {
				layouts: pagesInfos.layoutObject,
				pages: pagesInfos.pages
			});
		}
	).catch(function(error) {
		console.log(error);
		if (Object.keys(remoteController).length > 0) {
		remoteController.emit('info', {
			message: error
		});
	}
	});
}

app.listen(app.get('port'), function(){
  console.log('Express.io server listening on port ' + app.get('port'));
});