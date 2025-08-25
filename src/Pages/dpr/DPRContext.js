import axios from "axios";
import React, { createContext, useState, useEffect, useContext } from "react";
const DPRContext = createContext();
import { Alert } from "../../context/AlertBar/AlertBar";

export default function DPR(props) {
    const { showAlert, setMessage } = useContext(Alert);
    const [projects, setProjects] = useState([]); // all projects
    const [selectedProject, setSelectedProject] = useState({ id: "" });
    const [index, setIndex] = useState([]);
    const [progresData, setprogresData] = useState({});
    const [toggles, setToggles] = useState({
        createForm: false,
        editForm: false,
        pictureForm: false,
        snakeBar: false,
        menu: false,
        loader: false,
    });
    // const [message, setMessage] = useState("snake bar testing");
    const partials = {
        DiffInDays_dates: (Max, Min) => {
            let Minn = new Date(Min);
            let Maxx = new Date(Max);
            if (Minn > Maxx) {
                return 0;
            } else {
                let a = new Date(
                    `${Maxx.getFullYear()}-${Maxx.getMonth()}-${Maxx.getDate()}`
                );
                let b = new Date(
                    `${Minn.getFullYear()}-${Minn.getMonth()}-${Minn.getDate()}`
                );
                return Math.round((a - b) / 86400000) + 1;
            }
        },
        MinDate: (data, startVal) => {
            const resp = data.reduce(
                (acc, item) => {
                    if (acc.start !== null) {
                        if (new Date(item.start) < new Date(acc.start)) {
                            acc.start = item.start;
                        }
                    } else {
                        acc.start = item.start;
                    }
                    return acc;
                },
                { start: startVal }
            );
            return resp.start;
        },
        MaxDate: (data, startVal) => {
            const resp = data.reduce(
                (acc, item) => {
                    if (acc.finish !== null) {
                        if (new Date(item.finish) > new Date(acc.finish)) {
                            acc.finish = item.finish;
                        }
                    } else {
                        acc.finish = item.finish;
                    }
                    return acc;
                },
                { finish: startVal }
            );
            return resp.finish;
        },
        sumWrokDone: (dpr) => {
            if (dpr.length > 0) {
                return dpr.reduce(
                    (total, current) => total + parseInt(current.work_done),
                    0
                );
            } else {
                return 0;
            }
        },
    };
    const updateProgressData = () => {
        const idx = index.findIndex((val) => {
            return val.id == progresData.id;
        });
        setprogresData(index[idx]);
        console.log(progresData);
    };
    const getProjects = () => {
        const url = route("DPR.index", { type: "projects" });
        fetch(url)
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    setProjects(data.data.projects);
                    // setIndex(data.data.index);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };
    const getData = async (project_id, from = null, to = null) => {
        const response = await axios.get(
            route("DPR.show", {
                DPR: 1,
                project_id: project_id,
                from: from,
                to: to,
            })
        );
        if (response.status == 200) {
            return response.data.data;
        } else {
            console.log(response);
        }
    };
    const store = async (data) => {
        const url = route("DPR.store");
        const header = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": document.getElementById("token").value,
            },
            body: JSON.stringify(data),
        };
        const response = await fetch(url, header)
            .then((res) => res.json())
            .then((data) => data)
            .catch((err) => {
                console.log(err);
            });
        return response;
    };
    const update = async (data) => {
        const url = route("DPR.update", { DPR: "1" });
        const header = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": document.getElementById("token").value,
            },
            body: JSON.stringify(data),
        };
        const response = await fetch(url, header)
            .then((res) => res.json())
            .then((data) => data)
            .catch((err) => {
                console.log(err);
            });
        return response;
    };
    const summarizeData = (dynamicData, staticData, id = null) => {
        let d = dynamicData.map((v, i) => {
            if (v.parent_id == id) {
                let data = summarizeData(dynamicData, staticData, v.id);
                // Planed
                v.start = partials.MinDate(data, v.start);
                v.finish = partials.MaxDate(data, v.finish);
                v.budget = data.reduce(
                    (acc, item) => acc + parseInt(item.budget),
                    parseInt(v.budget)
                );
                // Achieved
                v["totalWrokDone"] = partials.sumWrokDone(v.dpr);
                v["wdAmount"] = parseInt((v.budget * v["totalWrokDone"]) / 100);
                v.wdAmount = data.reduce(
                    (acc, item) => acc + parseInt(item.wdAmount),
                    parseInt(v.wdAmount)
                );
                // v["childs"] = data;
                v.budget > 0
                    ? (v["totalWrokDone"] = parseInt(
                          (v.wdAmount / v.budget) * 100
                      ))
                    : "";
                // let LagOrLead
                // suppose
                //total days = 14;
                //total budget = 5000;

                // finsh -  start;
                let total_days_req = partials.DiffInDays_dates(
                    v.finish,
                    v.start
                );
                v["total_days_req"] = total_days_req;
                let per_day_planed_budget = v.budget / total_days_req; // 357 Per day
                // today - start = 5;
                let Today =
                    new Date() > new Date(v.finish)
                        ? new Date(v.finish)
                        : new Date();
                let days_elapsed = partials.DiffInDays_dates(Today, v.start);
                let planed_value_todate = Math.round(
                    parseInt(per_day_planed_budget * days_elapsed)
                ); // 1785
                v["planedBudget"] = planed_value_todate;

                // Lag  will considered lead if the is negative
                // planed_value_todate- DPR total
                let Budget = v.budget == 0 ? 1 : v.budget;
                v["lag"] = Math.round(
                    (parseInt(planed_value_todate - v.wdAmount) / Budget) * 100
                );
                return v;
            }
        });
        return d.filter((a) => a !== undefined);
    };
    const allData = (dynamicData, staticData, id = null) => {
        let d = dynamicData.map((v, i) => {
            if (v.parent_id == id) {
                let data = allData(dynamicData, staticData, v.id);
                // Planed
                v.start = partials.MinDate(data, v.start);
                v.finish = partials.MaxDate(data, v.finish);
                v.budget = data.reduce(
                    (acc, item) => acc + parseInt(item.budget),
                    parseInt(v.budget)
                );
                // Achieved
                v["totalWrokDone"] = partials.sumWrokDone(v.dpr);
                v["wdAmount"] = parseInt((v.budget * v["totalWrokDone"]) / 100);
                v.wdAmount = data.reduce(
                    (acc, item) => acc + parseInt(item.wdAmount),
                    parseInt(v.wdAmount)
                );
                v["childs"] = data;
                v.budget > 0
                    ? (v["totalWrokDone"] = parseInt(
                          (v.wdAmount / v.budget) * 100
                      ))
                    : "";
                // let LagOrLead
                // suppose
                //total days = 14;
                //total budget = 5000;

                // finsh -  start;
                let total_days_req = partials.DiffInDays_dates(
                    v.finish,
                    v.start
                );
                v["total_days_req"] = total_days_req;
                let per_day_planed_budget = v.budget / total_days_req; // 357 Per day
                // today - start = 5;
                let Today =
                    new Date() > new Date(v.finish)
                        ? new Date(v.finish)
                        : new Date();
                let days_elapsed = partials.DiffInDays_dates(Today, v.start);
                let planed_value_todate = Math.round(
                    parseInt(per_day_planed_budget * days_elapsed)
                ); // 1785
                v["planedBudget"] = planed_value_todate;

                // Lag  will considered lead if the is negative
                // planed_value_todate- DPR total
                let Budget = v.budget == 0 ? 1 : v.budget;
                v["lag"] = Math.round(
                    (parseInt(planed_value_todate - v.wdAmount) / Budget) * 100
                );
                return v;
            }
        });
        return d.filter((a) => a !== undefined);
    };
    const del = () => {};
    useEffect(() => {
        getProjects();
    }, []);
    return (
        <DPRContext.Provider
            value={{
                index,
                setIndex,
                update,
                projects,
                setProjects,
                selectedProject,
                setSelectedProject,
                getData,
                store,
                update,
                del,
                progresData,
                setprogresData,
                updateProgressData,
                toggles,
                setToggles,
                showAlert,
                setMessage,
                partials,
                summarizeData,
                allData,
            }}
        >
            {props.children}
        </DPRContext.Provider>
    );
}

// export default DPR;
export { DPRContext };
