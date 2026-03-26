const mongoose = require('mongoose');

const vitalSchema = new mongoose.Schema({
    heartRate: {
        type: Number,
        required: true
    },
    spO2: {
        type: Number,
        required: true
    },
    temperature: {
        type: Number,
        required: true
    },
    lat: {
        type: Number,
        required: true
    },
    lng: {
        type: Number,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const patientSchema = new mongoose.Schema({
    patientId: {
        type: Number,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Stable', 'Monitoring', 'Alert'],
        default: 'Monitoring'
    },
    isSensorPatient: {
        type: Boolean,
        default: false
    },
    latestVitals: vitalSchema,
    vitalsHistory: [vitalSchema],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Patient', patientSchema);
