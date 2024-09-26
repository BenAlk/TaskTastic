import getRiskColor from '../../utils/getRiskColor';
import PropTypes from "prop-types";

const RiskSquares = ({ total, risk  }) => {

    const totalComparison = total < 10 ? 1 : total < 15 ? 2 : total < 20 ? 3 : 4
    return (
    <div className="risk-indicator-squares">
        {[...Array(5)].map((_, i) => (
        <div
            key={i}
            className="risk-square"
            style={{
            width: '10px',
            height: '10px',
            backgroundColor: i < totalComparison ? getRiskColor(risk.riskLevel) : '#E5E7EB',
            display: 'inline-block',
            margin: '0 2px',
            borderRadius: '2px'
            }}
        />
        ))}
    </div>
    );
};

export default RiskSquares;

RiskSquares.propTypes = {
    total: PropTypes.number.isRequired,
    risk: PropTypes.shape({
        riskLevel: PropTypes.string.isRequired,
    })
};
