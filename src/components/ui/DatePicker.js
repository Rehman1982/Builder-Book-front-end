import React, {
    useState,
    useEffect,
    forwardRef,
    useImperativeHandle,
} from "react";
import {
    Paper,
    Grid,
    MenuItem,
    Select,
    Typography,
    Box,
    TextField,
    Avatar,
} from "@mui/material";
import dayjs from "dayjs";
import ClearIcon from "@mui/icons-material/Clear";

const DatePicker = forwardRef(({ date, setDate, label }, ref) => {
    useImperativeHandle(ref, () => ({
        selectedDate: () => {
            return selectedDate.format("YYYY-MM-DD");
        },
    }));
    const [selectedDate, setSelectedDate] = useState(dayjs());

    const [calendarDays, setCalendarDays] = useState([]);

    const years = Array.from({ length: 30 }, (_, i) => 2000 + i);
    const months = Array.from({ length: 12 }, (_, i) => i);

    const weekdays = ["S", "M", "T", "W", "T", "F", "S"];

    useEffect(() => {
        console.log("date picker rendeered");
        const startOfMonth = selectedDate.startOf("month");
        const endOfMonth = selectedDate.endOf("month");

        const startDay = startOfMonth.day(); // 0 (Sunday) to 6 (Saturday)
        const daysInMonth = selectedDate.daysInMonth();

        // Create empty placeholders for days before the 1st of the month
        const blankDays = Array.from({ length: startDay }, () => null);

        // Create actual day numbers
        const actualDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

        // Combine both
        setCalendarDays([...blankDays, ...actualDays]);
    }, [selectedDate]);
    useEffect(() => {
        if (date) {
            setSelectedDate(dayjs(date));
        }
    }, [date]);

    const handleYearChange = (e) => {
        setSelectedDate(selectedDate.year(e.target.value));
    };

    const handleMonthChange = (e) => {
        setSelectedDate(selectedDate.month(e.target.value));
    };

    const handleDaySelect = (day) => {
        if (day) {
            setSelectedDate(selectedDate.date(day));
            setDate(selectedDate.date(day).format("YYYY-MM-DD"));
        }
    };

    return (
        // <Box>
        <Box sx={{ p: 2 }} elevation={3}>
            <Typography variant="body1" gutterBottom>
                {label} {""} {dayjs(selectedDate).format("DD MMMM YYYY")}
            </Typography>

            {/* Month & Year Selectors */}
            <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={6}>
                    <Select
                        size="small"
                        variant="outlined"
                        fullWidth
                        value={selectedDate.month()}
                        onChange={handleMonthChange}
                    >
                        {months.map((month) => (
                            <MenuItem key={month} value={month}>
                                {dayjs().month(month).format("MMMM")}
                            </MenuItem>
                        ))}
                    </Select>
                </Grid>
                <Grid item xs={6}>
                    <Select
                        size="small"
                        variant="outlined"
                        fullWidth
                        value={selectedDate.year()}
                        onChange={handleYearChange}
                    >
                        {years.map((year) => (
                            <MenuItem key={year} value={year}>
                                {year}
                            </MenuItem>
                        ))}
                    </Select>
                </Grid>
            </Grid>

            {/* Weekday Headers */}
            <Grid container spacing={1} mb={2} columns={7}>
                {weekdays.map((day, i) => (
                    <Grid item xs={1} key={i} textAlign={"center"}>
                        <Typography
                            variant="subtitle2"
                            align="center"
                            fontWeight="bold"
                        >
                            {day}
                        </Typography>
                    </Grid>
                ))}
            </Grid>

            {/* Days Grid */}
            <Grid container spacing={1} columns={7}>
                {calendarDays.map((day, idx) => (
                    <Grid
                        item
                        xs={1}
                        key={idx}
                        sx={{
                            padding: 1,
                            alignItems: "center",
                            textAlign: "center",
                            borderRadius: "10%",
                            border: 1,
                            borderColor: "divider",
                            bgcolor:
                                day === selectedDate.date()
                                    ? "primary.main"
                                    : "grey.100",
                            color:
                                day === selectedDate.date()
                                    ? "white"
                                    : "text.primary",
                            cursor: day ? "pointer" : "default",
                            "&:hover": {
                                bgcolor: day ? "primary.light" : "grey.100",
                                color: day ? "white" : "text.disabled",
                            },
                        }}
                        onClick={() => handleDaySelect(day)}
                    >
                        {day || <ClearIcon fontSize="small" />}
                    </Grid>
                ))}
            </Grid>
            {/* 
            <Typography variant="body1" sx={{ mt: 2 }}>
                Selected: {selectedDate.format("YYYY-MM-DD")}
            </Typography> */}
        </Box>
        // </Box>
    );
});

export default DatePicker;
