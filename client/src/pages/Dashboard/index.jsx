import PropTypes from "prop-types"
import { useOutletContext } from "react-router-dom"
const Dashboard = () => {

    const {isSideBarOpen} = useOutletContext()

    console.log(isSideBarOpen)
    return (
        <div className={`main-container ${isSideBarOpen ? "" : "slide"}`}>
            <h1>Dashboard</h1>
        </div>
    )
}

export default Dashboard

Dashboard.propTypes = {
    isSideBarOpen: PropTypes.bool
}