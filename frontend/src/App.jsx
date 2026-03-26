import React, { useState, useEffect } from 'react';

function App() {
    const [vitals, setVitals] = useState({
        heartRate: '-',
        spO2: '-',
        temperature: '-',
        lat: '-',
        lng: '-',
        timestamp: null
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchVitals = async () => {
            try {
                const response = await fetch('http://localhost:4000/api/vitals');
                if (!response.ok) {
                    throw new Error('Failed to fetch vitals');
                }
                const data = await response.json();
                setVitals(data);
                setLoading(false);
                setError(null);
            } catch (err) {
                console.error('Error fetching vitals:', err);
                setError(err.message);
                setLoading(false);
            }
        };

        // Fetch immediately
        fetchVitals();

        // Auto-refresh every 2 seconds
        const interval = setInterval(fetchVitals, 2000);

        // Cleanup interval on unmount
        return () => clearInterval(interval);
    }, []);

    const styles = {
        container: {
            maxWidth: '1000px',
            margin: '0 auto',
            padding: '40px 20px',
        },
        header: {
            textAlign: 'center',
            marginBottom: '40px',
            color: '#333',
        },
        title: {
            fontSize: '32px',
            fontWeight: 'bold',
            marginBottom: '10px',
        },
        subtitle: {
            fontSize: '16px',
            color: '#666',
        },
        grid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px',
            marginBottom: '30px',
        },
        card: {
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '25px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            textAlign: 'center',
        },
        label: {
            fontSize: '14px',
            color: '#666',
            marginBottom: '10px',
            fontWeight: '500',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
        },
        value: {
            fontSize: '36px',
            fontWeight: 'bold',
            color: '#0066cc',
            marginBottom: '5px',
        },
        unit: {
            fontSize: '14px',
            color: '#999',
            marginTop: '5px',
        },
        location: {
            grid: {
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '20px',
            },
            title: {
                gridColumn: '1 / -1',
                fontSize: '18px',
                fontWeight: 'bold',
                color: '#333',
                marginTop: '30px',
                marginBottom: '15px',
            },
        },
        timestamp: {
            textAlign: 'center',
            marginTop: '20px',
            fontSize: '12px',
            color: '#999',
        },
        loading: {
            textAlign: 'center',
            padding: '40px',
            fontSize: '18px',
            color: '#666',
        },
        error: {
            backgroundColor: '#fff3cd',
            color: '#856404',
            padding: '15px',
            borderRadius: '4px',
            marginBottom: '20px',
            textAlign: 'center',
        },
        statusBadge: {
            display: 'inline-block',
            padding: '8px 16px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: 'bold',
            marginTop: '10px',
        },
        statusConnected: {
            backgroundColor: '#d4edda',
            color: '#155724',
        },
        statusDisconnected: {
            backgroundColor: '#f8d7da',
            color: '#721c24',
        },
    };

    const isDataReceived = vitals.timestamp !== null;

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.title}>❤️ Vitals Dashboard</h1>
                <p style={styles.subtitle}>Real-time health metrics from ESP32</p>
                <div style={{
                    ...styles.statusBadge,
                    ...(isDataReceived ? styles.statusConnected : styles.statusDisconnected)
                }}>
                    {isDataReceived ? '🟢 Connected' : '🔴 No Data Yet'}
                </div>
            </div>

            {error && (
                <div style={styles.error}>
                    ⚠️ Error: {error}
                </div>
            )}

            {loading && !isDataReceived ? (
                <div style={styles.loading}>Loading vitals...</div>
            ) : (
                <>
                    <div style={styles.grid}>
                        <div style={styles.card}>
                            <div style={styles.label}>Heart Rate</div>
                            <div style={styles.value}>{vitals.heartRate}</div>
                            <div style={styles.unit}>BPM</div>
                        </div>

                        <div style={styles.card}>
                            <div style={styles.label}>SpO2</div>
                            <div style={styles.value}>{vitals.spO2}</div>
                            <div style={styles.unit}>%</div>
                        </div>

                        <div style={styles.card}>
                            <div style={styles.label}>Temperature</div>
                            <div style={styles.value}>{vitals.temperature}</div>
                            <div style={styles.unit}>°C</div>
                        </div>
                    </div>

                    <div style={styles.location.title}>📍 Location</div>
                    <div style={styles.location.grid}>
                        <div style={styles.card}>
                            <div style={styles.label}>Latitude</div>
                            <div style={styles.value}>{typeof vitals.lat === 'number' ? vitals.lat.toFixed(4) : vitals.lat}</div>
                        </div>

                        <div style={styles.card}>
                            <div style={styles.label}>Longitude</div>
                            <div style={styles.value}>{typeof vitals.lng === 'number' ? vitals.lng.toFixed(4) : vitals.lng}</div>
                        </div>
                    </div>

                    {vitals.timestamp && (
                        <div style={styles.timestamp}>
                            Last updated: {new Date(vitals.timestamp).toLocaleTimeString()}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default App;
