import { TextField, Box, Avatar } from "@mui/material";
import MyTextField from "./MyTextField";

const BankInfo = ({ variant, data, errors, handleChange }) => (
    <Box sx={{ p: 2 }}>
        <MyTextField
            variant={variant}
            label="Account Number"
            value={data?.bank_account_number || ""}
            onChange={handleChange}
            name="bank_account_number"
            errors={errors}
        />
        <MyTextField
            variant={variant}
            label="Name"
            value={data?.bank_name || ""}
            onChange={handleChange}
            name="bank_name"
            errors={errors}
        />
        <MyTextField
            variant={variant}
            label="IBAN Number"
            value={data?.iban_number || ""}
            onChange={handleChange}
            name="iban_number"
            errors={errors}
        />
        <MyTextField
            variant={variant}
            label="Branch Code"
            value={data?.iban_number || ""}
            onChange={handleChange}
            name="bank_account_number"
            errors={errors}
        />
    </Box>
);

export default BankInfo;
