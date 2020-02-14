const AWS = require('aws-sdk');
// Enter copied or downloaded access ID and secret key here
const ID = '';
const SECRET = '';
const BUCKET_NAME = 'tesb23423413244212sfdas23sdaf';
const s3 = new AWS.S3({
	accessKeyId: ID,
	secretAccessKey: SECRET,
});

const params = {
	Bucket: BUCKET_NAME,
	CreateBucketConfiguration: {
		// Set your region here
		LocationConstraint: 'ap-southeast-1',
	},
};

s3.createBucket(params, function(err, data) {
	if (err) {
		console.log(err, err.stack);
	} else {
		console.log('Bucket Created Successfully', data.Location);
	}
});
