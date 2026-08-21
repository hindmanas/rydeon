const express = require('express');
const cors = require('cors');
require('dotenv').config();

const rideRoutes = require('./routes/rideRoutes');
const requestRoutes = require('./routes/requestRoutes');
const chatRoutes = require('./routes/chatRoutes');

const app = express();

// ✅ CORS configuration (better version)
app.use(cors({
    origin: [
        "http://localhost:5173", // local frontend (vite)
        "https://rydeon-bice.vercel.app" 
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Backend is running 🚀");
});

// Routes
app.use('/api/rides', rideRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/chat', chatRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});