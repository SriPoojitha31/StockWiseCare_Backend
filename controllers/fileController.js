import cloudinary from '../cloudinary/cloudinary.js';

export const uploadImage = async (req, res, next) => {
  try {
    const file = req.files.image;
    const result = await cloudinary.uploader.upload(file.tempFilePath);
    res.status(200).json({ url: result.secure_url });
  } catch (err) {
    next(err);
  }
};
