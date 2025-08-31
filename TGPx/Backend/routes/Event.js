const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const Event = require('../models/event');
require('dotenv').config();

// Configure Cloudinary storage for multer
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'event_images',
        allowed_formats: ['jpg', 'jpeg', 'png'],
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 4 * 1024 * 1024 },
}).array('images');

// CREATE event with images
router.post('/create-event', upload, async(req, res) => {
    try {
        const { title, description, year, month } = req.body;
        if (!title || !description || !req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'All fields including at least one image are required.' });
        }

        const imageUrls = await Promise.all(req.files.map(file => cloudinary.uploader.upload(file.path).then(res => res.secure_url)));

        const newEvent = new Event({ title, description, imageUrls, year, month });
        await newEvent.save();
        res.status(201).json(newEvent);
    } catch (error) {
        console.error('Error creating event:', error);
        res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
});

// READ: Get all events
router.get('/events', async(req, res) => {
    try {
        const events = await Event.find();
        res.status(200).json(events);
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
});

// READ: Get single event by ID
router.get('/events/:id', async(req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ error: 'Event not found' });
        res.status(200).json(event);
    } catch (error) {
        console.error('Error fetching event:', error);
        res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
});

// UPDATE event by ID (optionally replace images)
router.put('/events/:id', upload, async(req, res) => {
    try {
        const { title, description, year, month } = req.body;
        const updates = { title, description, year, month };

        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ error: 'Event not found' });

        if (req.files && req.files.length > 0) {
            const imageUrls = await Promise.all(
                req.files.map(file => cloudinary.uploader.upload(file.path).then(res => res.secure_url))
            );
            updates.imageUrls = imageUrls;
        } else if (req.body.imageUrls) {
            // Preserve existing imageUrls if no new images uploaded
            updates.imageUrls = Array.isArray(req.body.imageUrls) ?
                req.body.imageUrls :
                [req.body.imageUrls];
        }

        const updatedEvent = await Event.findByIdAndUpdate(req.params.id, updates, { new: true });
        res.status(200).json(updatedEvent);
    } catch (error) {
        console.error('Error updating event:', error);
        res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
});

// DELETE event by ID
router.delete('/events/:id', async(req, res) => {
    try {
        const deletedEvent = await Event.findByIdAndDelete(req.params.id);
        if (!deletedEvent) return res.status(404).json({ error: 'Event not found' });
        res.status(200).json({ message: 'Event deleted successfully' });
    } catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
});

// GET only event titles
router.get('/event-titles', async(req, res) => {
    try {
        const events = await Event.find({}, { title: 1, _id: 0 });
        const titles = events.map(event => event.title);
        res.status(200).json(titles);
    } catch (error) {
        console.error('Error fetching event titles:', error);
        res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
});

module.exports = router;