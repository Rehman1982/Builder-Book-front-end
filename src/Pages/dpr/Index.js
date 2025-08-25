import React from "react";
import DPR from "./DPRContext";
import {
    AllProjects,
    SingleProject,
    ProjectSelector,
    SnakeBar,
    Menu,
    CreateDPR,
    EditDPR,
    UploadPics,
} from "./Compts";
import { Routes, Route } from "react-router-dom";
const DPRs = () => {
    return (
        <DPR>
            <Routes>
                <Route exact path="" element={<AllProjects />} />
                <Route
                    exact
                    path="project/:id"
                    element={
                        <>
                            <Menu />
                            <SnakeBar />
                            <CreateDPR />
                            {/* <UploadPics /> */}
                            <ProjectSelector />
                            <SingleProject />
                        </>
                    }
                />
            </Routes>
        </DPR>
    );
};

export default DPRs;
