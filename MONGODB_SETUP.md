# MongoDB Setup Guide for Healthcare Dashboard

## Overview

The backend now uses MongoDB to store patient data with 3 patients:

1. **John Smith** (Patient ID: 1) - Real sensor data from ESP32
2. **Sarah Johnson** (Patient ID: 2) - Mock patient data
3. **Michael Chen** (Patient ID: 3) - Mock patient data with Alert status

## Installation Steps

### Option 1: Local MongoDB (Recommended for Development)

#### Windows

1. **Download MongoDB Community Edition**
   - Visit: https://www.mongodb.com/try/download/community
   - Download the Windows MSI installer
   - Run the installer and follow the setup wizard
   - Choose "Install MongoDB as a Service" during installation

2. **Verify Installation**

   ```powershell
   mongod --version
   ```

3. **Start MongoDB Service**
   - On Windows, MongoDB should start automatically as a service
   - Or start it manually:

   ```powershell
   mongod
   ```

4. **Connect to MongoDB**
   - MongoDB runs on `mongodb://localhost:27017` by default
   - This is already configured in `.env` file

#### Mac

```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

#### Linux (Ubuntu/Debian)

```bash
sudo apt-get install -y mongodb
sudo systemctl start mongodb
```

### Option 2: MongoDB Atlas (Cloud - Easiest)

1. **Create Free Cluster**
   - Go to https://www.mongodb.com/cloud/atlas
   - Sign up for free account
   - Create a free tier cluster

2. **Get Connection String**
   - Click "Connect" on your cluster
   - Choose "Drivers"
   - Copy the connection string
   - Replace `<password>` with your database password

3. **Update .env File**
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/vitals-dashboard?retryWrites=true&w=majority
   ```

## Backend Setup

### 1. Update .env file

```
MONGODB_URI=mongodb://localhost:27017/vitals-dashboard
PORT=4000
NODE_ENV=development
```

### 2. Install Dependencies

```bash
cd d:\qqqq\backend
npm install
```

### 3. Start Backend Server

```bash
npm run dev
```

You should see:

```
✅ Connected to MongoDB
✅ Database initialized with 3 sample patients (1 sensor + 2 mock)
🚀 Backend server running on http://localhost:4000
```

## API Endpoints

### Get All Patients

```
GET /api/patients
```

Returns all 3 patients with their full data

### Get Specific Patient

```
GET /api/patients/:patientId
```

Example: `GET /api/patients/1` - Gets John Smith's data

### Get Latest Vitals (Sensor Patient)

```
GET /api/vitals
```

Returns the latest vitals from the sensor patient

### Update Patient (ESP32 Sensor Data)

```
POST /api/vitals
Body: {
  "heartRate": 75,
  "spO2": 98,
  "temperature": 36.8,
  "lat": 40.7128,
  "lng": -74.0060
}
```

### Update Patient Status

```
PUT /api/patients/:patientId/status
Body: {
  "status": "Stable" | "Monitoring" | "Alert"
}
```

## Frontend Configuration

The frontend automatically fetches:

- All patients for Hospital Management dashboard: `GET /api/patients`
- Vitals for Doctor dashboard: `GET /api/vitals`

**Update the API URLs** in `frontend/src/App.jsx` if using a different backend URL:

```javascript
// Change these URLs:
https://qqqq-yiqg.onrender.com/api/patients
https://qqqq-yiqg.onrender.com/api/vitals
```

## Database Structure

### Patient Document

```javascript
{
  patientId: Number,
  name: String,
  status: "Stable" | "Monitoring" | "Alert",
  isSensorPatient: Boolean,
  latestVitals: {
    heartRate: Number,
    spO2: Number,
    temperature: Number,
    lat: Number,
    lng: Number,
    timestamp: Date
  },
  vitalsHistory: [Vitals],
  createdAt: Date,
  updatedAt: Date
}
```

## Data Features

### Patient 1: John Smith (Sensor Data)

- Real-time data from ESP32 sensor
- Updates every 2 seconds from the Arduino device
- Stores up to 100 vitals in history
- Location tracking enabled

### Patient 2: Sarah Johnson (Mock)

- Static mock data
- Status: Monitoring
- Can be used for testing without sensor

### Patient 3: Michael Chen (Mock)

- Static mock data
- Status: Alert (emergency scenario)
- Higher heart rate and temperature values

## Troubleshooting

### MongoDB Connection Error

```
Error: connect ECONNREFUSED 127.0.0.1:27017
```

**Solution**: Make sure MongoDB is running

```powershell
# Windows
mongod

# Mac/Linux
brew services start mongodb-community
```

### Module Not Found: mongoose

```
Error: Cannot find module 'mongoose'
```

**Solution**: Install dependencies

```bash
npm install mongoose dotenv
```

### Port Already in Use

If port 4000 is already in use, change it in `.env`:

```
PORT=5000
```

### Database Not Initializing

- Delete the database and restart:
  ```bash
  mongo  # or mongosh
  use vitals-dashboard
  db.patients.deleteMany({})
  ```
- Restart the backend server

## Testing with MongoDB

### Test via curl

```bash
# Get all patients
curl http://localhost:4000/api/patients

# Get specific patient
curl http://localhost:4000/api/patients/1

# Send vitals from ESP32
curl -X POST http://localhost:4000/api/vitals \
  -H "Content-Type: application/json" \
  -d '{"heartRate":75,"spO2":98,"temperature":36.8,"lat":40.7128,"lng":-74.0060}'
```

### View Database in MongoDB Compass

1. Download MongoDB Compass: https://www.mongodb.com/products/compass
2. Connect to: `mongodb://localhost:27017`
3. Navigate to `vitals-dashboard` database
4. View `patients` collection

## Next Steps

1. Start MongoDB service
2. Start backend server: `npm run dev` in `/backend`
3. Start frontend server: `npm run dev` in `/frontend`
4. Access dashboard at: `http://localhost:5175`
5. Hospital Management shows all 3 patients from MongoDB
6. Doctor Dashboard shows sensor patient's real data
