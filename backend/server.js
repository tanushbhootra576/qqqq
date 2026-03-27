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
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log('✅ Connected to MongoDB');
        initializeDatabase();
    })
    .catch(err => {
        console.error('❌ MongoDB connection error:', err);
        console.log('Continuing without MongoDB...');
    });

// Initialize database with sample patients
async function initializeDatabase() {
    try {
        // Check if patients already exist
        const existingPatients = await Patient.countDocuments();
        if (existingPatients > 0) {
            console.log(`📊 Database already initialized with ${existingPatients} patients`);
            return;
        }

        // Create sample patients
        const patients = [
            {
                patientId: 1,
                name: 'John Smith',
                status: 'Stable',
                isSensorPatient: true,
                latestVitals: {
                    heartRate: 72,
                    spO2: 98,
                    temperature: 36.8,
                    lat: 40.7128,
                    lng: -74.0060,
                    timestamp: new Date()
                },
                vitalsHistory: Array.from({ length: 24 }, (_, i) => ({
                    heartRate: 70 + Math.random() * 20,
                    spO2: 96 + Math.random() * 4,
                    temperature: 36.5 + Math.random() * 1,
                    lat: 40.7128 + (Math.random() - 0.5) * 0.01,
                    lng: -74.0060 + (Math.random() - 0.5) * 0.01,
                    timestamp: new Date(Date.now() - i * 3600000)
                }))
            },
            {
                patientId: 2,
                name: 'Sarah Johnson',
                status: 'Monitoring',
                isSensorPatient: false,
                latestVitals: {
                    heartRate: 85,
                    spO2: 97,
                    temperature: 37.2,
                    lat: 40.7580,
                    lng: -73.9855,
                    timestamp: new Date()
                },
                vitalsHistory: Array.from({ length: 24 }, (_, i) => ({
                    heartRate: 80 + Math.random() * 15,
                    spO2: 95 + Math.random() * 5,
                    temperature: 37 + Math.random() * 0.8,
                    lat: 40.7580 + (Math.random() - 0.5) * 0.01,
                    lng: -73.9855 + (Math.random() - 0.5) * 0.01,
                    timestamp: new Date(Date.now() - i * 3600000)
                }))
            },
            {
                patientId: 3,
                name: 'Michael Chen',
                status: 'Alert',
                isSensorPatient: false,
                latestVitals: {
                    heartRate: 105,
                    spO2: 94,
                    temperature: 38.1,
                    lat: 40.7614,
                    lng: -73.9776,
                    timestamp: new Date()
                },
                vitalsHistory: Array.from({ length: 24 }, (_, i) => ({
                    heartRate: 100 + Math.random() * 20,
                    spO2: 92 + Math.random() * 6,
                    temperature: 37.8 + Math.random() * 1.2,
                    lat: 40.7614 + (Math.random() - 0.5) * 0.01,
                    lng: -73.9776 + (Math.random() - 0.5) * 0.01,
                    timestamp: new Date(Date.now() - i * 3600000)
                }))
            }
        ];

        await Patient.insertMany(patients);
        console.log('✅ Database initialized with 3 sample patients (1 sensor + 2 mock)');
    } catch (err) {
        console.error('Error initializing database:', err);
    }
}

// POST endpoint - Receive vitals from ESP32
app.post('/api/vitals', async (req, res) => {
    const { heartRate, spO2, temperature, lat, lng } = req.body;
    console.log(`[${new Date().toLocaleTimeString()}] Received vitals:`, req.body);

    // Validate incoming data
    if (heartRate === undefined || spO2 === undefined || temperature === undefined || lat === undefined || lng === undefined) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        // Update sensor patient (patient with ID 1)
        const sensorPatient = await Patient.findOne({ isSensorPatient: true });

        if (sensorPatient) {
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

            // Keep only last 100 vitals in history
            if (sensorPatient.vitalsHistory.length > 100) {
                sensorPatient.vitalsHistory = sensorPatient.vitalsHistory.slice(-100);
            }

            sensorPatient.updatedAt = new Date();
            await sensorPatient.save();

            console.log(`[${new Date().toLocaleTimeString()}] Vitals received for ${sensorPatient.name}:`, newVitals);
            res.json({ success: true, message: 'Vitals received', data: newVitals });
        } else {
            res.status(404).json({ error: 'Sensor patient not found' });
        }
    } catch (err) {
        console.error('Error saving vitals:', err);
        res.status(500).json({ error: 'Error saving vitals' });
    }
});

// GET endpoint - Return latest vitals
app.get('/api/vitals', async (req, res) => {
    console.log(`[${new Date().toLocaleTimeString()}] GET /api/vitals called`);
    try {
        const sensorPatient = await Patient.findOne({ isSensorPatient: true });
        if (sensorPatient) {
            res.json(sensorPatient.latestVitals);
        } else {
            res.status(404).json({ error: 'Sensor patient not found' });
        }
    } catch (err) {
        console.error('Error fetching vitals:', err);
        res.status(500).json({ error: 'Error fetching vitals' });
    }
});

// GET endpoint - Get all patients
app.get('/api/patients', async (req, res) => {
    console.log(`[${new Date().toLocaleTimeString()}] GET /api/patients called`);
    try {
        const patients = await Patient.find();
        res.json(patients);
    } catch (err) {
        console.error('Error fetching patients:', err);
        console.log('Error fetching patients:', err);
        res.status(500).json({ error: 'Error fetching patients  klmklkk' });
    }
});

// GET endpoint - Get specific patientsss
app.get('/api/patients/:patientId', async (req, res) => {
    console.log(`[${new Date().toLocaleTimeString()}] GET /api/patients/${req.params.patientId} called`);
    try {
        const patient = await Patient.findOne({ patientId: parseInt(req.params.patientId) });
        if (patient) {
            res.json(patient);
        } else {
            res.status(404).json({ error: 'Patient not found' });
        }
    } catch (err) {
        console.error('Error fetching patient:', err);
        res.status(500).json({ error: 'Error fetching patient' });
    }
});

// PUT endpoint - Update patient status
app.put('/api/patients/:patientId/status', async (req, res) => {
    try {
        const { status } = req.body;
        const patient = await Patient.findOneAndUpdate(
            { patientId: parseInt(req.params.patientId) },
            { status, updatedAt: new Date() },
            { new: true }
        );
        if (patient) {
            res.json(patient);
        } else {
            res.status(404).json({ error: 'Patient not found' });
        }
    } catch (err) {
        console.error('Error updating patient:', err);
        res.status(500).json({ error: 'Error updating patient' });
    }
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
    console.log(`👥 Get all patients from GET http://localhost:${PORT}/api/patients`);
});
