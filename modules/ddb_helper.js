
const bluebird = require('bluebird');
const AWS = require('aws-sdk');

const config = require('./../config');
const table_schema = config.table_schema;

let ddb_client = null;
let ddb = null;

let createTable = function () {
	ddb.createTable(table_schema, (err, resp) => {
		if (!err) {
			console.log('table created successfully');
		} else {
			if (err && err.code === 'ResourceInUseException') {
				console.log('Table already exists..');
			} else {
				console.log('err creating table', err);
			}
		}
	});
};

module.exports = class DDBHelper {
	constructor () {
		let ddb_config = config.ddb_config[process.env.NODE_ENV] || config.ddb_config.DEFAULT;

		AWS.config.update(ddb_config);
		ddb_client = new AWS.DynamoDB.DocumentClient();
		ddb = new AWS.DynamoDB();
		createTable();
	}

	trackFiles (files) {

		let batchWriteAsync = bluebird.promisify(ddb_client.batchWrite, {
			context: ddb_client
		});

		let records = {};

		records[table_schema.TableName] = files.map(curr => {
			return {
				PutRequest: {
					Item: curr
				}
			};
		});

		return batchWriteAsync({
			RequestItems: records
		});
	}
}