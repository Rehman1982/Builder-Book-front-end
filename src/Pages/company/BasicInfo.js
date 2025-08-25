import { TextField, Box } from "@mui/material";
import _ from "lodash";
import { useEffect } from "react";
import { Error } from "../helpers/helpers";
import MyTextField from "./MyTextField";
const BasicInfo = ({ variant, data, errors, handleChange }) => {
    return (
        <Box sx={{ p: 2 }}>
            <MyTextField
                variant={variant}
                onChange={handleChange}
                label="Company Name"
                name="company_name"
                value={data?.company_name || ""}
                errors={errors}
            />
            <MyTextField
                name="email"
                label="Email"
                value={data?.email || ""}
                variant={variant}
                onChange={handleChange}
                errors={errors}
            />
            <MyTextField
                variant={variant}
                label="Phone Number"
                name="phone_number"
                onChange={handleChange}
                value={data?.phone_number || ""}
                errors={errors}
            />
            <MyTextField
                variant={variant}
                onChange={handleChange}
                label="Website"
                name="website"
                value={data?.website || ""}
                errors={errors}
            />
            <MyTextField
                variant={variant}
                onChange={handleChange}
                label="Industry Type"
                name="industry_type"
                value={data?.industry_type || ""}
                errors={errors}
            />
            <MyTextField
                variant={variant}
                onChange={handleChange}
                label="Founded Date"
                name="founded_date"
                value={data?.founded_date || ""}
                errors={errors}
            />
            <MyTextField
                variant={variant}
                onChange={handleChange}
                label="No. of Employees"
                name="number_of_employees"
                value={data?.number_of_employees || ""}
                errors={errors}
            />
            <MyTextField
                variant={variant}
                onChange={handleChange}
                label="Description"
                name="description"
                value={data?.description || ""}
                errors={errors}
            />
        </Box>
    );
};

export default BasicInfo;
