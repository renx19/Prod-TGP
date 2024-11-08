const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./db');
const userRoutes = require('./routes/auth');

const cors = require('cors');
const cookieParser = require('cookie-parser');
const ProtectedRoutes = require('./routes/protectedRoutes')
const MemberRoutes = require('./routes/memberRoutes')
const ImageRoutes = require('./routes/imageRoutes')
const ResetRoutes = require('./routes/resetPass')
const EventRoutes = require('./routes/Event');
const FinancialRoutes = require('./routes/EventFInanical');

const cloudinary = require('cloudinary').v2;

// Load environment variables from .env file
dotenv.config();

// Create an instance of Express
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: [
        'http://localhost:5173',
        'https://prod-tgp.vercel.app', ,
        'https://prod-k32smv5iq-renx19s-projects.vercel.app' // Add this origin
    ],
    credentials: true
}));


// Connect to MongoDB
connectDB();

// Use user routes
app.use('/', userRoutes);
app.use('/', ProtectedRoutes);
app.use('/', MemberRoutes);
app.use('/', ImageRoutes);
app.use('/', ResetRoutes);
app.use('/', EventRoutes);
app.use('/', FinancialRoutes);



// Define a simple route
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});