// SVG Icon Components
export const HospitalIcon = ({ size = 24, color = '#333' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"></path>
        <path d="M12 9v6M9 12h6"></path>
    </svg>
);

export const DoctorIcon = ({ size = 24, color = '#333' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
        <path d="M12 12v6M9 15h6"></path>
    </svg>
);

export const BuildingIcon = ({ size = 24, color = '#333' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="2" width="18" height="20" rx="2"></rect>
        <line x1="9" y1="2" x2="9" y2="22"></line>
        <line x1="15" y1="2" x2="15" y2="22"></line>
        <line x1="3" y1="8" x2="21" y2="8"></line>
        <line x1="3" y1="14" x2="21" y2="14"></line>
        <line x1="3" y1="20" x2="21" y2="20"></line>
    </svg>
);

export const CriticalIcon = ({ size = 24, color = '#e74c3c' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
        <circle cx="12" cy="12" r="11" fill={color} opacity="0.3" stroke={color} strokeWidth="2"></circle>
        <text x="12" y="16" textAnchor="middle" fontSize="18" fontWeight="bold" fill={color}>!</text>
    </svg>
);

export const WarningIcon = ({ size = 24, color = '#f39c12' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3.05h16.94a2 2 0 0 0 1.71-3.05L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
        <line x1="12" y1="9" x2="12" y2="13"></line>
        <line x1="12" y1="17" x2="12.01" y2="17"></line>
    </svg>
);

export const TrendUpIcon = ({ size = 24, color = '#27ae60' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
        <polyline points="17 6 23 6 23 12"></polyline>
    </svg>
);

export const TrendDownIcon = ({ size = 24, color = '#e74c3c' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline>
        <polyline points="17 18 23 18 23 12"></polyline>
    </svg>
);

export const StableIcon = ({ size = 24, color = '#3498db' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="1 12 5 12 8 16 16 8 19 12 23 12"></polyline>
    </svg>
);

export const UpArrowIcon = ({ size = 24, color = '#333' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="19" x2="12" y2="5"></line>
        <polyline points="5 12 12 5 19 12"></polyline>
    </svg>
);

export const DownArrowIcon = ({ size = 24, color = '#333' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <polyline points="19 12 12 19 5 12"></polyline>
    </svg>
);

export const LungsIcon = ({ size = 24, color = '#27ae60' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 3h0a4 4 0 0 1 4 4v10a2 2 0 0 1-2 2 2 2 0 0 1-2-2V7a4 4 0 0 1 4-4Z"></path>
        <path d="M16 3h0a4 4 0 0 1 4 4v10a2 2 0 0 1-2 2 2 2 0 0 1-2-2V7a4 4 0 0 1 4-4Z"></path>
    </svg>
);

export const ThermometerIcon = ({ size = 24, color = '#f39c12' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 14.76v1.5a2.5 2.5 0 0 1-5 0v-1.5M6 18.5a6 6 0 0 1 12 0"></path>
        <line x1="12" y1="2" x2="12" y2="9"></line>
    </svg>
);

export const SensorIcon = ({ size = 24, color = '#3498db' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v6M12 16v6"></path>
        <line x1="4.22" y1="10.22" x2="9.46" y2="15.46"></line>
        <line x1="14.54" y1="8.54" x2="19.78" y2="13.78"></line>
        <line x1="4.22" y1="13.78" x2="9.46" y2="8.54"></line>
        <line x1="14.54" y1="15.46" x2="19.78" y2="10.22"></line>
    </svg>
);

export const BackArrowIcon = ({ size = 24, color = '#fff' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="19" y1="12" x2="5" y2="12"></line>
        <polyline points="12 19 5 12 12 5"></polyline>
    </svg>
);

export const ConnectedDotIcon = ({ size = 12, color = '#27ae60' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
        <circle cx="12" cy="12" r="10" fill={color}></circle>
    </svg>
);

export const MapIcon = ({ size = 24, color = '#333' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon>
        <line x1="8" y1="2" x2="8" y2="18"></line>
        <line x1="16" y1="6" x2="16" y2="22"></line>
    </svg>
);

export const LocationPinIcon = ({ size = 24, color = '#e74c3c' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
        <circle cx="12" cy="10" r="3"></circle>
    </svg>
);

export const ClockIcon = ({ size = 24, color = '#666' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
);

export const AmbulanceIcon = ({ size = 24, color = '#e74c3c' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 4h8M6 4h12v10H6zM9 13v3h6v-3M3 17h18M5 17c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm14 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path>
    </svg>
);

export const HeartIcon = ({ size = 24, color = '#e74c3c' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
    </svg>
);

// Inline SVG utility functions for text-based emoji replacement
export const getTrendEmoji = (trend) => {
    if (trend === 'up') return <TrendUpIcon size={20} />;
    if (trend === 'down') return <TrendDownIcon size={20} />;
    return <StableIcon size={20} />;
};

export const getArrowEmoji = (direction = 'stable') => {
    if (direction === 'up') return <UpArrowIcon size={16} />;
    if (direction === 'down') return <DownArrowIcon size={16} />;
    return <StableIcon size={16} />;
};
