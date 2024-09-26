import PropTypes from 'prop-types'
import { useOutletContext } from 'react-router-dom'
import "./styles/CreateProject.css"
const testData = {
    owner: "Ben Alkureishi"
}
const CreateProject = () => {

    const { isSideBarOpen } = useOutletContext()

    return (
        <div className={`main-container ${isSideBarOpen ? "" : "slide"}`}>
            <div className="new-project-container">
                <div className="new-project-header">
                    <div className="new-project-name">
                        <p className="new-project-name-label">Project Name:</p>
                        <input type="text" className="new-project-name-input" id="new-project-name" />
                    </div>
                    <div className="new-project-owner">
                        <p className="new-project-owner-label">Owner:</p>
                        <input type="text" className="new-project-owner-input" id="new-project-owner" value={testData.owner} disabled />
                    </div>
                    <div className="new-project-created-date">
                        <p className="new-project-created-date-label">Created Date:</p>
                        <input type="text" className="new-project-created-date-input" id="new-project-created-date" value={new Date().toLocaleString(undefined, {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })} disabled />
                    </div>
                </div>
                <div className="project-body">
                </div>
            </div>
        </div>
    )
}

export default CreateProject

CreateProject.propTypes = {
    isSideBarOpen: PropTypes.bool
}
