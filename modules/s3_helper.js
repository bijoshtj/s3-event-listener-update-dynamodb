
const bluebird = require('bluebird');
const AWS = require('aws-sdk');

let s3_obj_list = {};
let getS3Obj = function (region) {

	if (!s3_obj_list[region]) {
		AWS.config.update({
			region: region
		});

		s3_obj_list[region] = new AWS.S3();
	}

	return s3_obj_list[region];
};

let	getAllFiles = function (region, params) {
	let s3_obj = getS3Obj(region);
	let listObjAsync = bluebird.promisify(s3_obj.listObjects, {
		context: s3_obj
	});

	return listObjAsync(params);
};

module.exports = class S3Helper {

	async getFiles (region, params) {
		let result = [];
		let fetch_next = false;

        try {
			do {
				//console.log('fetch...');
				let curr_res = await getAllFiles(region, params);
				//console.log(curr_res);

				result = result.concat(curr_res.Contents);

				fetch_next = curr_res.IsTruncated && curr_res.NextMarker;
				if (fetch_next) {
					params.Marker = curr_res.NextMarker
				}
			} while (fetch_next)
		} catch (ex) {
			throw ex;
		}

		return result;
	}
}