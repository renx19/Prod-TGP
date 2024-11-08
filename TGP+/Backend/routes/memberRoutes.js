const express = require('express');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const Member = require('../models/members');
const User = require('../models/users');
const { checkUser, checkMember } = require('../middleware/checkUserMw');
const mongoose = require('mongoose');
const { verifyRole } = require('../middleware/verifyRoleMw');
const router = express.Router();

// Cloudinary storage configuration
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'member_images', // Use a common folder for member images
        allowed_formats: ['jpg', 'jpeg', 'png'],
    },
});

const upload = multer({ storage: storage });

// Route for uploading images
router.post('/upload-image', upload.single('image'), async(req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Image is required.' });
        }

        const result = await cloudinary.uploader.upload(req.file.path);
        const imageUrl = result.secure_url;

        res.status(201).json({ imageUrl });
    } catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
});

// Member creation endpoint
router.post('/members', async(req, res) => {
    try {
        const {
            user,
            fullName,
            address = '',
            phoneNumber = '',
            batchName = '',
            dateOfIR = '',
            sponsorName = '',
            gt = '',
            mww = '',
            almaMater = '',
            birthday = '',
            status = 'active',
            gender,
            alexisName,
            imageUrl // Expecting the image URL to be passed in the request body
        } = req.body;

        if (!imageUrl) {
            return res.status(400).json({ error: 'Image URL is required.' });
        }

        const memberData = {
            user,
            fullName,
            address,
            phoneNumber,
            batchName,
            dateOfIR,
            sponsorName,
            gt,
            mww,
            almaMater,
            birthday,
            status,
            imageUrl,
            alexisName,
            gender,
        };

        const newMember = new Member(memberData);
        await newMember.save();
        res.status(201).json(newMember);
    } catch (error) {
        console.error('Error creating member:', error);
        res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
});

// Route to get member details by userId
router.get('/member/:userId', async(req, res) => {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ error: 'Invalid user ID format.' });
    }

    try {
        // Check if the user is an admin
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // If the user is an admin, you can return admin-specific data or a success response
        if (user.role === 'admin') {
            // Assuming you want to return a specific admin response or all members
            const members = await Member.find(); // Fetch all members if necessary
            return res.json({ admin: true, members }); // or return any admin-specific data
        }

        // Proceed to find member by userId
        const member = await Member.findOne({ user: userId });
        if (!member) {
            return res.status(404).json({ error: 'No member found for this user' });
        }

        res.json(member);
    } catch (error) {
        console.error('Error fetching member:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Fetch member details by member ID for admins
router.get('/member/details/:memberId', async(req, res) => {
    const { memberId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(memberId)) {
        return res.status(400).json({ error: 'Invalid member ID format.' });
    }

    try {
        const member = await Member.findById(memberId).populate('user'); // Populate user details

        if (!member) {
            return res.status(404).json({ error: 'Member not found' });
        }

        res.json(member);
    } catch (error) {
        console.error('Error fetching member:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// Admin Update of Member Details
router.put('/admin/member/:memberId', async(req, res) => {
    const { memberId } = req.params;

    // Validate the member ID format
    if (!mongoose.Types.ObjectId.isValid(memberId)) {
        return res.status(400).json({ error: 'Invalid member ID format.' });
    }

    // Destructure fields from the request body
    const {
        fullName,
        address,
        phoneNumber,
        birthday,
        imageUrl,
        status,
        batchName,
        dateOfIR,
        sponsorName,
        GT,
        MWW,
        almaMater,
        alexisName,
        gender,
    } = req.body;

    // Prepare the update data for the member
    const updateMemberData = {
        ...(fullName && { fullName }),
        ...(address && { address }),
        ...(phoneNumber && { phoneNumber }),
        ...(birthday && { birthday }),
        ...(imageUrl && { imageUrl }),
        ...(status && { status }),
        ...(batchName && { batchName }),
        ...(dateOfIR && { dateOfIR }),
        ...(sponsorName && { sponsorName }),
        ...(GT && { GT }),
        ...(MWW && { MWW }),
        ...(almaMater && { almaMater }),
        ...(alexisName && { alexisName }),
        ...(gender && { gender }),
    };

    try {
        // Update member details by memberId
        const updatedMember = await Member.findByIdAndUpdate(
            memberId,
            updateMemberData, { new: true, runValidators: true }
        );

        if (!updatedMember) {
            return res.status(404).json({ error: 'Member not found for the provided member ID.' });
        }

        // Return the updated member data
        res.json({
            member: updatedMember
        });
    } catch (error) {
        console.error('Error updating member:', error);
        res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
});




// Admin Update of User
router.put('/admin/user/:userId', async(req, res) => {
    const { userId } = req.params;

    // Validate the user ID format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ error: 'Invalid user ID format.' });
    }

    // Destructure fields from the request body
    const {
        username,
        email,
    } = req.body;

    // Prepare the update data for user
    const updateUserData = {
        ...(username && { username }),
        ...(email && { email }),
    };

    try {
        // Update user details
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updateUserData, { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Return the updated user data
        res.json({
            user: updatedUser
        });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
});


// User Update of Member Details
router.put('/user/member/:userId', async(req, res) => {
    const { userId } = req.params;

    // Validate the user ID format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ error: 'Invalid user ID format.' });
    }

    // Destructure fields from the request body
    const {
        fullName,
        phoneNumber,
        address, // You can restrict the fields users can update
    } = req.body;

    // Prepare the update data for the member
    const updateMemberData = {
        ...(fullName && { fullName }),
        ...(phoneNumber && { phoneNumber }),
        ...(address && { address }),
    };

    try {
        // Update member details by userId
        const updatedMember = await Member.findOneAndUpdate({ user: userId }, // Assuming `user` is the field referencing the user ID in the Member model
            updateMemberData, { new: true, runValidators: true }
        );

        if (!updatedMember) {
            return res.status(404).json({ error: 'Member not found for the provided user ID.' });
        }

        // Return the updated member data
        res.json({
            member: updatedMember
        });
    } catch (error) {
        console.error('Error updating member:', error);
        res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
});




// Delete member by member ID for admins
router.delete('/member/:userId', async(req, res) => {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ error: 'Invalid member ID format.' });
    }

    try {
        const member = await Member.findByIdAndDelete(userId);

        if (!member) {
            return res.status(404).json({ error: 'Member not found' });
        }

        res.json({ message: 'Member deleted successfully' });
    } catch (error) {
        console.error('Error deleting member:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});









// Route to fetch all members
router.get('/members', async(req, res) => {
    try {
        const members = await Member.find().populate('user');
        res.json(members);
    } catch (error) {
        console.error('Error fetching members:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



// Route to fetch available users
router.get('/available-users', async(req, res) => {
    try {
        const [users, members] = await Promise.all([User.find(), Member.find()]);
        const memberUserIds = new Set(members.map(member => member.user.toString()));

        const availableUsers = users.filter(
            user => !memberUserIds.has(user._id.toString()) && user.role !== 'admin'
        );

        res.json(availableUsers);
    } catch (error) {
        console.error('Error fetching available users:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;