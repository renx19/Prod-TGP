const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const Event = require('../models/event'); // Adjust the path to your event model
const { verifyRole } = require('../middleware/verifyRoleMw'); // Import your verifyRole middleware
require('dotenv').config();

// Multer storage configuration for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'event_images', // Use a common folder for event images
    allowed_formats: ['jpg', 'jpeg', 'png'],
  },
});

// Multer configuration for multiple image uploads
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 4 * 1024 * 1024, // 4 MB limit per file
  },
}).array('images'); // Handle multiple images

// Route for uploading images (protected for admin users)
router.post('/upload-images', upload, async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'At least one image is required.' });
    }

    const imageUrls = await Promise.all(req.files.map(async (file) => {
      const result = await cloudinary.uploader.upload(file.path);
      return result.secure_url; // Return the secure URL of the uploaded image
    }));

    // Respond with the image URLs
    res.status(201).json({ imageUrls });
  } catch (error) {
    console.error('Error uploading images:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});

// Event creation endpoint (protected for admin users)
router.post('/create-event', async (req, res) => {
  try {
    const { title, description, imageUrls, year, month } = req.body; // Expecting an array of image URLs to be passed in the request body

    if (!title || !description || !imageUrls || !Array.isArray(imageUrls) || imageUrls.length === 0) {
      return res.status(400).json({ error: 'Title, description, and at least one image URL are required.' });
    }

    // Create new event with title, description, and image URLs
    const newEvent = new Event({
      title,
      description,
      imageUrls, // Store the array of image URLs in the images field
      year,
      month
    });

    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});

// Fetch all events (can be public or protected based on your requirements)
router.get('/events', async (req, res) => {
  try {
    const events = await Event.find(); // Fetch all events from the database
    res.status(200).json(events); // Respond with the list of events
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});

// Route for fetching a specific event by ID (can also be protected if necessary)
router.get('/events/:id', async (req, res) => {
  try {
    const { id } = req.params; // Extract the event ID from the request parameters
    const event = await Event.findById(id); // Fetch the event by ID

    if (!event) {
      return res.status(404).json({ error: 'Event not found' }); // Handle case where event does not exist
    }

    res.status(200).json(event); // Respond with the event details
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});

// Fetch all event titles
router.get('/event-titles', async (req, res) => {
  try {
    const events = await Event.find({}, { title: 1, _id: 0 }); // Fetch only the title field
    const titles = events.map(event => event.title); // Extract titles from the events
    res.status(200).json(titles); // Respond with the list of titles
  } catch (error) {
    console.error('Error fetching event titles:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});

// Export the router
module.exports = router;
