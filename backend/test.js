// Change this to your actual Render URL
const URL = "https://qqqq-vs3j.onrender.com/api/vitals";

async function sendVitals() {
    const data = {
        heartRate: +(70 + Math.random() * 30).toFixed(1),
        spO2: +(95 + Math.random() * 5).toFixed(1),
        temperature: 36.5,
        lat: 1.3521,
        lng: 103.8198
    };

    console.log("⏳ Pushing to:", URL);

    try {
        const response = await fetch(URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        if (response.ok) {
            console.log("✅ Success:", result);
        } else {
            console.log("⚠️ Server rejected data:", result);
        }
    } catch (error) {
        console.error("❌ Network/Fetch Error:", error.message);
    }
    console.log("--------------------------------------------------");
}

setInterval(sendVitals, 3000);
sendVitals();