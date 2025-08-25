import React, { useState } from "react";
import {
  Avatar,
  List as LI,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemText,
  Button,
  ButtonGroup,
  Divider,
  Chip,
  Typography,
  Stack,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteForever from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import { Link, Outlet } from "react-router-dom";
import { lightGreen, orange, pink } from "@mui/material/colors";
import { useEffect, useContext } from "react";
import axios from "axios";
import { Alert } from "../../../context/AlertBar/AlertBar";
import { getFullName } from "../../helpers/helpers";
import API from "../../../api/axiosApi";
const Item = ({ primaryText, secondaryText, sno, id }) => {
  return (
    <>
      <ListItem divider>
        <ListItemAvatar>
          <Avatar>{sno}</Avatar>
        </ListItemAvatar>
        <ListItemText primary={primaryText} secondary={secondaryText} />
        <RightMenu id={id} />
      </ListItem>
    </>
  );
};

export default function List() {
  const [state, setState] = useState([]);
  const { showAlert, setMessage, setSeverity } = useContext(Alert);
  useEffect(() => {
    API.get("payroll.employee.index")
      .then((res) => {
        console.log(res.status);
        if (res.data == 200) {
          if (res.data.success) {
            console.log(res.data.data);
            setState(res.data.data);
          }
        } else if (res.status == 203) {
          setMessage(res.data);
          setSeverity("error");
          showAlert(true);
        }
      })
      .finally((res) => console.log(res));
  }, []);
  return (
    <>
      <Stack
        direction={"row"}
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography variant="h6">Employees </Typography>
        <Link to="/payroll/employee/create">
          <Tooltip title="Create New Employee">
            <IconButton>
              <Avatar sx={{ backgroundColor: lightGreen[300] }}>
                <AddIcon />
              </Avatar>
            </IconButton>
          </Tooltip>
        </Link>
      </Stack>
      <LI>
        {state.map((v, i) => (
          <Item
            key={v.id}
            primaryText={getFullName(v.firstName, v.middleName, v.LastName)}
            secondaryText={v.designation.title}
            sno={i + 1}
            id={v.id}
          />
        ))}
      </LI>
    </>
  );
}

function RightMenu({ id }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleEdit = () => {};
  return (
    <>
      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={open ? "long-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem
          // disableGutters
          key={1}
          onClick={() => {
            handleClose();
          }}
          component={Link}
          to="/public/payroll/employee/create"
          state={{ id: id }}
        >
          {/* <ListItemAvatar> */}
          <Avatar>
            <EditIcon color="warning" />
          </Avatar>
          {/* </ListItemAvatar> */}
          {/* <ListItemText
                        primary="Edit"
                        primaryTypographyProps={{ color: orange[500] }}
                    /> */}
        </MenuItem>
        <MenuItem
          key={2}
          onClick={() => {
            handleClose();
          }}
        >
          {/* <ListItemAvatar> */}
          <Avatar sx={{ backgroundColor: pink[100] }}>
            <DeleteForever color="error" />
          </Avatar>
          {/* </ListItemAvatar> */}
          {/* <ListItemText
                        primary="Delete"
                        primaryTypographyProps={{ color: pink[500] }}
                    /> */}
        </MenuItem>
      </Menu>
    </>
  );
}
