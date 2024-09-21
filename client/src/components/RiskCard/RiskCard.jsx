import getRiskColor from '../../utils/getRiskcolor';
import RiskSquares from '../RiskSquares/RiskSquares';
import PropTypes from "prop-types"
import "./styles/RiskCard.css"

const RiskCard = ({ risk, index, project }) => {

    const matchRiskTask = (id) => {
        const riskTask = project.tasks.find(task => task.id === id);
        return riskTask
    }

    const matchUserFlagId = (userFlag) => {
        const userFlagId = project.team.members.find(member => member.id === userFlag)
        return userFlagId
    }

    const riskFactors = `${risk.riskFactors.timeline}/5 Timeline Factors,
${risk.riskFactors.budget}/5 Budget Factors,
${risk.riskFactors.dependencies}/5 Dependencies Factors,
${risk.riskFactors.resources}/5 Resources Factors,
${risk.riskFactors.complexity}/5 Complexity Factors`;

    return (
        <div className="risk-item" key={index}>
            <div className="risk-task-info-container">
                <h3>{matchRiskTask(risk.id).name}</h3>
                <p>Due: {matchRiskTask(risk.id).targetDate} | Assigned : {matchRiskTask(risk.id).assignedTo}</p>
                <p>Flagged by: {matchUserFlagId(risk.userFlag).name} ({matchUserFlagId(risk.userFlag).role})</p>
            </div>
            <div className="risk-indicator-container" title={riskFactors}>
                <div className="risk-indicator-label" style={{backgroundColor: getRiskColor(risk.riskLevel)}}>{risk.riskLevel}</div>
                <div className="risk-indicator-squares">
                    <RiskSquares total={risk.riskFactors.total} risk={risk} />
                </div>
                <p className="risk-score-label">Risk Score: {risk.riskFactors.total}</p>
            </div>
        </div>
    )
}

export default RiskCard

RiskCard.propTypes = {
    risk: PropTypes.shape({
        id: PropTypes.number,
        userFlag: PropTypes.number,
        riskLevel: PropTypes.string,
        riskFactors: PropTypes.shape({
            timeline: PropTypes.number,
            budget: PropTypes.number,
            dependencies: PropTypes.number,
            resources: PropTypes.number,
            complexity: PropTypes.number,
            total: PropTypes.number
        })
    }),
    index: PropTypes.number,
    project: PropTypes.shape({
        tasks: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.number,
            name: PropTypes.string,
            targetDate: PropTypes.string,
            assignedTo: PropTypes.string
        })),
        team: PropTypes.shape({
            members: PropTypes.arrayOf(PropTypes.shape({
                id: PropTypes.number,
                name: PropTypes.string,
                role: PropTypes.string
            }))
        })
    })
}