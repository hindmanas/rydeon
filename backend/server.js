const express = require('express');
const cors = require('cors');
require('dotenv').config();

const rideRoutes = require('./routes/rideRoutes');
const requestRoutes = require('./routes/requestRoutes');
const chatRoutes = require('./routes/chatRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/rides', rideRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/chat', chatRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
