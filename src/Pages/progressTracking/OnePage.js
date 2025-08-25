import React, { memo, useEffect, useState, useContext } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableContainer,
  Paper,
  Typography,
  Stack,
  Dialog,
  Autocomplete,
  TextField,
  Box,
  Divider,
} from "@mui/material";
import Button from "@mui/material/Button";
import { Thead, Tfoot, OpRow } from "./OpRow";
import { Link } from "react-router-dom";
import ProgTrackingContext from "./context";
import LinearProgress from "@mui/material/LinearProgress";
import ExcelExport from "../partials/ExportToXL";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import API from "../../api/axiosApi";
import { useProjectsWithSchecuelsQuery } from "../../features/progressTracking/progressApi";
import { makeTree } from "./tree";
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const OnePager = () => {
  const {
    data = [],
    isLoading,
    isError,
  } = useProjectsWithSchecuelsQuery({ type: "data" });
  const [state, setState] = useState([]);
  const inMillions = (value) => {
    if (value && value > 1000000) {
      const inM = (value / 1000000).toFixed(2);
      return `${inM}(M)`;
    }
  };
  const sequentialFunciton = async () => {
    for (const v of data || []) {
      try {
        await delay(500);
        const schedule = await API.get("trackflow/progressTracking/show", {
          params: {
            project_id: v.project_id,
            data_type: "sch",
          },
        });
        // await delay(500);
        // const other = await API.get("trackflow/progressTracking/show", {
        //   params: {
        //     project_id: v.project_id,
        //     data_type: "other",
        //   },
        // });
        const newData = await makeTree(schedule?.data?.schedule);
        newData[0]["income"] = schedule?.data?.other.income;
        newData[0]["cogs"] = schedule?.data?.other.cogs;
        newData[0]["RCV"] = schedule?.data?.other.RCV;
        newData[0]["info"] = schedule?.data?.other.info;
        // IndexData.push(newData[0]);
        setState((prv) => {
          return [...prv, newData[0]];
        });
      } catch (error) {
        console.log(error);
      }
    }
  };
  useEffect(() => {
    sequentialFunciton();
  }, [data]);
  useEffect(() => {
    console.log("State data", state);
  }, [state]);
  return (
    <>
      <Stack
        direction={"row"}
        sx={{
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
        }}
        spacing={1}
      >
        {/* <CreatNew setRefresh={setRefresh} /> */}
        {/* <ExcelExport data={dataForExcel()} fileName={"Progress Tracking"} /> */}
      </Stack>
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: "75vh" }}>
          {isLoading && <LinearProgress />}
          <Table stickyHeader>
            <Thead />
            <TableBody>
              {state?.map((v, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Typography variant="body2" gutterBottom>
                      {v.info && v.info.name}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2" gutterBottom className="1">
                      {v.info ? inMillions(v.info.tcost) : 0}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2" gutterBottom className="2">
                      {inMillions(v.budget)}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2" gutterBottom className="3">
                      {inMillions(v.wdAmount)}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2" gutterBottom className="4">
                      {inMillions(v.planedBudget)}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2" gutterBottom className="5">
                      {parseInt((v.planedBudget / v.budget) * 100)}%
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2" gutterBottom className="6">
                      {parseInt((v.wdAmount / v.budget) * 100)}%
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2" gutterBottom className="7">
                      {v.lag}%
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2" gutterBottom className="8">
                      {inMillions(v.income)}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2" gutterBottom className="9">
                      {inMillions(v.RCV)}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2" gutterBottom className="10">
                      {inMillions(parseInt(v.wdAmount - v.RCV))}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2" gutterBottom className="11">
                      {inMillions(parseInt(v.income - v.RCV))}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2" gutterBottom className="12">
                      {inMillions(v.cogs)}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2" gutterBottom className="13">
                      {inMillions(parseInt(v.wdAmount - v.cogs))}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2" gutterBottom className="14">
                      {inMillions(parseInt(v.income - v.cogs))}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <Tfoot totals={[]} />
          </Table>
        </TableContainer>
      </Paper>
    </>
  );
};
export default memo(OnePager);

// const CreatNew = ({ setRefresh }) => {
//   const [state, setState] = useState({ project: { id: "", name: "" } });
//   const [projects, setProjects] = useState([]);
//   const [open, setOpen] = useState(false);
//   const [errors, setErrors] = useState({});
//   const hanldeSubmit = () => {
//     console.log({
//       project_id: state.project.id,
//       type: "milestone",
//       activity_name: state.project.name,
//     });
//     const data = {
//       project_id: state.project.id,
//       type: "milestone",
//       activity_name: state.project.name,
//     };
//     API.post("trackflow.progressTracking.store", { params: data }).then(
//       (res) => {
//         if (res.status == 200) {
//           if (res.data.errors) {
//             console.log(res.data.errors);
//           } else {
//             setOpen(false);
//             setRefresh(true);
//           }
//         }
//       }
//     );
//   };
//   useEffect(() => {
//     API.get("trackflow.progressTracking.index", {
//       params: { type: "projects" },
//     }).then((res) => {
//       setProjects(res.data.data);
//       console.log(res.data.data);
//     });
//   }, []);
//   return (
//     <>
//       <Button variant="outlined" onClick={() => setOpen(true)}>
//         Create WBS
//       </Button>
//       <Dialog open={open} onClose={() => setOpen(false)}>
//         <Box sx={{ p: 4, width: { sm: "100vw", md: "25vw" } }}>
//           <Typography variant="h6" gutterBottom>
//             Create New Tracking
//           </Typography>

//           <Autocomplete
//             options={projects}
//             getOptionLabel={(option) => option.name}
//             value={state.project}
//             onChange={(event, value) => {
//               setState({ ...state, project: value });
//             }}
//             renderInput={(params) => (
//               <TextField fullWidth {...params} label="Select Project" />
//             )}
//           ></Autocomplete>
//           <Divider sx={{ my: 2 }} />
//           <Button variant="contained" onClick={hanldeSubmit}>
//             Submit
//           </Button>
//         </Box>
//       </Dialog>
//     </>
//   );
// };
