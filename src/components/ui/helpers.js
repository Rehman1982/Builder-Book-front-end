import { Typography } from "@mui/material";
import { red } from "@mui/material/colors";
import { round } from "lodash";
import { useState } from "react";
import { useEffect } from "react";

function getFullName(firstName, middleName, lastName) {
    // Helper function to capitalize the first letter of a string
    const capitalize = (name) =>
        name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

    // Initialize an array with the names
    const names = [firstName, middleName, lastName];

    // Filter out null or undefined values and capitalize each part
    const fullName = names
        .filter(
            (name) => name != null && name !== undefined && name.trim() !== ""
        )
        .map(capitalize)
        .join(" ");

    return fullName;
}
function getYears(noOfYears, lastOrComming) {
    const currentYear = new Date().getFullYear();
    if (lastOrComming == "last") {
        return Array.from({ length: noOfYears }, (v, i) => currentYear - i);
    }
    if (lastOrComming == "comming") {
        return Array.from({ length: noOfYears }, (v, i) => currentYear + i);
    }
}
const getMonths = (past = null) => {
    const currentMonth = new Date().getMonth() + 1; // getMonth() returns 0-indexed month, so add 1
    const monthsOfYear = [
        { id: 1, name: "January" },
        { id: 2, name: "February" },
        { id: 3, name: "March" },
        { id: 4, name: "April" },
        { id: 5, name: "May" },
        { id: 6, name: "June" },
        { id: 7, name: "July" },
        { id: 8, name: "August" },
        { id: 9, name: "September" },
        { id: 10, name: "October" },
        { id: 11, name: "November" },
        { id: 12, name: "December" },
    ];
    if (past === "past") {
        return monthsOfYear.filter((month) => month.id <= currentMonth);
    } else {
        return monthsOfYear;
    }
};
const Error = ({ name, errors }) => {
    const [errortext, setErrorText] = useState(null);
    useEffect(() => {
        if (errors && name in errors && errors[name].length > 0) {
            setErrorText(errors[name]);
        } else {
            setErrorText(null);
        }
    }, [errors]);
    if (errortext !== null) {
        return errortext.map((v, i) => (
            <Typography key={i} variant="caption" sx={{ color: red[800] }}>
                {v}
            </Typography>
        ));
    }
    return;
};
const TwoDeci = (string) => {
    return string.toFixed(2);
};
const ROUND = (string) => {
    return round(string);
};
export { getFullName, getYears, getMonths, Error, TwoDeci, ROUND };
