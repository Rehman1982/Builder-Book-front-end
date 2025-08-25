// AIzaSyDKEixTzhoOetXtJkJ-QvMClNVHXEE6JSE
import React, { useState, useCallback, useEffect } from "react";
import {
    GoogleMap,
    useLoadScript,
    Circle,
    Marker,
    Autocomplete,
} from "@react-google-maps/api";
import {
    Box,
    TextField,
    Container,
    Grid,
    Typography,
    List,
    ListItem,
    ListItemText,
    Dialog,
    Button,
    Avatar,
    Divider,
    ButtonGroup,
    IconButton,
    Stack,
    Grow,
    Fade,
    Switch,
    FormLabel,
    FormControl,
    ListItemAvatar,
    AvatarGroup,
    ButtonBase,
} from "@mui/material";
import axios from "axios";
import { useRef } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useContext } from "react";
import { Alert } from "../../../context/AlertBar/AlertBar";
import ApprovalStages from "./ApprovalStages";
import { Approval } from "@mui/icons-material";
import { blue } from "@mui/material/colors";

const libraries = ["places"];
const mapContainerStyle = {
    width: "100%",
    height: "400px",
};
const center = {
    lat: 34.000018,
    lng: 71.00065,
};

const Offices = () => {
    const [locations, setLocations] = useState([]);
    const [edit, setEdit] = useState(null);
    const [destroyId, setDestroyId] = useState(null);
    const { setMessage, showAlert, setSeverity } = useContext(Alert);
    const [currentOffice, setCurrentOffice] = useState(null);
    const getData = async () => {
        try {
            const response = await axios.get(
                route("payroll.office.index", { type: "data" })
            );
            if (response.status == 200) {
                setLocations(response.data);
                return true;
            } else {
                console.log("some errors");
                return false;
            }
        } catch (error) {
            const {
                status,
                data: { message },
            } = error.response;
            if (status == 403) {
                setMessage(message);
            } else {
                setMessage("Something went wrong");
            }
            setSeverity("error");
            showAlert(true);
            return false;
        }
    };
    useEffect(() => {
        getData();
    }, []);
    return (
        <Container>
            <ApprovalStages
                officeId={currentOffice}
                setOfficeId={setCurrentOffice}
            />
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
            >
                <Typography variant="h6">Offices Locations</Typography>
                <AddLocation refresh={getData} edit={edit} />
                <Destroy
                    destroyId={destroyId}
                    setDestroyId={setDestroyId}
                    getData={getData}
                />
            </Stack>
            <Box sx={{ mt: 1 }}>
                {locations.map((v, i) => {
                    return (
                        <List key={i} disablePadding>
                            <ListItem divider>
                                <ListItemAvatar>
                                    <Avatar>{i + 1}</Avatar>
                                </ListItemAvatar>
                                <ListItemText primary={v.name} />
                                <AvatarGroup spacing={1}>
                                    <Avatar
                                        component={ButtonBase}
                                        onClick={() => setCurrentOffice(v)}
                                    >
                                        <Approval color="warning" />
                                    </Avatar>
                                    <Avatar
                                        component={ButtonBase}
                                        onClick={() => setEdit(v)}
                                    >
                                        <EditIcon color="warning" />
                                    </Avatar>
                                    <Avatar
                                        component={ButtonBase}
                                        onClick={() => setDestroyId(v.id)}
                                    >
                                        <DeleteIcon color="error" />
                                    </Avatar>
                                </AvatarGroup>
                            </ListItem>
                        </List>
                    );
                })}
            </Box>
        </Container>
    );
};

