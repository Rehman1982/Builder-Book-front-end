import * as React from "react";
import {
  Box,
  Toolbar,
  List,
  Typography,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Tooltip,
  Button,
  Container,
  Paper,
  Drawer,
  useMediaQuery,
  Icon,
  Menu,
  MenuItem,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import MuiAppBar from "@mui/material/AppBar";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { blue, deepOrange, green, grey, orange } from "@mui/material/colors";
import {
  Link,
  NavLink,
  Outlet,
  useLocation,
  useLoaderData,
  useNavigate,
  useNavigation,
} from "react-router-dom";
import { Home } from "@mui/icons-material";
import { useState } from "react";
import { useEffect } from "react";
import MenuLoader from "../MenuLoader/MenuLoader";
import API from "../../api/axiosApi";
import { useDispatch, useSelector } from "react-redux";
import { setActiveCompany, setUser } from "../../features/auth/authSlice";
import { useLogoutMutation } from "../../features/auth/authApi";
import Alert from "../ui/Alert";

const drawerWidth = 240;
const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100%)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

export default function LayoutAfterLogin(props) {
  const { activeCompany } = useSelector((state) => state.authSlice);
  const dispatch = useDispatch();
  const currentUser = useLoaderData();
  const [open, setOpen] = React.useState(false);
  useEffect(() => {
    dispatch(setUser(currentUser));
    dispatch(setActiveCompany(currentUser?.company));
  }, []);
  return (
    <Box sx={{ display: "flex" }}>
      <Alert />
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={() => setOpen(true)}
            edge="start"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>

          <Box sx={{ height: 50 }} component={"img"} src="./Mianlogo.png" />

          <Box
            sx={{
              marginLeft: "auto",
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            {/* <CompanyChange
              activeCompany={activeCompany}
              setActiveCompany={setActiveCompany}
            /> */}
            <UserMenu />
          </Box>
        </Toolbar>
      </AppBar>
      <SmallDrawar
        open={open}
        setOpen={setOpen}
        activeCompany={activeCompany}
      />
      <Container component="main">
        <DrawerHeader />
        <Box sx={{ mb: 2 }}></Box>
        <MenuLoader>
          <Outlet />
        </MenuLoader>
      </Container>
    </Box>
  );
}

const DrawerContents = ({ open, setOpen }) => {
  const { currentUser: user, activeCompany } = useSelector(
    (state) => state.authSlice
  );
  //   const { user } = useContext(AuthContext);
  const [menuItem, setMenuItem] = React.useState([]);
  const getMenuItems = async () => {
    try {
      const result = await API.get("menu", {
        params: {
          for: "data",
          type: "parent",
        },
      });
      setMenuItem(result.data);
    } catch (error) {
      console.log(error);
    }
  };
  React.useEffect(() => {
    getMenuItems();
  }, [activeCompany]);
  return (
    <Box sx={{ width: open ? drawerWidth : 80 }}>
      <DrawerHeader>
        <IconButton onClick={() => setOpen(false)}>
          {!open ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </DrawerHeader>
      <List>
        {menuItem.map((v) => (
          <Item
            key={v.id}
            id={v.id}
            open={open}
            route={v.href || ""}
            text={v.title}
            icon={v.icon}
          />
        ))}
        <Item
          open={open}
          route={"company"}
          text={"Comapnies"}
          icon={"business"}
        />
      </List>
    </Box>
  );
};
const SmallDrawar = ({ open, setOpen }) => {
  const { activeCompany } = useSelector((state) => state.authSlice);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("lg"));
  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={() => setOpen(false)}
      variant={isSmallScreen ? "temporary" : "permanent"}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      sx={{
        width: open ? drawerWidth : 80,
        flexShrink: 0,
        transition: "all 0.4s ease-in-out",
        // "& .MuiDrawer-paper": {
        //     // width: drawerWidth,
        //     boxSizing: "border-box",
        // },
      }}
    >
      <DrawerContents
        open={open}
        setOpen={setOpen}
        activeCompany={activeCompany}
      />
    </Drawer>
  );
};
const Item = ({ open, route, text, icon, id }) => {
  const Navigate = useLocation();
  return (
    <ListItem
      divider
      key={1}
      disablePadding
      sx={{
        display: "block",
        bgcolor: Navigate.pathname == `${route}` ? blue[200] : "",
      }}
    >
      <ListItemButton
        component={NavLink}
        to={route}
        state={{ parent_id: id, title: text }}
        sx={{
          minHeight: 48,
          justifyContent: open ? "initial" : "center",
          px: 2.5,
        }}
      >
        <ListItemIcon
          sx={{
            minWidth: 0,
            mr: open ? 3 : "auto",
            justifyContent: "center",
          }}
        >
          <Avatar
            sx={{ backgroundColor: blue[500] }}
            children={<Icon>{icon || "chevron_right"}</Icon>}
          ></Avatar>
        </ListItemIcon>
        <ListItemText
          primary={
            <Typography variant="body1" fontWeight={550}>
              {text}
            </Typography>
          }
          sx={{ opacity: open ? 1 : 0 }}
        />
      </ListItemButton>
    </ListItem>
  );
};
const RightItem = ({ route, icon }) => (
  <Tooltip title={route}>
    <Button color="inherit" component={Link} to={route}>
      <Avatar
        sx={{
          color: blue[100],
          border: 2,
          borderColor: blue[200],
          background: "transparent",
          ":hover": { backgroundColor: deepOrange[400] },
        }}
        children={icon}
      ></Avatar>
    </Button>
  </Tooltip>
);

const CompanyChange = () => {
  const navigate = useNavigation();
  const dispatch = useDispatch();
  const { activeCompany } = useSelector((state) => state.authSlice);
  const [companies, setCompanies] = useState([]);
  const [open, setOpen] = useState(null);
  const getCompany = async () => {
    try {
      const result = await API.get("company", {
        params: {
          type: "data",
        },
      });
      setCompanies([...result.data.associated, ...result.data.owned]);
      // console.log(result);
    } catch (error) {
      console.log(error);
    }
  };
  const handleActivate = async (company) => {
    try {
      const result = await API.post("company/activate", {
        company: company,
      });
      console.log(result);
      if (result.status === 200) {
        dispatch(setActiveCompany(company));
        setOpen(null);
      }
    } catch (error) {}
  };
  useEffect(() => {
    getCompany();
  }, []);
  return (
    <>
      <Button
        onClick={(e) => setOpen(e.currentTarget)}
        variant="text"
        sx={{ color: grey[100] }}
        endIcon={
          <Icon children={open ? "keyboard_arrow_up" : "keyboard_arrow_down"} />
        }
      >
        <Typography variant="body1">
          {activeCompany &&
            companies.find((comp, i) => comp.id == activeCompany)?.company_name}
        </Typography>
      </Button>
      <Menu open={Boolean(open)} onClose={() => setOpen(null)} anchorEl={open}>
        {companies?.map((company, i) => (
          <MenuItem
            onClick={() => handleActivate(company.id)}
            key={company.id}
            value={company.id}
            sx={{
              px: 2,
              py: 1,
              bgcolor: company.id == activeCompany && blue[200],
            }}
          >
            <Box
              sx={{ mr: 1, borderRadius: 50, p: 0.5 }}
              display="flex"
              justifyContent="center"
              alignItems="center"
              bgcolor={orange[600]}
            >
              <Icon sx={{ color: grey[100] }} children="apartment" />
            </Box>
            <Typography variant="body2">{company?.company_name}</Typography>
          </MenuItem>
        ))}
        <MenuItem sx={{ px: 2, py: 1 }}>
          <Box
            sx={{ mr: 1, borderRadius: 50, p: 0.5 }}
            display="flex"
            justifyContent="center"
            alignItems="center"
            bgcolor={orange[600]}
          >
            <Icon sx={{ color: blue[100] }} children="add" />
          </Box>
          <Typography variant="body2">Add Company</Typography>
        </MenuItem>
      </Menu>
    </>
  );
};

const UserMenu = () => {
  const navigate = useNavigate();
  const user = useLoaderData();
  const [logout, { data, isLoading, isSuccess }] = useLogoutMutation();
  //   const { logout } = useContext(AuthContext);
  const [open, setOpen] = useState(null);

  useEffect(() => {
    if (isSuccess) {
      navigate("/login");
    }
  }, [isSuccess]);
  return (
    <>
      <IconButton
        onClick={(e) => setOpen(e.currentTarget)}
        sx={{ border: 1, borderColor: grey[100] }}
        children={<Icon>person</Icon>}
      />
      <Menu open={Boolean(open)} onClose={() => setOpen(null)} anchorEl={open}>
        <MenuItem sx={{ px: 2, py: 1 }}>
          <Typography variant="body2">{user?.user || user?.email}</Typography>
        </MenuItem>
        <MenuItem sx={{ px: 2, py: 1 }} onClick={() => navigate("/profile")}>
          <Box
            sx={{ mr: 1, borderRadius: 50, p: 0.5 }}
            display="flex"
            justifyContent="center"
            alignItems="center"
            bgcolor={orange[600]}
          >
            <Icon sx={{ color: grey[50] }} children="account_circle" />
          </Box>
          <Typography variant="body2">Profile</Typography>
        </MenuItem>
        <MenuItem sx={{ px: 2, py: 1 }}>
          <Box
            sx={{ mr: 1, borderRadius: 50, p: 0.5 }}
            display="flex"
            justifyContent="center"
            alignItems="center"
            bgcolor={orange[600]}
          >
            <Icon sx={{ color: grey[50] }} children="account_circle" />
          </Box>
          <Typography variant="body2">Change Password</Typography>
        </MenuItem>
        <MenuItem sx={{ px: 2, py: 1 }} onClick={logout}>
          <Box
            sx={{ mr: 1, borderRadius: 50, p: 0.5 }}
            display="flex"
            justifyContent="center"
            alignItems="center"
            bgcolor={orange[600]}
          >
            <Icon sx={{ color: grey[50] }} children="logout" />
          </Box>
          <Typography variant="body2">Logout</Typography>
        </MenuItem>
      </Menu>
    </>
  );
};
