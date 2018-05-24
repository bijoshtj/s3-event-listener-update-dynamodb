

const AWS = require('aws-sdk');
const bluebird = require('bluebird');

const config = require('../config');
const S3Helper = require('./../modules/s3_helper');
const DDBHelper = require('./../modules/ddb_helper');

let s3_helper = null, ddb_helper = null;

let getS3Objects = function (s3_events) {
	let events_async = [];

	s3_events && s3_events.Records.forEach(curr_evt => {
		if (curr_evt.eventSource === config.s3_event_id) {
			let s3_obj = curr_evt.s3 || {};
			let bucket_obj = s3_obj.bucket || {};
			let bucket_name = bucket_obj.name;
			let param = Object.assign({
					Bucket: bucket_name
				}, config.s3_list_params);

			events_async.push(s3_helper.getFiles(curr_evt.awsRegion, param));
		}
	});

	return bluebird.reduce(events_async, (final_arr, curr) => {
			return final_arr.concat(curr);
		}, []);
};

let updateDb = function (obj_arr) {
	let final_list = [];


	obj_arr.forEach(curr => {
		let date = new Date(curr.LastModified);

		final_list.push({
			obj_id: curr.Key,
		    last_updated: date.getTime()
		});
	});

	return ddb_helper.trackFiles(final_list)
		.return(true);
};

class S3Listener {
	constructor () {
		s3_helper = new S3Helper();
		ddb_helper = new DDBHelper();
	}

	reload (s3_events) {
		return getS3Objects(s3_events)
			.then(updateDb);
	}
}

module.exports = new S3Listener();