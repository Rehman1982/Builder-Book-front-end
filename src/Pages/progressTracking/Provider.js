// import React, { useCallback, useEffect, useState, useContext } from "react";
// import ProgTrackingContext from "./context";
// import { Outlet, useParams } from "react-router-dom";
// import { Alert } from "../../context/AlertBar/AlertBar";
// import axios from "axios";
// import API from "../../api/axiosApi";
// const Provider = (props) => {
//   const { id } = useParams();
//   const { showAlert, setMessage } = useContext(Alert);
//   const [projects, setProjects] = useState([]);
//   const [selectedProject, setSelectedProject] = useState({ id: "" });
//   const [index, setIndex] = useState([]);
//   const [toggles, setToggles] = useState({
//     snakeBar: false,
//     menu: false,
//     deleteForm: false,
//     editMilestone: false,
//     editActivity: false,
//   });
//   const [editState, setEditState] = useState({});
//   const closeBtn = {
//     position: "absolute",
//     top: "0",
//     right: "0",
//     padding: "10px",
//     cursor: "pointer",
//     fontSize: "1.2rem",
//   };
//   const CURD = {
//     getData: async (project_id, from = null, to = null) => {
//       const url = "progressTracking.show";
//       const scheduleData = await API.get(url, {
//         params: {
//           progressTracking: "1",
//           project_id: project_id,
//           data_type: "sch",
//           from: from,
//           to: to,
//         },
//       }).then((resp) => resp.data.data);
//       setIndex(scheduleData);
//     },
//     getOnePagerData: async () => {
//       const url = "progressTracking.index";
//       const response = await fetch(url, { params: { type: "data" } })
//         .then((res) => res.json())
//         .then((data) => data)
//         .catch((error) => {
//           console.log(error);
//         });
//       return response;
//     },
//     store: useCallback(async (data) => {
//       console.log(data);
//       const url = "progressTracking.store";
//       const header = {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "X-CSRF-TOKEN": document.getElementById("token").value,
//         },
//         body: JSON.stringify(data),
//       };
//       const response = await fetch(url, header)
//         .then((res) => res.json())
//         .then((data) => data)
//         .catch((err) => {
//           console.log(err);
//         });
//       CURD.getData(selectedProject.id);
//       return response;
//     }, []),
//     update: useCallback(async (data) => {
//       const url = "progressTracking.update",
//         paarams = {
//           progressTracking: "1",
//         };
//       const header = {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           "X-CSRF-TOKEN": document.getElementById("token").value,
//         },
//         body: JSON.stringify(data),
//       };
//       const response = await fetch(url, header)
//         .then((res) => res.json())
//         .then((data) => data)
//         .catch((err) => {
//           console.log(err);
//         });
//       CURD.getData(selectedProject.id);
//       return response;
//     }, []),
//     del: useCallback(async (data) => {
//       const url = "progressTracking.destroy",
//         paarams = {
//           progressTracking: "1",
//         };
//       const header = {
//         method: "DELETE",
//         headers: {
//           "Content-Type": "application/json",
//           "X-CSRF-TOKEN": document.getElementById("token").value,
//         },
//         body: JSON.stringify(data),
//       };
//       const response = await fetch(url, header)
//         .then((res) => res.json())
//         .then((data) => data)
//         .catch((err) => {
//           console.log(err);
//         });
//       CURD.getData(selectedProject.id);
//       return response;
//     }, []),
//   };
//   const Partials = {
//     date: (date) => {
//       // YYYY-MM-DD
//       let dt = new Date(date);
//       dt = `${dt.getFullYear()}-${dt.getMonth() + 1}-${dt.getDate()}`;
//       return dt;
//       return new Date(dt);
//     },
//     DiffInDays_dates: (Max, Min) => {
//       let Minn = new Date(Min);
//       let Maxx = new Date(Max);
//       if (Minn > Maxx) {
//         return 0;
//       } else {
//         let a = new Date(
//           `${Maxx.getFullYear()}-${Maxx.getMonth() + 1}-${Maxx.getDate()}`
//         );
//         let b = new Date(
//           `${Minn.getFullYear()}-${Minn.getMonth() + 1}-${Minn.getDate()}`
//         );
//         return Math.round((a - b) / 86400000) + 1;
//       }
//     },
//     MinDate: (data, startVal) => {
//       const resp = data.reduce(
//         (acc, item) => {
//           if (acc.start !== null) {
//             if (new Date(item.start) < new Date(acc.start)) {
//               acc.start = item.start;
//             }
//           } else {
//             acc.start = item.start;
//           }
//           return acc;
//         },
//         { start: startVal }
//       );
//       return resp.start;
//     },
//     MaxDate: (data, startVal) => {
//       const resp = data.reduce(
//         (acc, item) => {
//           if (acc.finish !== null) {
//             if (new Date(item.finish) > new Date(acc.finish)) {
//               acc.finish = item.finish;
//             }
//           } else {
//             acc.finish = item.finish;
//           }
//           return acc;
//         },
//         { finish: startVal }
//       );
//       return resp.finish;
//     },
//     sumWrokDone: (dpr, upto = null) => {
//       if (dpr.length > 0) {
//         return dpr.reduce((total, current) => {
//           if (upto == null) {
//             return total + parseInt(current.work_done);
//           } else {
//             if (
//               new Date(Partials.date(current.created_at)) <=
//               new Date(Partials.date(upto))
//             ) {
//               return total + parseInt(current.work_done);
//               // return (total > 0) ? total : 0;
//             } else {
//               return total;
//             }
//           }
//         }, 0);
//       } else {
//         return 0;
//       }
//     },
//     DPRs: (v, data) => {
//       let first, last, diff;
//       if (v.dpr) {
//         first = v.dpr.length > 0 ? Partials.date(v.dpr[0]["created_at"]) : null;
//         last =
//           v.dpr.length > 0
//             ? Partials.date(v.dpr[v.dpr.length - 1]["created_at"])
//             : "";

