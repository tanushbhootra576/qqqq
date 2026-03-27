const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const Patient = require('./models/Patient');

const app = express();
const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/vitals-dashboard';

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('✅ Connected to MongoDB');
        initializeDatabase();
    })
    .catch(err => {
        console.error('❌ MongoDB connection error:', err.message);
    });

// Initialize DB
async function initializeDatabase() {
    try {
        const count = await Patient.countDocuments();
        if (count > 0) {
            console.log(`📊 DB already has ${count} patients`);
            return;
        }

        await Patient.create({
            patientId: 1,
            name: "Sensor Patient",
            status: "Stable",
            isSensorPatient: true,
            latestVitals: {},
            vitalsHistory: []
        });

        console.log("✅ Sensor patient created");
    } catch (err) {
        console.error("❌ DB init error:", err.message);
    }
}

//
// 🔥 POST VITALS (FIXED)
//
app.post('/api/vitals', async (req, res) => {
    console.log("📥 Incoming body:", req.body);

    const { heartRate, spO2, temperature, lat, lng } = req.body;

    // Validate
    if (
        heartRate === undefined ||
        spO2 === undefined ||
        temperature === undefined ||
        lat === undefined ||
        lng === undefined
    ) {
        console.log("❌ Missing fields");
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        let sensorPatient = await Patient.findOne({ isSensorPatient: true });

        // 🔥 AUTO FIX: create if missing
        if (!sensorPatient) {
            console.log("⚠️ No sensor patient → creating...");
            sensorPatient = new Patient({
                patientId: 1,
                name: "Sensor Patient",
                status: "Stable",
                isSensorPatient: true,
                vitalsHistory: []
            });
        }

        const newVitals = {
            heartRate,
            spO2,
            temperature,
            lat,
            lng,
            timestamp: new Date()
        };

        sensorPatient.latestVitals = newVitals;
        sensorPatient.vitalsHistory.push(newVitals);

        // Limit history
        if (sensorPatient.vitalsHistory.length > 100) {
            sensorPatient.vitalsHistory = sensorPatient.vitalsHistory.slice(-100);
        }

        await sensorPatient.save();

        console.log("✅ Saved vitals:", newVitals);

        res.json({
            success: true,
            data: newVitals
        });

    } catch (err) {
        console.error("❌ FULL ERROR:", err); // VERY IMPORTANT
        res.status(500).json({
            error: 'Error saving vitals',
            details: err.message
        });
    }
});

//
// GET VITALS
//
app.get('/api/vitals', async (req, res) => {
    try {
        const sensorPatient = await Patient.findOne({ isSensorPatient: true });

        if (!sensorPatient) {
            return res.status(404).json({ error: 'No sensor patient' });
        }

        res.json(sensorPatient.latestVitals || {});
    } catch (err) {
        console.error("❌ Fetch error:", err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//
// GET PATIENTS
//
app.get('/api/patients', async (req, res) => {
    try {
        const patients = await Patient.find();
        res.json(patients);
    } catch (err) {
        console.error("❌ Patients error:", err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//
// HEALTH
//
app.get('/health', (req, res) => {
    res.json({ status: 'OK' });
});

//
// START SERVER
//
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});