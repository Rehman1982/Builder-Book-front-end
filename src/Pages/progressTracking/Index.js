import React, { useState, useEffect, useContext } from "react";
import ProgTrackingContext from "./context";
import ProjectSelector from "./ProjectSelector";
import { CreateActivity, EditActivity } from "./Activity";
import { CreateMileStone, EditMileStone } from "./MileStone";
import SingleContents from "./Single";
import Delete from "./Delete";
import { useParams } from "react-router-dom";
import { TextField, Box, Button, Stack, Grid } from "@mui/material";
import Provider from "./Provider";
import { Routes, Route } from "react-router-dom";
import OnePager from "./OnePage";
import Create from "./Create";
import { red } from "@mui/material/colors";
// import OnePager from "./OnePage";
const ProgTracking = () => {
  let { id } = useParams();
  return (
    <Routes>
      {/* <Route path="" element={<Provider />}> */}
      <Route index element={<OnePager />} />
      <Route path="Create" element={<Create />} />
      <Route
        path="project/:id"
        element={
          <>
            <SnakeBar />
            <Delete />
            <SingleContents />
          </>
        }
      />
      {/* </Route> */}
    </Routes>
  );
};
const Header = () => {
  const [state, setState] = useState({ date: new Date() });
  let { id } = useParams();
  const [from, setFrom] = useState();
  const [to, setTo] = useState();
  const { CURD } = useContext(ProgTrackingContext);
  const updateProgress = () => {
    console.log(id, from, to);
    CURD.getData(id, from, to);
  };
  // const { selectedProject } = useContext(ProgTrackingContext);
  return (
    <Stack
      direction={"row"}
      sx={{ justifyContent: "space-between", alignItems: "center" }}
    >
      <Grid container spacing={1} marginBottom={1}>
        <Grid item>
          <TextField
            type="date"
            name="from"
            size="small"
            value={from}
            onChange={(e) => {
              setFrom(e.target.value);
            }}
          />
        </Grid>
        <Grid item>
          <TextField
            type="date"
            name="to"
            size="small"
            value={to}
            onChange={(e) => {
              setTo(e.target.value);
            }}
          />
        </Grid>
        <Grid item>
          <Button
            onClick={updateProgress}
            variant="outlined"
            sx={{ height: "100%" }}
          >
            Update
          </Button>
        </Grid>
      </Grid>
      {/* <CreateActivity /> */}
      {/* <CreateMileStone /> */}
    </Stack>
  );
};
const SnakeBar = () => {
  const { toggles, setToggles, message, setMessage, closeBtn } =
    useContext(ProgTrackingContext);
  const [toggle, setToggle] = useState("-50vh");
  useEffect(() => {
    if (toggles.snakeBar) {
      setToggle("10vh");
      const Timer = setTimeout(() => {
        setToggle("-50vh");
        setToggles({ ...toggles, snakeBar: false });
      }, 2500);
    }
  }, [toggles]);
  const style = {
    container: {
      position: "fixed",
      top: toggle,
      right: "2%",
      zIndex: "2000",
      padding: "20px",
      backgroundColor: "#4cb600",
      color: "white",
      transition: "all 0.5s ease-in-out",
      borderRadius: "8px",
    },
  };
  return (
    <div className="col-12 col-md-4" style={style.container}>
      <div>
        <i className="fa fa-close" style={closeBtn}></i>
        {message}
      </div>
    </div>
  );
};
export default ProgTracking;
