const s3 = require('../config/s3');

const uploadToS3 = async (file) => {
  const params = {
    Bucket: process.env.AWS_BUCKET,
    Key: Date.now().toString() + "-" + file.originalname,
    Body: file.buffer,
    ContentType: file.mimetype
  };

  const data = await s3.upload(params).promise();
  return data.Location;
};

module.exports = uploadToS3;