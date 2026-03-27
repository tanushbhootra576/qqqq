const URL = "https://qqqq-yiqg.onrender.com/api/vitals";

function generateVitals() {
    return {
        heartRate: Math.floor(65 + Math.random() * 40),
        spO2: Math.floor(94 + Math.random() * 6),
        temperature: +(36 + Math.random() * 2).toFixed(1),
        lat: 1.3521,
        lng: 103.8198
    };
}

async function sendVitals() {
    const data = generateVitals();

    console.log("⏳ Sending...", data); // IMPORTANT DEBUG LINE

    try {
        const response = await fetch(URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        console.log("✅ Response:", result);
        console.log("--------------------------------------------------");

    } catch (error) {
        console.error("❌ Error:", error.message);
    }
}

// RUN IT (IMPORTANT)
setInterval(sendVitals, 3000);

// ALSO CALL ONCE IMMEDIATELY
sendVitals();