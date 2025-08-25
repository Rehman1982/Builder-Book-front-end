import { TextField, Box, Avatar } from "@mui/material";
import MyTextField from "./MyTextField";

const Meta = ({ variant, data, errors, handleChange }) => (
    <Box sx={{ p: 2 }}>
        <MyTextField
            variant={variant}
            label="Facebook Page"
            value={data?.social_links || ""}
            onChange={handleChange}
            name="social_links"
            errors={errors}
        />
        <MyTextField
            variant={variant}
            label="Twitter"
            value={data?.social_links || ""}
            onChange={handleChange}
            name="social_links"
            errors={errors}
        />
        <MyTextField
            variant={variant}
            label="Instagram"
            value={data?.social_links || ""}
            onChange={handleChange}
            name="social_links"
            errors={errors}
        />
    </Box>
);

export default Meta;
