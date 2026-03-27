const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
// Default to a local URI if env is missing
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/vitals-dashboard';

app.use(cors());
app.use(express.json());

// --- SCHEMA ---
const vitalsSchema = new mongoose.Schema({
    heartRate: Number,
    spO2: Number,
    temperature: Number,
    lat: Number,
    lng: Number,
    timestamp: { type: Date, default: Date.now }
});

const patientSchema = new mongoose.Schema({
    name: { type: String, default: "Default Patient" },
    isSensorPatient: { type: Boolean, default: false },
    latestVitals: vitalsSchema,
    vitalsHistory: [vitalsSchema]
});

const Patient = mongoose.model('Patient', patientSchema);

// --- DB CONNECTION ---
// Added serverSelectionTimeoutMS so it fails fast instead of buffering forever
mongoose.connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 5000
})
    .then(() => {
        console.log('✅ Connected to MongoDB');
        initializeDatabase();
    })
    .catch(err => console.error('❌ MongoDB Connection Error:', err.message));

async function initializeDatabase() {
    try {
        const count = await Patient.countDocuments();
        if (count === 0) {
            await Patient.create({
                name: "Primary Sensor Patient",
                isSensorPatient: true,
                vitalsHistory: []
            });
            console.log("✅ Initialized: Created first patient record.");
        }
    } catch (e) { console.log("Init check failed, DB likely disconnected."); }
}

// --- MASTER POST ROUTE ---
app.post('/api/vitals', async (req, res) => {
    console.log("📥 Data Received:", req.body);
    const { heartRate, spO2, temperature, lat, lng } = req.body;

    try {
        // FAIL-PROOF LOGIC:
        // 1. Try to find the designated sensor patient
        // 2. If not found, just grab the first patient in the database (Index 0)
        let patient = await Patient.findOne({ isSensorPatient: true });

        if (!patient) {
            patient = await Patient.findOne(); // Grab whatever is at Index 0
        }

        if (!patient) {
            return res.status(404).json({ error: 'No patients exist in DB to update' });
        }

        const newVitals = { heartRate, spO2, temperature, lat, lng, timestamp: new Date() };

        patient.latestVitals = newVitals;
        patient.vitalsHistory.push(newVitals);

        if (patient.vitalsHistory.length > 50) {
            patient.vitalsHistory = patient.vitalsHistory.slice(-50);
        }

        await patient.save();
        console.log(`✅ Data saved to patient: ${patient.name}`);
        res.json({ success: true, savedTo: patient.name });

    } catch (err) {
        console.error("❌ Save Error:", err.message);
        res.status(500).json({ error: 'Database Error', details: err.message });
    }
});

// --- GET ROUTE ---
app.get('/api/vitals', async (req, res) => {
    try {
        // Always try to show the latest data from the first available patient
        const patient = await Patient.findOne({ isSensorPatient: true }) || await Patient.findOne();
        if (!patient) return res.status(404).json({ error: 'No data found' });
        res.json(patient.latestVitals || {});
    } catch (err) {
        res.status(500).json({ error: 'Server Error' });
    }
});

app.get('/health', (req, res) => res.json({ status: 'Master Server Online' }));

app.listen(PORT, () => console.log(`🚀 Master Server on port ${PORT}`));