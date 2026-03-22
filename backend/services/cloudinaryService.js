const cloudinary = require('../config/cloudinary');

const uploadToCloudinary = async (file) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { resource_type: "auto" },
      (error, result) => {
        if (error) reject(error);
        else resolve({ url: result.secure_url, bytes: result.bytes });
      }
    ).end(file.buffer);
  });
};

module.exports = uploadToCloudinary;