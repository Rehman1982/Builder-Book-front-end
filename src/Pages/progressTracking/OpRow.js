// import React, { useCallback, useEffect, useState, memo } from "react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableRow,
//   TableContainer,
//   TableHead,
//   TableFooter,
//   Paper,
//   Switch,
// } from "@mui/material";
// import Partials from "./Partials";
// import Typography from "@mui/material/Typography";
// import { green } from "@mui/material/colors";
// import Skeleton from "@mui/material/Skeleton";
// import { Link } from "react-router-dom";
// import axios from "axios";
// const OpRow = memo((data) => {
//   const [alldata, setAlldata] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const summarizeData = (staticData, Dynamicdata, id = null) => {
//     let d = Dynamicdata.map((v, i) => {
//       if (v.parent_id == id) {
//         let data = summarizeData(staticData, Dynamicdata, v.id);
//         // Journals values
//         // Planed
//         v.start = Partials.MinDate(data, v.start);
//         v.finish = Partials.MaxDate(data, v.finish);
//         v.budget = data.reduce(
//           (acc, item) => acc + parseInt(item.budget),
//           parseInt(v.budget)
//         );
//         // Achieved
//         v["totalWrokDone"] = Partials.sumWrokDone(v.dpr); // workdone in Percentaget
//         v["wdAmount"] = parseInt((v.budget * v["totalWrokDone"]) / 100); // work done in Rupees
//         v.wdAmount = data.reduce(
//           (acc, item) => acc + parseInt(item.wdAmount),
//           parseInt(v.wdAmount)
//         );
//         // v["childs"] = data;
//         v.budget > 0
//           ? (v["totalWrokDone"] = parseInt((v.wdAmount / v.budget) * 100))
//           : "";
//         let total_days_req = Partials.DiffInDays_dates(v.finish, v.start);
//         v["total_days_req"] = total_days_req;
//         let per_day_planed_budget = v.budget / total_days_req; // 357 Per day
//         // today - start = 5;
//         let Today =
//           new Date() > new Date(v.finish) ? new Date(v.finish) : new Date();
//         let days_elapsed = Partials.DiffInDays_dates(Today, v.start);
//         let planed_value_todate = Math.round(
//           parseInt(per_day_planed_budget * days_elapsed)
//         ); // 1785
//         v["planedBudget"] = planed_value_todate;
//         let Budget = v.budget == 0 ? 1 : v.budget;
//         v["lag"] = Math.round(
//           (parseInt(planed_value_todate - v.wdAmount) / Budget) * 100
//         );
//         return v;
//       }
//     });
//     return d.filter((a) => a !== undefined);
//   };
//   const Get = useCallback(
//     async (project_id) => {
//       const url = route("progressTracking.show", {
//         progressTracking: "1",
//         project_id: project_id,
//         data_type: "sch",
//       });
//       const scheduleData = await axios.get(url).then((resp) => resp.data.data);

//       const otherurl = route("progressTracking.show", {
//         progressTracking: "1",
//         project_id: project_id,
//         data_type: "other",
//       });
//       const other = await axios.get(otherurl).then((resp) => resp.data.data);

