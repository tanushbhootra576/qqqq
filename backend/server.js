const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 4000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage for latest vitals
let latestVitals = {
    heartRate: 0,
    spO2: 0,
    temperature: 0,
    lat: 0,
    lng: 0,
    timestamp: null
};

// POST endpoint - Receive vitals from ESP32
app.post('/api/vitals', (req, res) => {
    const { heartRate, spO2, temperature, lat, lng } = req.body;

    // Validate incoming data
    if (heartRate === undefined || spO2 === undefined || temperature === undefined || lat === undefined || lng === undefined) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    // Update latest vitals
    latestVitals = {
        heartRate,
        spO2,
        temperature,
        lat,
        lng,
        timestamp: new Date().toISOString()
    };

    // Log to console
    console.log(`[${new Date().toLocaleTimeString()}] Vitals received:`, latestVitals);

    res.json({ success: true, message: 'Vitals received', data: latestVitals });
});

// GET endpoint - Return latest vitals to frontend
app.get('/api/vitals', (req, res) => {
    res.json(latestVitals);
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'Backend running' });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Backend server running on http://localhost:${PORT}`);
    console.log(`📡 Ready to receive data from ESP32 at POST http://localhost:${PORT}/api/vitals`);
    console.log(`📊 Frontend can fetch data from GET http://localhost:${PORT}/api/vitals`);
});
