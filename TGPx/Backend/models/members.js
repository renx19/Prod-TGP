const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose); // Import mongoose-sequence

const { Schema } = mongoose;

const memberSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId, // Reference to User model
        ref: 'User',
        required: true, // Ensures a member must be associated with a user
        unique: true, // Ensures one member per user
    },
    fullName: {
        type: String,
        required: true, // Required field
    },
    address: {
        type: String,
    },
    phoneNumber: {
        type: String,
    },
    batchName: {
        type: String,
        enum: [
            'Pandemic',
            'Ranpandapan',
            'Armagedon',
            'Formula',
            'Litard',
            'Putahi',
            'Celophane',
            '1987 Constitution'
        ],
        required: true // Optional: makes the field required
    },
    dateOfIR: {
        type: Date,
    },
    sponsorName: {
        type: String,
    },
    gt: {
        type: String,
    },
    mww: {
        type: String,
    },
    almaMater: {
        type: String,
    },
    birthday: {
        type: Date,
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive', 'Suspended'], // Example statuses
        default: 'Active',
    },
    memberNumber: {
        type: Number, // The auto-incremented member number
        unique: true, // Ensure it's unique
    },
    imageUrl: {
        type: String,
        required: true, // Make imageUrl required
    },
    alexisName: { // New field added
        type: String, // Adjust type as needed
        required: false, // Optional: set to true if you want to make it required
    },
    gender: { // New gender field added
        type: String,
        enum: ['Male', 'Female', 'Non-Binary', ], // Updated to include Non-Binary
        required: false, // Optional: set to true if you want to make it required
    },
}, { timestamps: true }); // Adds createdAt and updatedAt fields automatically

// Auto-increment plugin to handle memberNumber increment
memberSchema.plugin(AutoIncrement, { inc_field: 'memberNumber' });

module.exports = mongoose.model('Member', memberSchema);