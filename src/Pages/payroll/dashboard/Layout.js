import * as React from "react";
import {
    Box,
    Toolbar,
    List,
    Typography,
    Divider,
    IconButton,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Avatar,
    ListItemAvatar,
    Stack,
    Tooltip,
    Button,
    Container,
    Paper,
    Drawer,
    useMediaQuery,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import CssBaseline from "@mui/material/CssBaseline";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import PersonIcon from "@mui/icons-material/Person";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import HistoryToggleOffIcon from "@mui/icons-material/HistoryToggleOff";
import DashboardIcon from "@mui/icons-material/Dashboard";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import { blue, deepOrange, lightGreen, red } from "@mui/material/colors";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { Home } from "@mui/icons-material";

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
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));
const items = [
    { route: "dashboard", text: "Dashboard", icon: <DashboardIcon /> },
    { route: "employee", text: "Employee", icon: <PersonIcon /> },
    { route: "allowance", text: "Allowances", icon: <AttachMoneyIcon /> },
    { route: "positions", text: "Positions", icon: <PersonIcon /> },
    { route: "schedules", text: "Schedules", icon: <HistoryToggleOffIcon /> },
    { route: "attendance", text: "Attendance", icon: <HourglassBottomIcon /> },
    { route: "payroll", text: "Payrolls", icon: <HourglassBottomIcon /> },
    { route: "office", text: "Offices", icon: <HourglassBottomIcon /> },
    { route: "leaves", text: "Leaves", icon: <HourglassBottomIcon /> },
    {
        route: "resetlogin",
        text: "Login Reset",
        icon: <HourglassBottomIcon />,
    },
];
export default function Layout(props) {
    const Navigate = useNavigate();
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    };
    const handleDrawerClose = () => {
        setOpen(false);
    };
    return (
        <Box>
            {/* <CssBaseline /> */}
            <AppBar position="fixed" open={open}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={() => setOpen(true)}
                        edge="start"
                        sx={{
                            marginRight: 5,
                            ...(open && { display: "none" }),
                        }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Box
                        display="flex"
                        spacing={0}
                        justifyContent="space-between"
                        alignItems="center"
                        sx={{ width: "100%" }}
                    >
                        <Avatar
                            component={Link}
                            to="public/payroll"
                            src={`/public/images/payrolllogo.png`}
                            sx={{
                                width: 48,
                                height: 48,
                                border: 2,
                                borderColor: blue[100],
                            }}
                        />
                        <Box display={{ xs: "none", md: "block" }}>
                            {items.map((v) => (
                                <RightItem
                                    key={v.route}
                                    route={v.route}
                                    icon={v.icon}
                                />
                            ))}
                        </Box>
                    </Box>
                </Toolbar>
            </AppBar>
            <SmallDrawar open={open} setOpen={setOpen} />
            <Container component="main" sx={{ flexGrow: 1, pt: 4, pb: 10 }}>
                <DrawerHeader />
                <Button variant="outlined" onClick={() => Navigate(-1)}>
                    Back
                </Button>
                {/* {props.children} */}
                <Outlet />
            </Container>
        </Box>
    );
}

const DrawerContents = ({ open, setOpen }) => {
    return (
        <Box sx={{ width: open ? 240 : 80 }}>
            <DrawerHeader>
                <IconButton onClick={() => setOpen(false)}>
                    {!open ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                </IconButton>
            </DrawerHeader>
            <List>
                <ListItem
                    divider
                    key={9}
                    disablePadding
                    sx={{ display: "block" }}
                >
                    <ListItemButton
                        onClick={() =>
                            (window.location.href = route("main_page"))
                        }
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
                            <Avatar sx={{ backgroundColor: deepOrange[800] }}>
                                <Home />
                            </Avatar>
                        </ListItemIcon>
                        <ListItemText
                            primary="Home"
                            sx={{ opacity: open ? 1 : 0 }}
                        />
                    </ListItemButton>
                </ListItem>
                {items.map((v) => (
                    <Item
                        key={v.route}
                        open={open}
                        route={v.route}
                        text={v.text}
                        icon={v.icon}
                    />
                ))}
            </List>
        </Box>
    );
};
const SmallDrawar = ({ open, setOpen }) => {
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
        >
            <CssBaseline />
            <DrawerContents open={open} setOpen={setOpen} />
        </Drawer>
    );
};
const Item = ({ open, route, text, icon }) => (
    <ListItem divider key={1} disablePadding sx={{ display: "block" }}>
        <ListItemButton
            component={Link}
            to={route}
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
                    sx={{ backgroundColor: deepOrange[800] }}
                    children={icon}
                ></Avatar>
            </ListItemIcon>
            <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
        </ListItemButton>
    </ListItem>
);
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
