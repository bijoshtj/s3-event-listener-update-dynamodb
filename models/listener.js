

const AWS = require('aws-sdk');
const bluebird = require('bluebird');

const config = require('../config');
const S3Helper = require('./../modules/s3_helper');
const DDBHelper = require('./../modules/ddb_helper');

let s3_helper = null, ddb_helper = null;

class S3Listener {
	constructor () {
		s3_helper = new S3Helper();
		ddb_helper = new DDBHelper(AWS);
	}

	reload (s3_events) {
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

		/*return s3_helper.getFiles('ap-south-1', {
			Bucket: 'poc-bijoshtj',
			Prefix: 'bengaluru/2018/05/',
			Delimiter: '/',	
			MaxKeys: 1
		});*/
	}
}

module.exports = new S3Listener();