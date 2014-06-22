var qHttp = require('q-io/http');
var woodwingEndpoint = "http://wwg-svmapppsbx1.siege.la.priv/Enterprise/index.php?protocol=JSON";

exports.getPages = function() {
	return getTicket()
	.then(
		function(ticket){
			var bodyPagesInfosRequest = JSON.stringify(
				{
					method: "GetPagesInfo",
					params: [{
						Ticket: ticket,
						Issue: {
							__classname__: "Issue",
							Id: 6
						},
						IDs: {},
						Edition: {
							__classname__: "Edition",
							Id: 4
						}
					}],
					id: 1
				}
			);

			return qHttp.request({
				url : woodwingEndpoint,
				method : "post",
				headers: {
					"Content-Type": "application/json"
				},
				body: [bodyPagesInfosRequest]
			}).then(
				function(resp) {
					return resp.body.read();
				}
			).then(
				function(body) {
					body = JSON.parse(body);
						//LogOff
					var bodyLogOffRequest = JSON.stringify(
						{
							method: "LogOff",
							params: [{
								Ticket: ticket
							}]
						}
					);

					qHttp.request({
						url : woodwingEndpoint,
						method : "post",
						headers: {
							"Content-Type": "application/json"
						},
						body: [bodyLogOffRequest]
					});

						// on ne retourne que la première et seule layout et édition
					return {
						layoutObject: body.result.LayoutObjects,
						pages: body.result.EditionsPages[0]
					};
				}
			).catch(function(error) {
				throw 'Code erreur : '+ error.code +' lors de l\'appel : ' + error.syscall;
			});
		}
	);
}

var getTicket = function() {
	var bodyTicketRequest = JSON.stringify(
		{
			method: "LogOn",
			params: [{
				User: "murnumerique",
				Password: "walle",
				ClientName: "NodeJs",
				ClientAppName: "io/http",
				ClientAppVersion: "9.2.1 Build 186",
				RequestTicket: true				
			}],
			id: 0
		}
	);

	return qHttp.request({
		url : woodwingEndpoint,
		method : "post",
		headers: {
			"Content-Type": "application/json"
		},
		body: [bodyTicketRequest]
	}).then(
		function(resp){
			return resp.body.read();
		}
	).then(
		function(body){
			return JSON.parse(body).result.Ticket;
		}
	).catch(function(error) {
		switch (error.code) {
			case 'ENOTFOUND':
				throw 'Le serveur Woodwing est introuvable, vérifier l\'url et l\'état du serveur';
			break;
			default:
				throw 'Code erreur : '+ error.code +' lors de l\'appel : ' + error.syscall;
		}
	});
}