    const getRiskColor = (riskLevel) => {
        switch (riskLevel) {
        case "Critical": return "#DC2626";
        case "High": return "#FBBF24";
        case "Medium": return "var(--primary-alternate)";
        case "Low": return "#34D399";
        default: return "#34D399";
    }
};

export default getRiskColor;