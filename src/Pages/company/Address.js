import { TextField, Box } from "@mui/material";
import _ from "lodash";
import MyTextField from "./MyTextField";
const Address = ({ variant, data, errors, handleChange }) => (
    <Box sx={{ p: 2 }}>
        <MyTextField
            variant={variant}
            label="Address"
            value={data?.address_line1 || ""}
            name="address_line1"
            onChange={handleChange}
            errors={errors}
        />
        <MyTextField
            label="Email"
            value={data?.email || ""}
            variant={variant}
            name="email"
            onChange={handleChange}
            errors={errors}
        />
        <MyTextField
            variant={variant}
            label="Address 2"
            value={data?.address_line2 || ""}
            name="address_line2"
            onChange={handleChange}
            errors={errors}
        />
        <MyTextField
            variant={variant}
            label="City"
            value={data?.city || ""}
            name="city"
            onChange={handleChange}
            errors={errors}
        />
        <MyTextField
            variant={variant}
            label="State or Province"
            value={data?.state_or_province || ""}
            name="state_or_province"
            onChange={handleChange}
            errors={errors}
        />
        <MyTextField
            variant={variant}
            label="Postal Code"
            value={data?.postal_code || ""}
            name="postal_code"
            onChange={handleChange}
            errors={errors}
        />
        <MyTextField
            variant={variant}
            label="Country"
            value={data?.country || ""}
            name="country"
            onChange={handleChange}
            errors={errors}
        />
    </Box>
);

export default Address;
