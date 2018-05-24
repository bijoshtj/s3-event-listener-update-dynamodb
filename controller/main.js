const s3_listener = require('./../models/listener')

module.exports = function (req, resp, callback) {
	console.log(req.body);

	s3_listener.reload(req.body)
		.then(result => {
			resp.jsonp({result: result});
		})
		.catch(err => {
			resp.status(500).jsonp({error: 'error occured'});
		});
	//resp.send("req body is: " + JSON.stringify(req.body));
};