//       let newData = summarizeData(scheduleData, scheduleData);
//       newData[0]["income"] = other.income;
//       newData[0]["cogs"] = other.cogs;
//       newData[0]["RCV"] = other.RCV;
//       newData[0]["info"] = other.info;
//       setAlldata(newData);
//     },
//     [alldata]
//   );
//   useEffect(() => {
//     setIsLoading(true);
//     Get(data.project.project_id).then(() => setIsLoading(false));
//   }, []);
//   return (
//     <>
//       {alldata.map((v, i) => (
//         <TableRow key={i}>
//           <TableCell>
//             <Link to={"/progressTracking/project/" + v.project_id}>
//               <Typography variant="body2" gutterBottom>
//                 {v.project_id}:{v.info && v.info.name}
//               </Typography>
//             </Link>
//           </TableCell>
//           <TableCell align="center">
//             <Typography variant="body2" gutterBottom className="1">
//               {v.info ? v.info.tcost : 0}
//             </Typography>
//           </TableCell>
//           <TableCell align="center">
//             <Typography variant="body2" gutterBottom className="2">
//               {" "}
//               {v.budget}
//             </Typography>
//           </TableCell>
//           <TableCell align="center">
//             <Typography variant="body2" gutterBottom className="3">
//               {" "}
//               {v.wdAmount}
//             </Typography>
//           </TableCell>
//           <TableCell align="center">
//             <Typography variant="body2" gutterBottom className="4">
//               {" "}
//               {v.planedBudget}
//             </Typography>
//           </TableCell>
//           <TableCell align="center">
//             <Typography variant="body2" gutterBottom className="5">
//               {parseInt((v.planedBudget / v.budget) * 100)}%
//             </Typography>
//           </TableCell>
//           <TableCell align="center">
//             <Typography variant="body2" gutterBottom className="6">
//               {parseInt((v.wdAmount / v.budget) * 100)}%
//             </Typography>
//           </TableCell>
//           <TableCell align="center">
//             <Typography variant="body2" gutterBottom className="7">
//               {v.lag}%
//             </Typography>
//           </TableCell>
//           <TableCell align="center">
//             <Typography variant="body2" gutterBottom className="8">
//               {v.income}
//             </Typography>
//           </TableCell>
//           <TableCell align="center">
//             <Typography variant="body2" gutterBottom className="9">
//               {v.RCV}
//             </Typography>
//           </TableCell>
//           <TableCell align="center">
//             <Typography variant="body2" gutterBottom className="10">
//               {parseInt(v.income - v.RCV)}
//             </Typography>
//           </TableCell>
//           <TableCell align="center">
//             <Typography variant="body2" gutterBottom className="11">
//               {parseInt(v.wdAmount - v.income)}
//             </Typography>
//           </TableCell>
//           <TableCell align="center">
//             <Typography variant="body2" gutterBottom className="12">
//               {v.cogs}
//             </Typography>
//           </TableCell>
//           <TableCell align="center">
//             <Typography variant="body2" gutterBottom className="13">
//               {parseInt(v.wdAmount - v.cogs)}
//             </Typography>
//           </TableCell>
//           <TableCell align="center">
//             <Typography variant="body2" gutterBottom className="14">
//               {parseInt(v.income - v.cogs)}
//             </Typography>
//           </TableCell>
//         </TableRow>
//       ))}
//     </>
//   );
// });
// const Thead = () => {
//   return (
//     <TableHead sx={{ backgroundColor: green[300] }}>
//       <TableRow elevation={3}>
//         <TableCell>
//           <Typography variant="body2" gutterBottom>
//             Project Name
//           </Typography>
//         </TableCell>
//         <TableCell align="center">
//           <Typography variant="body2" gutterBottom>
//             CV
//           </Typography>
//         </TableCell>
//         <TableCell align="center">
//           <Typography variant="body2" gutterBottom>
//             TBC
//           </Typography>
//         </TableCell>
//         <TableCell align="center">
//           <Typography variant="body2" gutterBottom>
//             EV
//           </Typography>
//         </TableCell>
//         <TableCell align="center">
//           <Typography variant="body2" gutterBottom>
//             PV
//           </Typography>
//         </TableCell>
//         <TableCell align="center">
//           <Typography variant="body2" gutterBottom>
//             % Sch
//           </Typography>
//         </TableCell>
//         <TableCell align="center">
//           <Typography variant="body2" gutterBottom>
//             % comp:
//           </Typography>
//         </TableCell>
//         <TableCell align="center">
//           <Typography variant="body2" gutterBottom>
//             % Lag
//           </Typography>
//         </TableCell>
//         <TableCell align="center">
//           <Typography variant="body2" gutterBottom>
//             VV
//           </Typography>
//         </TableCell>
//         <TableCell align="center">
//           <Typography variant="body2" gutterBottom>
//             RCVD:
//           </Typography>
//         </TableCell>
//         <TableCell align="center">
//           <Typography variant="body2" gutterBottom>
//             Slip (EV - RCVD)
//           </Typography>
//         </TableCell>
//         <TableCell align="center">
//           <Typography variant="body2" gutterBottom>
//             Slip (VV - RCVBL)
//           </Typography>
//         </TableCell>
//         <TableCell align="center">
//           <Typography variant="body2" gutterBottom>
//             EXP
//           </Typography>
//         </TableCell>
//         <TableCell align="center">
//           <Typography variant="body2" gutterBottom>
//             FH-EV
//           </Typography>
//         </TableCell>
//         <TableCell align="center">
//           <Typography variant="body2" gutterBottom>
//             FH-VV
//           </Typography>
//         </TableCell>
//       </TableRow>
//     </TableHead>
//   );
// };
// const Tfoot = (props) => {
//   return (
//     <>
//       <TableFooter style={{ backgroundColor: green[200], fontWeight: "bold" }}>
//         <TableRow>
//           <TableCell>
//             <Typography variant="body2" fontWeight={700} gutterBottom>
//               Total(M)
//             </Typography>
//           </TableCell>
//           <TableCell align="center">
//             <Typography variant="body2" fontWeight={700} gutterBottom>
//               {props.totals.cv}
//             </Typography>
//           </TableCell>
//           <TableCell align="center">
//             <Typography variant="body2" fontWeight={700} gutterBottom>
//               {props.totals.tbc}
//             </Typography>
//           </TableCell>
//           <TableCell align="center">
//             <Typography variant="body2" fontWeight={700} gutterBottom>
//               {props.totals.ev}
//             </Typography>
//           </TableCell>
//           <TableCell align="center">
//             <Typography variant="body2" fontWeight={700} gutterBottom>
//               {props.totals.pv}
//             </Typography>
//           </TableCell>
//           <TableCell align="center">
//             <Typography variant="body2" fontWeight={700} gutterBottom>
//               {props.totals.psch}
//             </Typography>
//           </TableCell>
//           <TableCell align="center">
//             <Typography variant="body2" fontWeight={700} gutterBottom>
//               {props.totals.pcomp}
//             </Typography>
//           </TableCell>
//           <TableCell align="center">
//             <Typography variant="body2" fontWeight={700} gutterBottom>
//               {props.totals.plag}
//             </Typography>
//           </TableCell>
//           <TableCell align="center">
//             <Typography variant="body2" fontWeight={700} gutterBottom>
//               {props.totals.vv}
//             </Typography>
//           </TableCell>
//           <TableCell align="center">
//             <Typography variant="body1" fontWeight={700} gutterBottom>
//               {props.totals.rcv}
//             </Typography>
//           </TableCell>
//           <TableCell align="center">
//             <Typography variant="body1" fontWeight={700} gutterBottom>
//               {props.totals.slip}
//             </Typography>
//           </TableCell>
//           <TableCell align="center">
//             <Typography variant="body1" fontWeight={700} gutterBottom>
//               {props.totals.slip1}
//             </Typography>
//           </TableCell>
//           <TableCell align="center">
//             <Typography variant="body1" fontWeight={700} gutterBottom>
//               {props.totals.exp}
//             </Typography>
//           </TableCell>
//           <TableCell align="center">
//             <Typography variant="body1" fontWeight={700} gutterBottom>
//               {props.totals.fhev}
//             </Typography>
//           </TableCell>
//           <TableCell align="center">
//             <Typography variant="body1" fontWeight={700} gutterBottom>
//               {props.totals.fhvv}
//             </Typography>
//           </TableCell>
//         </TableRow>
//       </TableFooter>
//     </>
//   );
// };

// export { Thead, Tfoot, OpRow };
