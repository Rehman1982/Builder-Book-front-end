import {
    Button,
    ButtonGroup,
    Dialog,
    DialogContent,
    TextField,
} from "@mui/material";
import React, {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useState,
} from "react";
import API from "../../api/axiosApi";
import { Error } from "../../components/ui/helpers";
import _ from "lodash";

const Decision = forwardRef(({ id, refresh }, ref) => {
    useImperativeHandle(ref, () => ({
        open: () => setOpen(true),
        close: () => setOpen(false),
    }));
    const [open, setOpen] = useState(false);
    const [state, setState] = useState({ id: "", message: "", code: "" });
    const [errors, setErrors] = useState({});
    const handleApprove = async () => {
        try {
            const result = await API.post(route("signature.approve"), state);
            console.log(result);
            if (result.status === 203) {
                setErrors(result.data);
            }
            if (result.status === 200) {
                setState({ id: "", message: "", code: "" });
                setOpen(false);
                refresh();
            }
        } catch (error) {
            console.log(error);
        } finally {
        }
    };
    const handleReject = async () => {
        try {
            const result = await API.post(route("signature.reject"), state);
            console.log(result);
        } catch (error) {
            console.log(error);
        } finally {
        }
    };
    useEffect(() => {
        setState({ ...state, id: id });
    }, [id]);
    return (
        <Dialog open={open} onClose={() => setOpen(false)}>
            <DialogContent>
                <TextField
                    margin="dense"
                    multiline
                    rows={4}
                    fullWidth
                    label="Message"
                    name="message"
                    value={state.message}
                    onChange={(e) =>
                        setState({ ...state, message: e.target.value })
                    }
                    error={_.has(errors, "message")}
                    helperText={<Error name="message" errors={errors} />}
                />
                <TextField
                    required
                    margin="dense"
                    fullWidth
                    name="code"
                    label="Signatory Code"
                    value={state.code}
                    onChange={(e) =>
                        setState({ ...state, code: e.target.value })
                    }
                    error={_.has(errors, "code")}
                    helperText={<Error name="code" errors={errors} />}
                />
                <ButtonGroup fullWidth sx={{ mt: 2 }}>
                    <Button variant="contained" onClick={handleApprove}>
                        Approve
                    </Button>
                    <Button onClick={handleReject}>Reject</Button>
                </ButtonGroup>
            </DialogContent>
        </Dialog>
    );
});
export default Decision;