export default Offices;
// the below form will be used for create and update
const AddLocation = ({ refresh, edit }) => {
    const [mapCenter, setMapCenter] = useState({
        lat: 30.3753,
        lng: 69.3451,
    });
    const [formType, setFormType] = useState("create");
    const [showMap, setShowMap] = useState(false);
    const [open, setOpen] = useState(false);
    const [state, setState] = useState({
        id: "",
        name: "",
        lon: 0,
        lat: 0,
        radius: 100,
    });
    const [errors, setErrors] = useState({});
    const { setMessage, showAlert, setSeverity } = useContext(Alert);
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: "AIzaSyDKEixTzhoOetXtJkJ-QvMClNVHXEE6JSE", // Replace with your Google Maps API key
        libraries,
    });
    const handleCloseForm = () => {
        setState({ id: "", name: "", lon: 0, lat: 0, radius: 100 });
        setMapCenter({ lat: 30.3753, lng: 69.3451 });
        setOpen(false);
        refresh();
    };
    const handleCreate = async () => {
        try {
            const response = await axios.post(
                route("payroll.office.store"),
                state
            );
            if (response.status == 200) {
                console.log(response.data.data);
                handleCloseForm();
            } else if (response.status == 203) {
                setErrors(response.data.errors);
            }
        } catch (error) {
            const {
                status,
                data: { message },
            } = error.response;
            if (status == 403) {
                setMessage(message);
            } else {
                setMessage("Something went wrong");
            }
            setSeverity("error");
            showAlert(true);
            return false;
        }
    };
    const handleUpdate = () => {
        alert("call create Api");
    };
    const autocompleteRef = useRef(null);
    const [newlocation, setNewLocation] = useState(null);
    const [rad, setRad] = useState(300);
    useEffect(() => {
        console.log("child rendered");
        if (state.lon !== 0 && state.lat !== 0) {
            // alert("Change map center");
            setMapCenter({ lat: state.lat, lng: state.lon });
        }
    }, [state]);
    useEffect(() => {
        console.log(edit);
        if (edit) {
            setFormType("update");
            setShowMap(true);
            setState({
                id: edit.id,
                name: edit.name,
                lon: Number(edit.longitude),
                lat: Number(edit.latitude),
                radius: Number(edit.radius),
            });
            setOpen(true);
        }
    }, [edit]);
    const handleMapClick = useCallback((event) => {
        const latitude = event.latLng.lat();
        const longitude = event.latLng.lng();
        // setNewLocation({ latitude, longitude });
        setState({ ...state, lat: latitude, lon: longitude });
    }, []);
    const handlePlaceSelect = () => {
        const place = autocompleteRef.current.getPlace();
        if (place.geometry) {
            const location = place.geometry.location;
            const newCenter = {
                lat: location.lat(),
                lng: location.lng(),
            };

            setMapCenter(newCenter);
            setCircleLocation(newCenter);
        }
    };
    if (loadError) return <div>Error loading maps</div>;
    if (!isLoaded) return <div>Loading Maps...</div>;

    return (
        <>
            <Button onClick={() => setOpen(true)}>
                <Avatar>+</Avatar>
            </Button>
            <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
                <Box sx={{ padding: 3 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={12} md={6}>
                            <FormControl>
                                <FormLabel>Toggle Map</FormLabel>
                                <Switch
                                    checked={showMap}
                                    onChange={(e) =>
                                        setShowMap(e.target.checked)
                                    }
                                    inputProps={{ "aria-label": "Google Map" }}
                                />
                            </FormControl>
                            <TextField
                                required
                                name="name"
                                label="Name of Office"
                                value={state.name}
                                fullWidth
                                onChange={(e) =>
                                    setState({ ...state, name: e.target.value })
                                }
                                margin="dense"
                                error={"name" in errors}
                                helperText={
                                    "name" in errors &&
                                    errors.name.length > 0 &&
                                    errors.name.map((v) => v)
                                }
                            />
                            <TextField
                                required
                                name="long"
                                label="Logitude"
                                value={state.lon}
                                type="number"
                                inputProps={{ step: "any" }}
                                fullWidth
                                onChange={(e) =>
                                    setState({
                                        ...state,
                                        lon: parseFloat(e.target.value),
                                    })
                                }
                                margin="dense"
                                error={"lon" in errors}
                                helperText={
                                    "lon" in errors &&
                                    errors.lon.length > 0 &&
                                    errors.lon.map((v) => v)
                                }
                            />
                            <TextField
                                required
                                name="lat"
                                label="Latitude"
                                value={state.lat}
                                type="number"
                                inputProps={{ step: "any" }}
                                fullWidth
                                onChange={(e) =>
                                    setState({
                                        ...state,
                                        lat: parseFloat(e.target.value),
                                    })
                                }
                                margin="dense"
                                error={"lat" in errors}
                                helperText={
                                    "lat" in errors &&
                                    errors.lat.length > 0 &&
                                    errors.lat.map((v) => v)
                                }
                            />
                            <TextField
                                required
                                name="radius"
                                label="Radius"
                                value={state.radius}
                                fullWidth
                                onChange={(e) =>
                                    setState({
                                        ...state,
                                        radius: Number(e.target.value),
                                    })
                                }
                                margin="dense"
                                error={"radius" in errors}
                                helperText={
                                    "radius" in errors &&
                                    errors.radius.length > 0 &&
                                    errors.radius.map((v) => v)
                                }
                            />
                            {formType == "create" ? (
                                <Button
                                    variant="contained"
                                    onClick={handleCreate}
                                >
                                    Create
                                </Button>
                            ) : (
                                <Button
                                    variant="contained"
                                    onClick={handleCreate}
                                >
                                    Update
                                </Button>
                            )}
                        </Grid>
                        <Grid item xs={12} sm={12} md={6}>
                            <Fade in={showMap}>
                                <Box>
                                    <GoogleMap
                                        mapContainerStyle={mapContainerStyle}
                                        zoom={15}
                                        center={mapCenter}
                                        onClick={handleMapClick}
                                    >
                                        {state.lon !== "" &&
                                            state.lat !== "" && (
                                                <>
                                                    <Circle
                                                        center={{
                                                            lat: state.lat,
                                                            lng: state.lon,
                                                        }}
                                                        radius={state.radius} // 2 km radius
                                                        options={{
                                                            fillColor:
                                                                "#FF0000",
                                                            fillOpacity: 0.2,
                                                            strokeColor:
                                                                "#FF0000",
                                                            strokeOpacity: 0.7,
                                                            strokeWeight: 1,
                                                        }}
                                                    />
                                                    <Marker
                                                        position={{
                                                            lat: state.lat,
                                                            lng: state.lon,
                                                        }}
                                                    />
                                                </>
                                            )}
                                        <Autocomplete
                                            onLoad={(autocomplete) => {
                                                autocompleteRef.current =
                                                    autocomplete;
                                            }}
                                            onPlaceChanged={handlePlaceSelect}
                                        >
                                            <input
                                                type="text"
                                                placeholder="Search for a place"
                                                style={{
                                                    boxSizing: "border-box",
                                                    border: "1px solid transparent",
                                                    width: "240px",
                                                    height: "32px",
                                                    marginTop: "10px",
                                                    padding: "0 12px",
                                                    borderRadius: "3px",
                                                    boxShadow:
                                                        "0 2px 6px rgba(0, 0, 0, 0.3)",
                                                    fontSize: "14px",
                                                    outline: "none",
                                                    textOverflow: "ellipses",
                                                    position: "absolute",
                                                    left: "50%",
                                                    marginLeft: "-120px",
                                                }}
                                            />
                                        </Autocomplete>
                                    </GoogleMap>
                                </Box>
                            </Fade>
                        </Grid>
                    </Grid>
                </Box>
            </Dialog>
        </>
    );
};
// below form will be used for delete
const Destroy = ({ destroyId, setDestroyId, getData }) => {
    const [open, setOpen] = useState(false);
    const [id, setId] = useState(null);
    const [code, setCode] = useState(null);
    const [confirm, setConfirm] = useState(false);
    const [errors, setErrors] = useState({});
    const handleCloseForm = () => {
        setId(null);
        setCode(null);
        setErrors({});
        setDestroyId(null);
        setOpen(false);
    };
    const handleDestroy = async () => {
        const params = { code: code, id: id };
        const response = await axios.delete(
            route("payroll.office.destroy", { office: 1 }),
            { params }
        );
        if (response.status == 200) {
            console.log(response.data.data);
            getData();
            handleCloseForm();
        } else if (response.status == 203) {
            console.log(response.data.errors);
            setErrors(response.data.errors);
        }
    };
    useEffect(() => {
        if (destroyId) {
            setId(destroyId);
            setOpen(true);
            setCode(null);
        }
    }, [destroyId]);
    return (
        <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
            <Box sx={{ padding: 3 }}>
                <Typography variant="h6">
                    Are you sure to proceed further?
                </Typography>
                <Divider />
                <TextField
                    fullWidth
                    required
                    name="code"
                    label="Signatory Code"
                    value={code ?? ""}
                    onChange={(e) => setCode(e.target.value)}
                    error={"code" in errors}
                    helperText={
                        "code" in errors &&
                        errors.code.length > 0 &&
                        errors.code.map((v) => v)
                    }
                    margin="dense"
                />
                {code && (
                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleDestroy}
                    >
                        Delete
                    </Button>
                )}
            </Box>
        </Dialog>
    );
};
