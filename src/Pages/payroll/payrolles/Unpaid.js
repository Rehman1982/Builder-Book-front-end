import React from "react";
import {
    Grid,
    Checkbox,
    Stack,
    Autocomplete,
    TextField,
    Button,
    Avatar,
    ListItemText,
    AvatarGroup,
    Paper,
    Typography,
} from "@mui/material";
import { grey } from "@mui/material/colors";

const Unpaid = ({
    selected,
    uppaid,
    lastFiveYears,
    req,
    setReq,
    errors,
    code,
    setCode,
    handleSubmit,
    getFullName,
}) => {
    return (
        <Paper elevation={3} sx={{ padding: 2 }}>
            <Grid container spacing={2} alignItems="center">
                {/* Header Row */}
                <Grid item xs={12}>
                    <Grid container alignItems="center" spacing={2}>
                        <Grid item>
                            <Checkbox
                                checked={selected.length === uppaid.length}
                                onChange={(e, check) => {
                                    if (check) {
                                        const allIds = uppaid.map((v) => v.id);
                                        setSelected(allIds);
                                    } else {
                                        setSelected([]);
                                    }
                                }}
                            />
                        </Grid>
                        <Grid item xs>
                            {selected.length > 0 && (
                                <Stack
                                    direction="row"
                                    spacing={2}
                                    alignItems="center"
                                >
                                    <Autocomplete
                                        sx={{ width: "40%" }}
                                        options={lastFiveYears}
                                        value={req.year}
                                        onChange={(e, v) =>
                                            setReq({ ...req, year: v })
                                        }
                                        getOptionLabel={(option) => option}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Year"
                                                size="small"
                                                error={"year" in errors}
                                                helperText={
                                                    "year" in errors &&
                                                    errors.year.map((v) => v)
                                                }
                                            />
                                        )}
                                    />
                                    <Autocomplete
                                        sx={{ width: "40%" }}
                                        options={months}
                                        value={req.month}
                                        onChange={(e, v) =>
                                            setReq({ ...req, month: v })
                                        }
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Month"
                                                size="small"
                                                error={"month" in errors}
                                                helperText={
                                                    "month" in errors &&
                                                    errors.month.map((v) => v)
                                                }
                                            />
                                        )}
                                    />
                                    <TextField
                                        size="small"
                                        name="code"
                                        value={code}
                                        onChange={(e) =>
                                            setCode(e.target.value)
                                        }
                                        label="Signatory Code"
                                        error={"year" in errors}
                                        helperText={
                                            <Error
                                                errors={errors}
                                                name="code"
                                            />
                                        }
                                        required
                                    />
                                    <Button
                                        onClick={handleSubmit}
                                        variant="contained"
                                        sx={{ width: "20%" }}
                                    >
                                        Generate
                                    </Button>
                                </Stack>
                            )}
                        </Grid>
                    </Grid>
                </Grid>

                {/* Data Rows */}
                {uppaid.map((v, i) => (
                    <Grid item xs={12} key={v.id}>
                        <Paper elevation={1} sx={{ padding: 2 }}>
                            <Grid container alignItems="center" spacing={2}>
                                <Grid item>
                                    <Checkbox
                                        checked={selected.includes(v.id)}
                                        onChange={(e, check) => {
                                            if (check) {
                                                setSelected([
                                                    ...selected,
                                                    v.id,
                                                ]);
                                            } else {
                                                const unsel = selected.filter(
                                                    (a) => a !== v.id
                                                );
                                                setSelected(unsel);
                                            }
                                        }}
                                    />
                                </Grid>
                                <Grid item>
                                    <Avatar>{i + 1}</Avatar>
                                </Grid>
                                <Grid item xs>
                                    <ListItemText
                                        primary={getFullName(
                                            v.firstName,
                                            v.middleName,
                                            v.LastName
                                        )}
                                        secondary={v.desig}
                                    />
                                </Grid>
                                <Grid item>
                                    <AvatarGroup>
                                        {v.attendance.map((a, i) => (
                                            <Avatar
                                                key={i}
                                                component={Link}
                                                to={`${v.id}/${a.Year}/${a.Month}`}
                                            >
                                                {`${a.Month}`}
                                            </Avatar>
                                        ))}
                                    </AvatarGroup>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </Paper>
    );
};

export default Unpaid;
