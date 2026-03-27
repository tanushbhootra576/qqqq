const URL = "http://localhost:5000/api/vitals"; // Switch to your Render URL when deploying

function generateVitals() {
    return {
        heartRate: +(65 + Math.random() * 40).toFixed(1), // Matches ESP32 float format
        spO2: +(94 + Math.random() * 6).toFixed(1),
        temperature: 36.5, // Matches ESP32 hardcoded value
        lat: 1.3521,
        lng: 103.8198
    };
}

async function sendVitals() {
    const data = generateVitals();
    console.log("⏳ Sending payload...", data);

    try {
        const response = await fetch(URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        console.log("✅ Server Response:", result);
        console.log("--------------------------------------------------");
    } catch (error) {
        console.error("❌ Error connecting to server:", error.message);
    }
}

// Run immediately, then every 3 seconds
sendVitals();
setInterval(sendVitals, 3000);