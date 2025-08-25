import { TextField, Box } from "@mui/material";
import _ from "lodash";
import { Error } from "../helpers/helpers";

const MyTextField = (props) => {
    const { variant, errors, ...textFieldProps } = props;
    return (
        <TextField
            fullWidth
            margin="dense"
            disabled={variant && variant == "view" ? true : false}
            {...textFieldProps}
            error={_.has(errors, textFieldProps.name)}
            helperText={<Error name={textFieldProps.name} errors={errors} />}
        />
    );
};
export default MyTextField;
