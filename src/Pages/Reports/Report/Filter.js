import { Paper, TextField } from "@mui/material";
import React, { useEffect } from "react";

const Filter = ({ state, setState }) => {
    const [string, setString] = React.useState(null);
    const FilterToggler = () => {
        const filteredData = state?.filter((item) => {
            if (
                item.display_name !== null &&
                item.display_name.toLowerCase().includes(string.toLowerCase())
            ) {
                item["hide"] = false;
            } else if (item.display_name == null) {
                item["hide"] = false;
            } else {
                item["hide"] = true;
            }
            return item;
        });
        return filteredData;
    };
    useEffect(() => {
        if (string !== null && state.length > 0) {
            setState(FilterToggler());
        }
    }, [string]);

    return (
        <TextField
            component={Paper}
            name="filter"
            margin="dense"
            size="small"
            value={string || ""}
            variant="outlined"
            fullWidth
            placeholder="Search..."
            onChange={(e) => setString(e.target.value)}
        />
    );
};
export default Filter;