//         // if (first !== "") {
//         first = data.reduce((acc, item) => {
//           if (acc !== null) {
//             if (new Date(item["AchStart"]) < new Date(acc)) {
//               acc = item["AchStart"];
//             }
//           } else {
//             acc = v.AchStart;
//           }
//           return acc;
//         }, v.AchStart);
//         // }

//         last = data.reduce((acc, item) => {
//           if (acc !== null) {
//             if (new Date(item["AchFinish"]) > new Date(acc)) {
//               acc = item["AchFinish"];
//             }
//           } else {
//             acc = item["AchFinish"];
//           }

//           return acc;
//         }, last);

//         diff = data.reduce(
//           (acc, item) => acc + item["AchDiff"],
//           Partials.DiffInDays_dates(last, first)
//         );
//       }
//       return { first, last, diff };
//     },
//     getProjects: () => {
//       const url = "progressTracking.index";
//       fetch(url, { type: "projects" })
//         .then((res) => res.json())
//         .then((data) => {
//           if (data.success) {
//             setProjects(data.data.projects);
//             // setIndex(data.data.index);
//           }
//         });
//     },
//     summarizeData: (staticData, Dynamicdata, id = null) => {
//       let d = Dynamicdata.map((v, i) => {
//         if (v.parent_id == id) {
//           let data = Partials.summarizeData(staticData, Dynamicdata, v.id);
//           // Journals values
//           // Planed
//           v.start = Partials.MinDate(data, v.start);
//           v.finish = Partials.MaxDate(data, v.finish);
//           v.budget = data.reduce(
//             (acc, item) => acc + parseInt(item.budget),
//             parseInt(v.budget)
//           );
//           // Achieved
//           v["totalWrokDone"] = Partials.sumWrokDone(v.dpr); // workdone in Percentaget
//           v["wdAmount"] = parseInt((v.budget * v["totalWrokDone"]) / 100); // work done in Rupees
//           v.wdAmount = data.reduce(
//             (acc, item) => acc + parseInt(item.wdAmount),
//             parseInt(v.wdAmount) || 0
//           );
//           // v["childs"] = data;
//           v.budget > 0
//             ? (v["totalWrokDone"] = parseInt((v.wdAmount / v.budget) * 100))
//             : "";
//           let total_days_req = Partials.DiffInDays_dates(v.finish, v.start);
//           v["total_days_req"] = total_days_req;
//           let per_day_planed_budget = v.budget / total_days_req; // 357 Per day
//           // today - start = 5;
//           let Today =
//             new Date() > new Date(v.finish) ? new Date(v.finish) : new Date();
//           let days_elapsed = Partials.DiffInDays_dates(Today, v.start);
//           let planed_value_todate = Math.round(
//             parseInt(per_day_planed_budget * days_elapsed)
//           ); // 1785
//           v["planedBudget"] = planed_value_todate;
//           let Budget = v.budget == 0 ? 1 : v.budget;
//           v["lag"] = Math.round(
//             (parseInt(planed_value_todate - v.wdAmount) / Budget) * 100
//           );
//           return v;
//         }
//       });
//       return d.filter((a) => a !== undefined);
//     },
//   };
//   useEffect(() => {
//     // console.log("Providers useEffect avvv");
//     // Partials.getProjects();
//     // CURD.getData(id);
//   }, []);
//   return (
//     <ProgTrackingContext.Provider
//       value={{
//         Partials,
//         CURD,
//         editState,
//         setEditState,
//         showAlert,
//         setMessage,
//         index,
//         projects,
//         setProjects,
//         selectedProject,
//         setSelectedProject,
//         toggles,
//         setToggles,
//         closeBtn,
//       }}
//     >
//       {/* {props.children} */}
//       <Outlet />
//     </ProgTrackingContext.Provider>
//   );
// };
// export default Provider;
