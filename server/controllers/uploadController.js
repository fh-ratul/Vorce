import asyncHandler from '../middleware/asyncHandler.js';

const uploadImages = asyncHandler(async (req, res) => {
  const images = (req.files || []).map((file) => `/uploads/${file.filename}`);
  res.status(201).json({ images });
});

export { uploadImages };
