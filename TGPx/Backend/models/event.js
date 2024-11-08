const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose); // Import the plugin

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  imageUrls: {
    type: [String],
    required: true,
  },
  eventNumber: {
    type: Number,
  },
  year: {
    type: Number,
  },
  month: {
    type: String,
  },
});

// Apply the auto-increment plugin to the `eventNumber` field
eventSchema.plugin(AutoIncrement, { inc_field: 'eventNumber' });

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;
