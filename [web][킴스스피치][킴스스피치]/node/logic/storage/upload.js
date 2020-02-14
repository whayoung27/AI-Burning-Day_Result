const fs = require("fs");
const AWS = require("aws-sdk");

const ID = "";
const SECRET = "";
const BUCKET_NAME = "kims-speech";
const s3 = new AWS.S3({
  accessKeyId: ID,
  secretAccessKey: SECRET
});
const uploadFile = (fileName, callback) => {
  // Read content from the file
  const fileContent = fs.readFileSync(fileName);
  var fileNameToSaveAs = "house_2.png";
  // Setting up S3 upload parameters
  const params = {
    Bucket: BUCKET_NAME,
    Key: fileNameToSaveAs,
    Body: fileContent
  };

  // Uploading files to the bucket
  s3.upload(params, function(err, data) {
    if (err) {
      throw err;
    }
    console.log(`File uploaded successfully. ${data.Location}`);

    console.log("File uploaded successfully.");
    console.log(`${data.Location}`);
    var dataLocationUrl = data.Location;
    return callback(dataLocationUrl);
  });

  // delete db
};
var uploadReturn = uploadFile("./house.png", function(dataLocationUrl) {
  return dataLocationUrl;
});

console.info("#################");
console.info("#################");
console.info("#################");
console.info(uploadReturn);
