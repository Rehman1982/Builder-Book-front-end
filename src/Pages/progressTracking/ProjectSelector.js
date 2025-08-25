
import React, { useContext, useEffect } from 'react'
import ProgTrackingContext from './context';
const ProjectSelector = () => {
    const { projects, selectedProject, setSelectedProject, CURD } = useContext(ProgTrackingContext);
    const handleChange = (e) => {
        setSelectedProject({ id: e.target.value });
        CURD.getData(e.target.value);
    }
    useEffect(() => {
        $("select").selectpicker("refresh");

    })
    return (
        <div className=" col-4 mb-2">
            <select className="form-control" onChange={handleChange}>
                <option defaultValue="">Selec Project</option>
                {projects.map((v, i) =>
                    v.id == selectedProject.id ?
                        <option key={i} value={v.id} selected>{v.name} {v.id}</option> :
                        <option key={i} value={v.id}>{v.name} {v.id}</option>
                )}
            </select>
        </div>
    )
}

export default ProjectSelector;
