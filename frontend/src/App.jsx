import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { HospitalIcon, DoctorIcon, BuildingIcon, CriticalIcon, WarningIcon, TrendUpIcon, TrendDownIcon, StableIcon, UpArrowIcon, DownArrowIcon, LungsIcon, ThermometerIcon, SensorIcon, BackArrowIcon, ConnectedDotIcon, MapIcon, LocationPinIcon, ClockIcon, AmbulanceIcon, HeartIcon } from './svgComponents.jsx';

// Custom hook for responsive design
function useResponsive() {
    const [screenSize, setScreenSize] = useState({
        width: typeof window !== 'undefined' ? window.innerWidth : 1024,
        isMobile: typeof window !== 'undefined' ? window.innerWidth < 640 : false,
        isTablet: typeof window !== 'undefined' ? window.innerWidth >= 640 && window.innerWidth < 1024 : false,
        isDesktop: typeof window !== 'undefined' ? window.innerWidth >= 1024 : true,
    });

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            setScreenSize({
                width,
                isMobile: width < 640,
                isTablet: width >= 640 && width < 1024,
                isDesktop: width >= 1024,
            });
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return screenSize;
}

// Mock ECG Data Generator
const generateECGData = () => {
    const data = [];
    for (let i = 0; i < 500; i++) {
        data.push({
            time: i,
            voltage: 1 + 0.5 * Math.sin(i * 0.1) + 0.3 * Math.sin(i * 0.05) + Math.random() * 0.1
        });
    }
    return data;
};

// Generate mock HR/SpO2 history (will be updated with real sensor data)
const generateVitalsHistory = () => {
    const data = [];
    for (let i = 0; i < 24; i++) {
        data.push({
            hour: `${i}:00`,
            heartRate: 70 + Math.random() * 20,
            spO2: 96 + Math.random() * 4
        });
    }
    return data;
};

