module.exports = {
	server_port: 3000,
	dynamo_db_table: 'poc_bijosh_s3_event_ec2',
	accepted_events: [],
	s3_event_id: 'aws:s3',
	s3_list_params: {
		Prefix: 'bengaluru/2018/05/',
		Delimiter: '/'
	},
	ddb_config: {
		DEFAULT: {
			endpoint: 'http://localhost:8000',
			region: 'mumbai'
		},
		PRODUCTION: {
			region: 'ap-south-1'
		}
	},
	table_schema: {
		TableName: 'poc_bijosh_s3_event_ec2',
		KeySchema: [
            {
                AttributeName: 'obj_id',
                KeyType: 'HASH'
            }, {
                AttributeName: 'last_updated',
                KeyType: 'RANGE'
            }
        ],
        AttributeDefinitions: [
            {
                AttributeName: 'last_updated',
                AttributeType: 'N'
            },
            {
                AttributeName: 'obj_id',
                AttributeType: 'S'
            }
        ],
        ProvisionedThroughput: {
            ReadCapacityUnits: 10,
            WriteCapacityUnits: 10
        }
	}
};