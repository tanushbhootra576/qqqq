const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/vitals-dashboard';

// Middleware
app.use(cors());
app.use(express.json());

// ================================================
// 1. DATABASE SCHEMA & MODEL (All in one place)
// ================================================
const vitalsSchema = new mongoose.Schema({
    heartRate: Number,
    spO2: Number,
    temperature: Number,
    lat: Number,
    lng: Number,
    timestamp: { type: Date, default: Date.now }
});

const patientSchema = new mongoose.Schema({
    patientId: Number,
    name: String,
    status: String,
    isSensorPatient: Boolean,
    latestVitals: vitalsSchema,
    vitalsHistory: [vitalsSchema],
    updatedAt: { type: Date, default: Date.now }
});

const Patient = mongoose.model('Patient', patientSchema);

// ================================================
// 2. MONGODB CONNECTION & INIT
// ================================================
mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('✅ Connected to MongoDB');
        initializeDatabase();
    })
    .catch(err => {
        console.error('❌ MongoDB connection error:', err.message);
    });

async function initializeDatabase() {
    try {
        // This safely checks if the sensor patient exists. 
        // If not, it creates it. If it does, it does nothing. (No duplicates!)
        await Patient.findOneAndUpdate(
            { isSensorPatient: true },
            {
                $setOnInsert: {
                    patientId: 1,
                    name: "ESP32 Sensor Patient",
                    status: "Stable",
                    isSensorPatient: true,
                    latestVitals: {},
                    vitalsHistory: []
                }
            },
            { upsert: true, new: true }
        );
        console.log("✅ Sensor Patient ready in database!");
    } catch (err) {
        console.error("❌ DB init error:", err.message);
    }
}

// ================================================
// 3. API ROUTES (Matches your Arduino exactly)
// ================================================

// 🔥 POST: Receive Vitals from ESP32
app.post('/api/vitals', async (req, res) => {
    console.log("📥 Incoming ESP32 data:", req.body);

    const { heartRate, spO2, temperature, lat, lng } = req.body;

    // Validate incoming data matches Arduino payload
    if (heartRate === undefined || spO2 === undefined || temperature === undefined || lat === undefined || lng === undefined) {
        console.log("❌ Missing fields in payload");
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const sensorPatient = await Patient.findOne({ isSensorPatient: true });

        if (!sensorPatient) {
            return res.status(404).json({ error: 'Sensor patient not found' });
        }

        const newVitals = {
            heartRate,
            spO2,
            temperature,
            lat,
            lng,
            timestamp: new Date()
        };

        // Update latest and history
        sensorPatient.latestVitals = newVitals;
        sensorPatient.vitalsHistory.push(newVitals);

        // Keep only last 100 readings to save space
        if (sensorPatient.vitalsHistory.length > 100) {
            sensorPatient.vitalsHistory = sensorPatient.vitalsHistory.slice(-100);
        }
        sensorPatient.updatedAt = new Date();

        await sensorPatient.save();
        console.log("✅ Saved vitals successfully!");

        res.json({ success: true, data: newVitals });

    } catch (err) {
        console.error("❌ FULL ERROR:", err);
        res.status(500).json({ error: 'Error saving vitals', details: err.message });
    }
});

// 🔍 GET: Return latest vitals for dashboard
app.get('/api/vitals', async (req, res) => {
    try {
        const sensorPatient = await Patient.findOne({ isSensorPatient: true });
        if (!sensorPatient) return res.status(404).json({ error: 'No sensor patient' });

        res.json(sensorPatient.latestVitals || {});
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// 👥 GET: Get all patients
app.get('/api/patients', async (req, res) => {
    try {
        const patients = await Patient.find();
        res.json(patients);
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// 🩺 GET: Health check
app.get('/health', (req, res) => {
    res.json({ status: 'Backend running perfectly' });
});

// ================================================
// 4. START SERVER
// ================================================
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});