function LandingPage({ onNavigate }) {
    const responsive = useResponsive();

    const styles = {
        container: {
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: responsive.isMobile ? '15px' : '20px',
        },
        content: {
            textAlign: 'center',
            color: 'white',
            width: '100%',
            maxWidth: responsive.isMobile ? '100%' : responsive.isTablet ? '600px' : '900px',
        },
        title: {
            fontSize: responsive.isMobile ? '28px' : responsive.isTablet ? '36px' : '48px',
            fontWeight: 'bold',
            marginBottom: responsive.isMobile ? '15px' : '20px',
        },
        subtitle: {
            fontSize: responsive.isMobile ? '14px' : responsive.isTablet ? '16px' : '20px',
            marginBottom: responsive.isMobile ? '30px' : '50px',
            opacity: 0.9,
        },
        buttonsGrid: {
            display: 'grid',
            gridTemplateColumns: responsive.isMobile ? '1fr' : 'repeat(2, 1fr)',
            gap: responsive.isMobile ? '15px' : '30px',
            width: '100%',
        },
        button: {
            padding: responsive.isMobile ? '25px 20px' : responsive.isTablet ? '30px 25px' : '40px 30px',
            border: 'none',
            borderRadius: '12px',
            fontSize: responsive.isMobile ? '16px' : responsive.isTablet ? '17px' : '18px',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'transform 0.3s, box-shadow 0.3s',
            color: 'white',
            minHeight: '44px',
        },
        doctorBtn: {
            backgroundColor: '#4CAF50',
        },
        hospitalBtn: {
            backgroundColor: '#2196F3',
        },
        buttonHover: {
            transform: 'translateY(-5px)',
            boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
        },
        icon: {
            fontSize: responsive.isMobile ? '30px' : '40px',
            marginBottom: responsive.isMobile ? '10px' : '15px',
            display: 'block',
        },
        description: {
            fontSize: responsive.isMobile ? '12px' : '14px',
            marginTop: responsive.isMobile ? '8px' : '10px',
            opacity: 0.9,
        },
    };

    const [hoverDoctor, setHoverDoctor] = useState(false);
    const [hoverHospital, setHoverHospital] = useState(false);

    return (
        <div style={styles.container}>
            <div style={styles.content}>
                <h1 style={styles.title}><HospitalIcon size={32} color="#e74c3c" /> Healthcare Monitoring System</h1>
                <p style={styles.subtitle}>Select your role to access the dashboard</p>

                <div style={styles.buttonsGrid}>
                    <button
                        style={{
                            ...styles.button,
                            ...styles.doctorBtn,
                            ...(hoverDoctor ? styles.buttonHover : {}),
                        }}
                        onMouseEnter={() => setHoverDoctor(true)}
                        onMouseLeave={() => setHoverDoctor(false)}
                        onClick={() => onNavigate('doctor')}
                    >
                        <span style={styles.icon}><DoctorIcon size={40} color="#333" /></span>
                        <div>Doctor Dashboard</div>
                        <div style={styles.description}>
                            View patient vitals in real-time
                        </div>
                    </button>

                    <button
                        style={{
                            ...styles.button,
                            ...styles.hospitalBtn,
                            ...(hoverHospital ? styles.buttonHover : {}),
                        }}
                        onMouseEnter={() => setHoverHospital(true)}
                        onMouseLeave={() => setHoverHospital(false)}
                        onClick={() => onNavigate('hospital')}
                    >
                        <span style={styles.icon}><BuildingIcon size={40} color="#333" /></span>
                        <div>Hospital Management</div>
                        <div style={styles.description}>
                            Manage patients and monitor systems
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
}

function DoctorDashboard({ onBack }) {
    const responsive = useResponsive();

    const [vitals, setVitals] = useState({
        heartRate: 75,
        spO2: 98,
        temperature: 36.8,
        lat: 40.7128,
        lng: -74.0060,
        timestamp: null
    });

    const [vitalsTrend, setVitalsTrend] = useState({
        heartRate: 0,
        spO2: 0,
        temperature: 0
    });

    const [previousVitals, setPreviousVitals] = useState({
        heartRate: 75,
        spO2: 98,
        temperature: 36.8
    });

    const [vitalsHistory, setVitalsHistory] = useState(generateVitalsHistory());
    const [ecgData] = useState(generateECGData());
    const [temperatureData] = useState(() => {
        const data = [];
        for (let i = 0; i < 24; i++) {
            data.push({
                hour: `${i}:00`,
                temperature: 36.2 + Math.random() * 1.2
            });
        }
        return data;
    });

    // Merge real vitals with temperature data
    const [combinedData, setCombinedData] = useState([]);
    const [updateFrequency, setUpdateFrequency] = useState(0);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Merge vitals history with temperature data
        const merged = vitalsHistory.map((vh, index) => ({
            ...vh,
            temperature: temperatureData[index]?.temperature || 36.8
        }));
        setCombinedData(merged);
    }, [vitalsHistory, temperatureData]);

    // Calculate trends
    const calculateTrend = (current, previous) => {
        const diff = current - previous;
        if (diff > 2) return 'up';
        if (diff < -2) return 'down';
        return 'stable';
    };

    // Add real vital to history
    const addToHistory = (newVital) => {
        setVitalsHistory(prev => {
            const updated = [
                ...prev.slice(1),
                { ...newVital, temperature: newVital.temperature || 36.8 }
            ];
            return updated;
        });
    };

    useEffect(() => {
        const fetchVitals = async () => {
            try {
                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';
                const response = await fetch(`${apiUrl}/api/vitals`);
                if (!response.ok) {
                    throw new Error('Failed to fetch vitals');
                }
                const data = await response.json();

                setVitals(prevVitals => {
                    const hasChanged =
                        prevVitals.heartRate !== data.heartRate ||
                        prevVitals.spO2 !== data.spO2 ||
                        prevVitals.lat !== data.lat ||
                        prevVitals.lng !== data.lng;

                    if (hasChanged) {
                        // Calculate trends
                        setVitalsTrend({
                            heartRate: calculateTrend(data.heartRate, previousVitals.heartRate),
                            spO2: calculateTrend(data.spO2, previousVitals.spO2),
                            temperature: calculateTrend(data.temperature || 36.8, previousVitals.temperature)
                        });

                        setPreviousVitals({
                            heartRate: data.heartRate,
                            spO2: data.spO2,
                            temperature: data.temperature || 36.8
                        });

                        // Add to history
                        addToHistory(data);

                        // Update frequency counter
                        setUpdateFrequency(prev => prev + 1);
                    }

                    return hasChanged ? {
                        ...data,
                        temperature: data.temperature || 36.2 + Math.random() * 1.2
                    } : prevVitals;
                });

                setError(null);
            } catch (err) {
                console.error('Error fetching vitals:', err);
            }
        };

        fetchVitals();
        const interval = setInterval(fetchVitals, 2000);
        return () => clearInterval(interval);
    }, [previousVitals]);

    const [backHover, setBackHover] = useState(false);
    const isDataReceived = vitals.timestamp !== null;

    // Determine health status
    const getHealthStatus = () => {
        const hr = vitals.heartRate;
        const spO2 = vitals.spO2;
        const temp = vitals.temperature;

        if ((hr > 100 || hr < 60) || (spO2 < 95) || (temp > 38 || temp < 36)) {
            return { status: 'Critical', color: '#e74c3c', icon: 'critical' };
        }
        if ((hr > 90 || hr < 70) || (spO2 < 96) || (temp > 37.5 || temp < 36.5)) {
            return { status: 'Warning', color: '#f39c12', icon: 'warning' };
        }
        return { status: 'Healthy', color: '#27ae60', icon: 'healthy' };
    };

    const healthStatus = getHealthStatus();

    // Get trend arrow
    const getTrendArrow = (trend) => {
        if (trend === 'up') return <TrendUpIcon size={20} color="#27ae60" />;
        if (trend === 'down') return <TrendDownIcon size={20} color="#e74c3c" />;
        return <StableIcon size={20} color="#3498db" />;
    };

    // Get metric color based on value
    const getMetricColor = (metric, value) => {
        switch (metric) {
            case 'heartRate':
                if (value < 60 || value > 100) return '#e74c3c';
                if (value < 70 || value > 90) return '#f39c12';
                return '#27ae60';
            case 'spO2':
                if (value < 95) return '#e74c3c';
                if (value < 96) return '#f39c12';
                return '#27ae60';
            case 'temperature':
                if (value < 36 || value > 38) return '#e74c3c';
                if (value < 36.5 || value > 37.5) return '#f39c12';
                return '#27ae60';
            default:
                return '#2ecc71';
        }
    };

    const styles = {
        container: {
            maxWidth: '1400px',
            margin: '0 auto',
            padding: responsive.isMobile ? '20px 15px' : responsive.isTablet ? '30px 20px' : '40px 20px',
            backgroundColor: '#f5f7fa',
            minHeight: '100vh',
        },
        header: {
            display: 'flex',
            flexDirection: responsive.isMobile ? 'column' : 'row',
            justifyContent: 'space-between',
            alignItems: responsive.isMobile ? 'flex-start' : 'center',
            gap: responsive.isMobile ? '15px' : '0',
            marginBottom: responsive.isMobile ? '25px' : '40px',
            color: '#333',
            backgroundColor: 'white',
            padding: responsive.isMobile ? '15px' : '20px',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        },
        titleSection: {
            flex: 1,
            width: responsive.isMobile ? '100%' : 'auto',
        },
        title: {
            fontSize: responsive.isMobile ? '20px' : responsive.isTablet ? '26px' : '32px',
            fontWeight: 'bold',
            marginBottom: '5px',
        },
        subtitle: {
            fontSize: responsive.isMobile ? '13px' : responsive.isTablet ? '14px' : '16px',
            color: '#666',
        },
        backButton: {
            padding: responsive.isMobile ? '8px 16px' : '10px 20px',
            backgroundColor: '#e74c3c',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: responsive.isMobile ? '14px' : '16px',
            fontWeight: 'bold',
            color: 'white',
            transition: 'background-color 0.3s',
            minHeight: '44px',
            whiteSpace: 'nowrap',
        },
        metricsGrid: {
            display: 'grid',
            gridTemplateColumns: responsive.isMobile ? '1fr' : responsive.isTablet ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
            gap: responsive.isMobile ? '12px' : '20px',
            marginBottom: responsive.isMobile ? '25px' : '40px',
        },
        metricCard: {
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: responsive.isMobile ? '15px' : '20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            textAlign: 'center',
            border: '2px solid #eee',
            transition: 'all 0.3s ease',
            cursor: 'pointer',
            ':hover': {
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                transform: 'translateY(-2px)',
            }
        },
        metricLabel: {
            fontSize: responsive.isMobile ? '11px' : '12px',
            color: '#999',
            textTransform: 'uppercase',
            marginBottom: '8px',
        },
        metricValue: {
            fontSize: responsive.isMobile ? '24px' : responsive.isTablet ? '28px' : '36px',
            fontWeight: 'bold',
            marginBottom: '5px',
            transition: 'all 0.3s ease',
        },
        metricTrend: {
            fontSize: '20px',
            marginLeft: '5px',
        },
        metricUnit: {
            fontSize: responsive.isMobile ? '11px' : '12px',
            color: '#666',
        },
        chartsGrid: {
            display: 'grid',
            gridTemplateColumns: responsive.isMobile ? '1fr' : responsive.isTablet ? '1fr' : 'repeat(2, 1fr)',
            gap: responsive.isMobile ? '15px' : '30px',
            marginBottom: responsive.isMobile ? '25px' : '40px',
        },
        chartContainer: {
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: responsive.isMobile ? '15px' : '25px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        },
        chartTitle: {
            fontSize: responsive.isMobile ? '14px' : responsive.isTablet ? '16px' : '18px',
            fontWeight: 'bold',
            marginBottom: responsive.isMobile ? '12px' : '20px',
            color: '#333',
        },
        ecgContainer: {
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: responsive.isMobile ? '15px' : '25px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            marginBottom: responsive.isMobile ? '25px' : '40px',
            gridColumn: responsive.isMobile ? '1' : '1 / -1',
        },
        chartHeight: responsive.isMobile ? 250 : responsive.isTablet ? 280 : 300,
        statusBadge: {
            display: 'inline-block',
            padding: responsive.isMobile ? '6px 12px' : '8px 16px',
            borderRadius: '20px',
            fontSize: responsive.isMobile ? '11px' : '12px',
            fontWeight: 'bold',
            marginRight: '10px',
        },
        statusConnected: {
            backgroundColor: '#d4edda',
            color: '#155724',
        },
        statusBar: {
            display: 'flex',
            gap: '15px',
            marginBottom: '30px',
            flexWrap: 'wrap',
            alignItems: 'center',
        },
        healthStatusCard: {
            padding: '12px 20px',
            borderRadius: '8px',
            backgroundColor: 'white',
            border: `3px solid ${healthStatus.color}`,
            fontWeight: 'bold',
            fontSize: '16px',
            color: healthStatus.color,
            animation: healthStatus.status === 'Critical' ? 'pulse 1s infinite' : 'none',
        },
        updateIndicator: {
            padding: '8px 12px',
            backgroundColor: '#ecf0f1',
            borderRadius: '6px',
            fontSize: '12px',
            color: '#555',
            fontWeight: '500',
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <div style={styles.titleSection}>
                    <h1 style={styles.title}><DoctorIcon size={32} color="#333" /> Doctor Dashboard</h1>
                    <p style={styles.subtitle}>Real-time Patient Monitoring</p>
                </div>
                <button
                    style={{
                        ...styles.backButton,
                        backgroundColor: backHover ? '#c0392b' : '#e74c3c'
                    }}
                    onMouseEnter={() => setBackHover(true)}
                    onMouseLeave={() => setBackHover(false)}
                    onClick={onBack}
                >
                    <BackArrowIcon size={20} /> Back
                </button>
            </div>

            <div style={styles.statusBar}>
                <div style={{ ...styles.statusBadge, ...styles.statusConnected }}>
                    <ConnectedDotIcon size={12} color="#27ae60" /> Connected & Monitoring
                </div>
                <div style={{ ...styles.statusBadge, backgroundColor: '#ecf0f1', color: '#555', fontWeight: '500' }}>
                    Updates: {updateFrequency}
                </div>
                <div style={styles.healthStatusCard}>
                    {healthStatus.icon === 'critical' && <CriticalIcon size={20} color={healthStatus.color} />}
                    {healthStatus.icon === 'warning' && <WarningIcon size={20} color={healthStatus.color} />}
                    {healthStatus.icon === 'healthy' && <HeartIcon size={20} color={healthStatus.color} />}
                    {' '}{healthStatus.status}
                </div>
                <div style={styles.updateIndicator}>
                    <SensorIcon size={16} color="#3498db" /> Real-time data feed active
                </div>
            </div>

            {/* Add CSS animation for pulse effect */}
            <style>{`
                @keyframes pulse {
                    0% {
                        box-shadow: 0 0 0 0 rgba(231, 76, 60, 0.7);
                    }
                    70% {
                        box-shadow: 0 0 0 10px rgba(231, 76, 60, 0);
                    }
                    100% {
                        box-shadow: 0 0 0 0 rgba(231, 76, 60, 0);
                    }
                }
                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateX(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
            `}</style>

            {/* Key Metrics */}
            <div style={styles.metricsGrid}>
                <div style={{
                    ...styles.metricCard,
                    borderColor: getMetricColor('heartRate', vitals.heartRate),
                    boxShadow: `0 2px 8px ${getMetricColor('heartRate', vitals.heartRate)}30`,
                }}>
                    <div style={styles.metricLabel}>❤️ Heart Rate</div>
                    <div style={{
                        ...styles.metricValue,
                        color: getMetricColor('heartRate', vitals.heartRate),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                    }}>
                        {Math.round(vitals.heartRate)}
                        <span style={styles.metricTrend}>{getTrendArrow(vitalsTrend.heartRate)}</span>
                    </div>
                    <div style={styles.metricUnit}>BPM</div>
                    <div style={{ fontSize: '11px', color: '#999', marginTop: '8px' }}>
                        {vitalsTrend.heartRate === 'up' ? <><UpArrowIcon size={14} color=\"#27ae60\" /> Increasing</> : vitalsTrend.heartRate === 'down' ? <><DownArrowIcon size={14} color=\"#e74c3c\" /> Decreasing</> : <><StableIcon size={14} color=\"#3498db\" /> Stable</>}
                    </div>
                </div>

                <div style={{
                    ...styles.metricCard,
                    borderColor: getMetricColor('spO2', vitals.spO2),
                    boxShadow: `0 2px 8px ${getMetricColor('spO2', vitals.spO2)}30`,
                }}>
                    <div style={styles.metricLabel}><LungsIcon size={18} color=\"#27ae60\" /> Oxygen Saturation</div>
                    <div style={{
                        ...styles.metricValue,
                        color: getMetricColor('spO2', vitals.spO2),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                    }}>
                        {Math.round(vitals.spO2)}
                        <span style={styles.metricTrend}>{getTrendArrow(vitalsTrend.spO2)}</span>
                    </div>
                    <div style={styles.metricUnit}>%</div>
                    <div style={{ fontSize: '11px', color: '#999', marginTop: '8px' }}>
                        {vitalsTrend.spO2 === 'up' ? <><UpArrowIcon size={14} color="#27ae60" /> Increasing</> : vitalsTrend.spO2 === 'down' ? <><DownArrowIcon size={14} color="#e74c3c" /> Decreasing</> : <><StableIcon size={14} color="#3498db" /> Stable</>}
                    </div>
                </div>

                <div style={{
                    ...styles.metricCard,
                    borderColor: getMetricColor('temperature', vitals.temperature),
                    boxShadow: `0 2px 8px ${getMetricColor('temperature', vitals.temperature)}30`,
                }}>
                    <div style={styles.metricLabel}><ThermometerIcon size={18} color="#f39c12" /> Temperature</div>
                    <div style={{
                        ...styles.metricValue,
                        color: getMetricColor('temperature', vitals.temperature),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                    }}>
                        {vitals.temperature.toFixed(1)}
                        <span style={styles.metricTrend}>{getTrendArrow(vitalsTrend.temperature)}</span>
                    </div>
                    <div style={styles.metricUnit}>°C</div>
                    <div style={{ fontSize: '11px', color: '#999', marginTop: '8px' }}>
                        {vitalsTrend.temperature === 'up' ? <><UpArrowIcon size={14} color="#27ae60" /> Rising</> : vitalsTrend.temperature === 'down' ? <><DownArrowIcon size={14} color="#e74c3c" /> Falling</> : <><StableIcon size={14} color="#3498db" /> Stable</>}
                    </div>
                </div>

                <div style={{
                    ...styles.metricCard,
                    borderColor: '#3498db',
                }}>
                    <div style={styles.metricLabel}>📍 Location</div>
                    <div style={{
                        ...styles.metricValue,
                        color: '#3498db',
                        fontSize: responsive.isMobile ? '18px' : responsive.isTablet ? '20px' : '24px'
                    }}>
                        {vitals.lat.toFixed(2)}
                    </div>
                    <div style={styles.metricUnit}>Lat, {vitals.lng.toFixed(2)} Lng</div>
                    <div style={{ fontSize: '11px', color: '#999', marginTop: '8px' }}>
                        Updated: {vitals.timestamp ? new Date(vitals.timestamp).toLocaleTimeString() : 'Syncing...'}
                    </div>
                </div>
            </div>

            {/* ECG Chart */}
            <div style={styles.ecgContainer}>
                <h3 style={styles.chartTitle}>📊 ECG (Electrocardiogram)</h3>
                <ResponsiveContainer width="100%" height={styles.chartHeight}>
                    <LineChart data={ecgData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                        <XAxis dataKey="time" stroke="#999" />
                        <YAxis stroke="#999" />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '4px' }}
                            formatter={(value) => value.toFixed(2)}
                        />
                        <Line
                            type="monotone"
                            dataKey="voltage"
                            stroke="#e74c3c"
                            dot={false}
                            strokeWidth={2}
                            isAnimationActive={false}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Charts Grid */}
            <div style={styles.chartsGrid}>
                {/* Heart Rate Over Time */}
                <div style={styles.chartContainer}>
                    <h3 style={styles.chartTitle}>❤️ Heart Rate Trend (24h) - From Sensor</h3>
                    <ResponsiveContainer width="100%" height={styles.chartHeight}>
                        <AreaChart data={vitalsHistory}>
                            <defs>
                                <linearGradient id="colorHR" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3498db" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#3498db" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                            <XAxis dataKey="hour" stroke="#999" />
                            <YAxis stroke="#999" />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '4px' }}
                                formatter={(value) => [Math.round(value), 'BPM']}
                            />
                            <Area
                                type="monotone"
                                dataKey="heartRate"
                                stroke="#3498db"
                                fillOpacity={1}
                                fill="url(#colorHR)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* SpO2 Over Time */}
                <div style={styles.chartContainer}>
                    <h3 style={styles.chartTitle}><LungsIcon size={24} color="#27ae60" /> SpO2 Levels (24h) - From Sensor</h3>
                    <ResponsiveContainer width="100%" height={styles.chartHeight}>
                        <LineChart data={vitalsHistory}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                            <XAxis dataKey="hour" stroke="#999" />
                            <YAxis stroke="#999" domain={[90, 100]} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '4px' }}
                                formatter={(value) => [value.toFixed(1), '%']}
                            />
                            <Line
                                type="monotone"
                                dataKey="spO2"
                                stroke="#27ae60"
                                strokeWidth={2}
                                dot={{ fill: '#27ae60', r: 4 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Temperature Over Time - Mock Data */}
                <div style={styles.chartContainer}>
                    <h3 style={styles.chartTitle}><ThermometerIcon size={24} color="#f39c12" /> Temperature Trend (24h) - Mock Data</h3>
                    <ResponsiveContainer width="100%" height={styles.chartHeight}>
                        <BarChart data={temperatureData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                            <XAxis dataKey="hour" stroke="#999" />
                            <YAxis stroke="#999" domain={[35, 38]} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '4px' }}
                                formatter={(value) => [value.toFixed(1), '°C']}
                            />
                            <Bar dataKey="temperature" fill="#f39c12" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Combined Vitals Comparison */}
                <div style={styles.chartContainer}>
                    <h3 style={styles.chartTitle}><TrendUpIcon size={24} color="#3498db" /> Vitals Comparison (Normalized)</h3>
                    <ResponsiveContainer width="100%" height={styles.chartHeight}>
                        <LineChart data={combinedData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                            <XAxis dataKey="hour" stroke="#999" />
                            <YAxis stroke="#999" />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '4px' }}
                            />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="heartRate"
                                stroke="#3498db"
                                strokeWidth={2}
                                dot={false}
                            />
                            <Line
                                type="monotone"
                                dataKey="spO2"
                                stroke="#27ae60"
                                strokeWidth={2}
                                dot={false}
                            />
                            <Line
                                type="monotone"
                                dataKey="temperature"
                                stroke="#f39c12"
                                strokeWidth={2}
                                dot={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div >
    );
}

