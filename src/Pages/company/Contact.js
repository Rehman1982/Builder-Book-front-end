import { TextField, Box } from "@mui/material";
import MyTextField from "./MyTextField";

const Contact = ({ variant, data, errors, handleChange }) => (
    <Box sx={{ p: 2 }}>
        <MyTextField
            variant={variant}
            label="name"
            value={data?.contact_person_name || ""}
            onChange={handleChange}
            name="contact_person_name"
            errors={errors}
        />
        <MyTextField
            label="Email"
            value={data?.contact_person_email || ""}
            variant={variant}
            onChange={handleChange}
            name="contact_person_email"
            errors={errors}
        />
        <MyTextField
            variant={variant}
            label="Phone"
            value={data?.contact_person_phone || ""}
            onChange={handleChange}
            name="contact_person_phone"
            errors={errors}
        />
        <MyTextField variant={variant} label="City" value={data?.city || ""} />
        <MyTextField
            variant={variant}
            label="Designation"
            value={data?.designation || ""}
            onChange={handleChange}
            name="designation"
            errors={errors}
        />
    </Box>
);

export default Contact;
