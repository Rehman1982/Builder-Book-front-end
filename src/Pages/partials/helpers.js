import { fontFamily, fontSize, lineHeight } from "@mui/system";

const float = (string) => {
    if (string == NaN || string == undefined || string == null) {
        return 0;
    }
    return parseFloat(string);
};
export { float };