function HospitalManagement({ onBack }) {
    const responsive = useResponsive();

    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);

    const [espLocation, setEspLocation] = useState({
        lat: 40.7128,
        lng: -74.0060,
        timestamp: null
    });

    // Fetch patients from MongoDB
    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';
                const response = await fetch(`${apiUrl}/api/patients`);
                if (!response.ok) throw new Error('Failed to fetch patients');
                const data = await response.json();
                setPatients(data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching patients:', err);
                // Fallback to mock data if API fails
                setPatients([
                    { patientId: 1, name: 'John Smith', status: 'Stable', isSensorPatient: true, latestVitals: { lat: 40.7128, lng: -74.0060, timestamp: new Date() } },
                    { patientId: 2, name: 'Sarah Johnson', status: 'Monitoring', isSensorPatient: false, latestVitals: { lat: 40.7580, lng: -73.9855, timestamp: new Date() } },
                    { patientId: 3, name: 'Michael Chen', status: 'Alert', isSensorPatient: false, latestVitals: { lat: 40.7614, lng: -73.9776, timestamp: new Date() } },
                ]);
                setLoading(false);
            }
        };

        fetchPatients();
        // Refresh every 10 seconds
        const interval = setInterval(fetchPatients, 10000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const fetchEspLocation = async () => {
            try {
                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';
                const response = await fetch(`${apiUrl}/api/vitals`);
                if (!response.ok) throw new Error('Failed to fetch location');
                const data = await response.json();
                setEspLocation({
                    lat: data.lat || 40.7128,
                    lng: data.lng || -74.0060,
                    timestamp: data.timestamp
                });
            } catch (err) {
                console.error('Error fetching location:', err);
            }
        };

        fetchEspLocation();
        const interval = setInterval(fetchEspLocation, 5000);
        return () => clearInterval(interval);
    }, []);

    const styles = {
        container: {
            maxWidth: '1200px',
            margin: '0 auto',
            padding: responsive.isMobile ? '20px 15px' : responsive.isTablet ? '30px 20px' : '40px 20px',
        },
        header: {
            display: 'flex',
            flexDirection: responsive.isMobile ? 'column' : 'row',
            justifyContent: 'space-between',
            alignItems: responsive.isMobile ? 'flex-start' : 'center',
            gap: responsive.isMobile ? '15px' : '0',
            marginBottom: responsive.isMobile ? '25px' : '40px',
            color: '#333',
            borderBottom: '2px solid #eee',
            paddingBottom: responsive.isMobile ? '15px' : '20px',
        },
        titleSection: {
            flex: 1,
            width: responsive.isMobile ? '100%' : 'auto',
        },
        title: {
            fontSize: responsive.isMobile ? '20px' : responsive.isTablet ? '26px' : '32px',
            fontWeight: 'bold',
            marginBottom: '5px',
        },
        subtitle: {
            fontSize: responsive.isMobile ? '13px' : responsive.isTablet ? '14px' : '16px',
            color: '#666',
        },
        backButton: {
            padding: responsive.isMobile ? '8px 16px' : '10px 20px',
            backgroundColor: '#f0f0f0',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: responsive.isMobile ? '14px' : '16px',
            fontWeight: 'bold',
            color: '#333',
            transition: 'background-color 0.3s',
            minHeight: '44px',
            whiteSpace: 'nowrap',
        },
        backButtonHover: {
            backgroundColor: '#e0e0e0',
        },
        statsGrid: {
            display: 'grid',
            gridTemplateColumns: responsive.isMobile ? '1fr 1fr' : responsive.isTablet ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
            gap: responsive.isMobile ? '10px' : '20px',
            marginBottom: responsive.isMobile ? '25px' : '40px',
        },
        statCard: {
            backgroundColor: '#f5f5f5',
            borderRadius: '8px',
            padding: responsive.isMobile ? '12px' : '20px',
            textAlign: 'center',
        },
        statNumber: {
            fontSize: responsive.isMobile ? '24px' : responsive.isTablet ? '28px' : '32px',
            fontWeight: 'bold',
            color: '#0066cc',
        },
        statLabel: {
            fontSize: responsive.isMobile ? '12px' : responsive.isTablet ? '13px' : '14px',
            color: '#666',
            marginTop: responsive.isMobile ? '5px' : '10px',
        },
        patientsList: {
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            overflow: 'hidden',
            marginBottom: responsive.isMobile ? '25px' : '40px',
        },
        patientRow: {
            padding: responsive.isMobile ? '12px' : '20px',
            borderBottom: '1px solid #eee',
            display: 'grid',
            gridTemplateColumns: responsive.isMobile ? '1fr' : responsive.isTablet ? '1fr 1fr 1fr' : '1fr 1fr 1fr 1fr',
            gap: responsive.isMobile ? '8px' : '20px',
            alignItems: responsive.isMobile ? 'stretch' : 'center',
        },
        patientRowHeader: {
            backgroundColor: '#f9f9f9',
            fontWeight: 'bold',
            color: '#333',
            textTransform: 'uppercase',
            fontSize: responsive.isMobile ? '11px' : '12px',
            display: responsive.isMobile ? 'none' : 'grid',
        },
        statusBadge: {
            display: 'inline-block',
            padding: responsive.isMobile ? '5px 10px' : '6px 12px',
            borderRadius: '20px',
            fontSize: responsive.isMobile ? '11px' : '12px',
            fontWeight: 'bold',
        },
        statusStable: {
            backgroundColor: '#d4edda',
            color: '#155724',
        },
        statusMonitoring: {
            backgroundColor: '#fff3cd',
            color: '#856404',
        },
        statusAlert: {
            backgroundColor: '#f8d7da',
            color: '#721c24',
        },
        mapContainer: {
            marginBottom: responsive.isMobile ? '25px' : '40px',
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        },
        mapTitle: {
            backgroundColor: '#f9f9f9',
            padding: responsive.isMobile ? '12px 15px' : '15px 20px',
            borderBottom: '1px solid #eee',
            fontWeight: 'bold',
            color: '#333',
            fontSize: responsive.isMobile ? '14px' : '16px',
        },
        mapIframe: {
            width: '100%',
            height: responsive.isMobile ? '300px' : responsive.isTablet ? '350px' : '400px',
            border: 'none',
        },
        mapInfo: {
            display: 'grid',
            gridTemplateColumns: responsive.isMobile ? '1fr 1fr' : 'repeat(4, 1fr)',
            gap: responsive.isMobile ? '8px' : '15px',
            padding: responsive.isMobile ? '12px' : '20px',
            backgroundColor: '#f5f5f5',
        },
        mapInfoItem: {
            padding: responsive.isMobile ? '8px' : '10px',
            backgroundColor: 'white',
            borderRadius: '4px',
            fontSize: responsive.isMobile ? '12px' : '14px',
        },
        mapLabel: {
            fontWeight: 'bold',
            color: '#333',
            marginBottom: '3px',
            fontSize: responsive.isMobile ? '11px' : '12px',
        },
        mapValue: {
            color: '#0066cc',
            fontSize: responsive.isMobile ? '13px' : '16px',
        },
    };

    const [backHover, setBackHover] = useState(false);

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Stable':
                return styles.statusStable;
            case 'Monitoring':
                return styles.statusMonitoring;
            case 'Alert':
                return styles.statusAlert;
            default:
                return {};
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <div style={styles.titleSection}>
                    <h1 style={styles.title}><BuildingIcon size={32} color="#333" /> Hospital Management</h1>
                    <p style={styles.subtitle}>Monitor all patients and system status</p>
                </div>
                <button
                    style={{
                        ...styles.backButton,
                        ...(backHover ? styles.backButtonHover : {}),
                    }}
                    onMouseEnter={() => setBackHover(true)}
                    onMouseLeave={() => setBackHover(false)}
                    onClick={onBack}
                >
                    <BackArrowIcon size={20} /> Back
                </button>
            </div>

            <div style={styles.statsGrid}>
                <div style={styles.statCard}>
                    <div style={styles.statNumber}>{patients.length}</div>
                    <div style={styles.statLabel}>Total Patients</div>
                </div>
                <div style={styles.statCard}>
                    <div style={styles.statNumber}>{patients.filter(p => p.status === 'Stable').length}</div>
                    <div style={styles.statLabel}>Stable</div>
                </div>
                <div style={styles.statCard}>
                    <div style={styles.statNumber}>{patients.filter(p => p.status === 'Monitoring').length}</div>
                    <div style={styles.statLabel}>Monitoring</div>
                </div>
                <div style={styles.statCard}>
                    <div style={styles.statNumber}>{patients.filter(p => p.status === 'Alert').length}</div>
                    <div style={styles.statLabel}>Alerts</div>
                </div>
            </div>

            <div style={styles.mapContainer}>
                <div style={styles.mapTitle}><MapIcon size={24} color="#3498db" /> Ambulance/ESP32 Location Tracker</div>
                <iframe
                    name="ambulanceMap"
                    style={styles.mapIframe}
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${espLocation.lng - 0.01},${espLocation.lat - 0.01},${espLocation.lng + 0.01},${espLocation.lat + 0.01}&layer=mapnik&marker=${espLocation.lat},${espLocation.lng}`}
                    title="Ambulance Location Map"
                />
                <div style={styles.mapInfo}>
                    <div style={styles.mapInfoItem}>
                        <div style={styles.mapLabel}><LocationPinIcon size={16} color="#e74c3c" /> Latitude</div>
                        <div style={styles.mapValue}>{typeof espLocation.lat === 'number' ? espLocation.lat.toFixed(6) : espLocation.lat}</div>
                    </div>
                    <div style={styles.mapInfoItem}>
                        <div style={styles.mapLabel}><LocationPinIcon size={16} color="#e74c3c" /> Longitude</div>
                        <div style={styles.mapValue}>{typeof espLocation.lng === 'number' ? espLocation.lng.toFixed(6) : espLocation.lng}</div>
                    </div>
                    <div style={styles.mapInfoItem}>
                        <div style={styles.mapLabel}><ClockIcon size={16} color="#666" /> Last Update</div>
                        <div style={styles.mapValue}>{espLocation.timestamp ? new Date(espLocation.timestamp).toLocaleTimeString() : 'Waiting...'}</div>
                    </div>
                    <div style={styles.mapInfoItem}>
                        <div style={styles.mapLabel}><AmbulanceIcon size={16} color="#e74c3c" /> Vehicle Status</div>
                        <div style={styles.mapValue}><ConnectedDotIcon size={12} color="#27ae60" /> Active</div>
                    </div>
                </div>
            </div>

            <div style={styles.patientsList}>
                {!responsive.isMobile && (
                    <div style={{ ...styles.patientRow, ...styles.patientRowHeader }}>
                        <div>Patient Name</div>
                        <div>Status</div>
                        <div>Heart Rate (BPM)</div>
                        <div>Last Update</div>
                    </div>
                )}

                {loading ? (
                    <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                        Loading patients...
                    </div>
                ) : (
                    patients.map(patient => (
                        <div key={patient.patientId} style={styles.patientRow}>
                            {responsive.isMobile && (
                                <>
                                    <div style={{ fontWeight: 'bold', fontSize: '12px', color: '#999', textTransform: 'uppercase' }}>
                                        Patient Name
                                    </div>
                                    <div style={{ fontWeight: 'bold', color: '#333' }}>{patient.name} {patient.isSensorPatient ? <SensorIcon size={16} color="#3498db" /> : ''}</div>
                                    <div style={{ fontWeight: 'bold', fontSize: '12px', color: '#999', textTransform: 'uppercase', marginTop: '8px' }}>
                                        Status
                                    </div>
                                    <div style={{ ...styles.statusBadge, ...getStatusStyle(patient.status) }}>
                                        {patient.status}
                                    </div>
                                    <div style={{ fontWeight: 'bold', fontSize: '12px', color: '#999', textTransform: 'uppercase', marginTop: '8px' }}>
                                        Heart Rate
                                    </div>
                                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#3498db' }}>
                                        {patient.latestVitals?.heartRate || 'N/A'} BPM
                                    </div>
                                    <div style={{ fontWeight: 'bold', fontSize: '12px', color: '#999', textTransform: 'uppercase', marginTop: '8px' }}>
                                        Last Update
                                    </div>
                                    <div style={{ fontSize: '12px', color: '#666' }}>
                                        {patient.latestVitals?.timestamp ? new Date(patient.latestVitals.timestamp).toLocaleTimeString() : 'N/A'}
                                    </div>
                                </>
                            )}
                            {!responsive.isMobile && (
                                <>
                                    <div>{patient.name} {patient.isSensorPatient ? <SensorIcon size={16} color="#3498db" /> : ''}</div>
                                    <div style={{ ...styles.statusBadge, ...getStatusStyle(patient.status) }}>
                                        {patient.status}
                                    </div>
                                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#3498db' }}>
                                        {patient.latestVitals?.heartRate || 'N/A'} BPM
                                    </div>
                                    <div style={{ fontSize: '14px', color: '#666' }}>
                                        {patient.latestVitals?.timestamp ? new Date(patient.latestVitals.timestamp).toLocaleTimeString() : 'N/A'}
                                    </div>
                                </>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

function LandingPageRoute() {
    const navigate = useNavigate();
    return <LandingPage onNavigate={(page) => navigate(`/${page}`)} />;
}

function DoctorRoute() {
    const navigate = useNavigate();
    return <DoctorDashboard onBack={() => navigate('/')} />;
}

function HospitalRoute() {
    const navigate = useNavigate();
    return <HospitalManagement onBack={() => navigate('/')} />;
}

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LandingPageRoute />} />
                <Route path="/doctor" element={<DoctorRoute />} />
                <Route path="/hospital" element={<HospitalRoute />} />
            </Routes>
        </Router>
    );
}

export default App;
