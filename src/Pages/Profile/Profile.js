import React, { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    Avatar,
    Typography,
    Grid,
    Box,
    Divider,
} from "@mui/material";
import API from "../../api/axiosApi";
import dayjs from "dayjs";
import { set } from "lodash";
import PrivilegesViewer from "./PrivilegesViewer";

const Profile = () => {
    const [user, setUser] = useState({});
    const [permission, setPermission] = useState([]);
    const getData = async () => {
        try {
            const result = await API.get(route("management.userProfile.index"));
            console.log(result);
            if (result.status == 200) {
                setUser(result?.data?.personal);
                setPermission(result?.data?.permissions);
            }
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        getData();
    }, []);
    return (
        <Card sx={{ mx: "auto", mt: 4, p: 2, boxShadow: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Avatar
                    alt={user.user}
                    src={user.avatar}
                    sx={{ width: 80, height: 80, mr: 2 }}
                />
                <Box>
                    <Typography variant="h5">{user.user}</Typography>
                    <Typography variant="body2" color="text.secondary">
                        {user.email || "Employee"}
                    </Typography>
                </Box>
            </Box>

            <CardContent>
                <Typography variant="h5" gutterBottom>
                    Personal Info
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                            Name
                        </Typography>
                        <Typography variant="body1">{user.user}</Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                            Mobile Number
                        </Typography>
                        <Typography variant="body1">{user.mbn}</Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                            CNIC
                        </Typography>
                        <Typography variant="body1">{user.cnic}</Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                            Signatory Code
                        </Typography>
                        <Typography variant="body1">{user.code}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                            Status
                        </Typography>
                        <Typography variant="body1">
                            {user?.status == 1 ? "Active" : "Non-Active"}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                            Joined On
                        </Typography>
                        <Typography variant="body1">
                            {dayjs(user.created_at).format(
                                "DD-MMM-YYYY hh:mm a"
                            )}
                        </Typography>
                    </Grid>
                </Grid>
            </CardContent>
            <Divider />
            <CardContent>
                <Typography variant="h5" gutterBottom>
                    Roles & Permissions
                </Typography>
                {permission.map((prv, indx) => (
                    <PrivilegesViewer key={indx} data={prv} />
                ))}
            </CardContent>
            <CardContent>
                <Typography variant="h5">Companies</Typography>
            </CardContent>
        </Card>
    );
};

export default Profile;
