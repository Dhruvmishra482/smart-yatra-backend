const cloudinary = require("cloudinary").v2;

exports.uploadImageToCloudinary = async (file, folder) => {
  try {
    const { options } = { folder };
    return await cloudinary.uploader.upload(file.tempFilePath, options);
  } catch (error) {
  
    throw error;
  }
};
