// import axios from "axios";
import React, {
    createContext,
    useState,
    useEffect,
    useContext,
    memo,
    useCallback,
} from "react";
import axios from "axios";
const BOQContext = createContext();
import { Alert } from "../../context/AlertBar/AlertBar";
import CreateBoq from "./CreateBoq";
import { Outlet } from "react-router-dom";

export default function BoqProvider(props) {
    const [allProjects, setAllProjects] = useState([]);
    const [projectsHavingBoq, setprojectsHavingBoq] = useState([]);
    const [items, setItems] = useState();
    const [schedules, setSchedules] = useState("al;skdjf;ldsfj");
    const { showAlert, setMessage } = useContext(Alert);
    const [toggles, setToggles] = useState({
        createForm: false,
        editForm: false,
        deleteForm: false,
        revisionCreate: false,
    });
    const getAllProjects = useCallback(async () => {
        const response = await axios.get(
            route("estimation.boq.index", { type: "allprojects" })
        );
        if (response.status == 200) {
            setAllProjects(response.data);
            // showAlert(true);
            // setMessage("all project api called");
        } else {
            console.log(response);
            setMessage("Error in API Call please check console for details");
            showAlert(true);
        }
        return response;
    }, [allProjects]);
    const getProjectsHavingBoq = async () => {
        const response = await axios.get(
            route("estimation.boq.index", { type: "projectshavingboq" })
        );
        if (response.status == 200) {
            // showAlert(true);
            setprojectsHavingBoq(response.data);
            // setMessage("projects having boq api called");
        } else {
            setMessage(
                "Error occured in API Call for details please check console"
            );
            showAlert(true);
        }
        return response;
    };
    const getProjectBoq = useCallback(
        async (project_id) => {
            const response = await axios.get(
                route("estimation.boq.show", { boq: project_id })
            );
            return response;
        },
        [toggles.createForm]
    );
    const getItemsndSchedules = async () => {
        const response = await axios.get(route("estimation.boq.create"));
        if (response.status == 200) {
            // console.log([response.data.items,response.data.schedules])
            setItems(() => response.data.items);
            setSchedules(() => response.data.schedules);
            // showAlert(true);
            // setMessage("schedules and items api called");
        } else {
            console.log(response);
            setMessage("Error in API Call please check console for details");
            showAlert(true);
        }
        return response;
    };
    useEffect(() => {
        // console.log("provider compt rendered");
        getAllProjects();
        getProjectsHavingBoq();
        getItemsndSchedules();
        // console.log("context called", [getAllProjects(), getProjectsHavingBoq(), getItemsndSchedules()]);
    }, [props]);
    return (
        <BOQContext.Provider
            value={{
                getProjectBoq,
                projectsHavingBoq,
                allProjects,
                schedules,
                items,
                toggles,
                setToggles,
                showAlert,
                setMessage,
            }}
        >
            {props.children}
            <Outlet />
        </BOQContext.Provider>
    );
}
export { BOQContext };
