const bluebird = require('bluebird');

module.exports = class DDBHelper {
	constructor () {

	}

	updateTable (files) {
		return bluebird.resolve(true);
	}
}