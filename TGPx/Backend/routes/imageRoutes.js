const express = require('express');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const Image = require('../models/image'); // Import the Image model
const router = express.Router();

// Cloudinary storage configuration
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'uploads',
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
});

const upload = multer({ storage: storage });

// Route to upload image
router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const image = new Image({ url: req.file.path });
    await image.save();
    res.status(201).send(image);
  } catch (error) {
    res.status(400).send({ error: 'Failed to upload image' });
  }
});

// Route to fetch images
router.get('/images', async (req, res) => {
  try {
    const images = await Image.find();
    res.status(200).send(images);
  } catch (error) {
    res.status(400).send({ error: 'Failed to fetch images' });
  }
});

module.exports = router;
