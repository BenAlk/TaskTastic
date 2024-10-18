import {useContext} from 'react'
import {ProjectContext} from "../../../context/ProjectContext"


export const test = () => {

    const {
        projectList,
        currentProject,
        setProject,
        deleteCurrentProject,
        fetchProjects,
        loading,
    } = useContext(ProjectContext)

    return (
        <div>test</div>
    )
}
