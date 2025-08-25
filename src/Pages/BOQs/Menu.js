import * as React from 'react';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import { Paper, Stack } from '@mui/material';

const actions = [
    { icon: <DeleteForeverIcon key={1} color='error' />, name: 'Delete' },
    { icon: <EditIcon key={2} color='warning' />, name: 'Edit' },
    { icon: <ControlPointIcon key={3} color='primary' />, name: 'Add' },
];
const BasicMenu = (props) => {
   const Ref = React.useRef(null);
    const hover = (e) => {
        // setSPDail("auto");
        Ref.current.style.width = "auto";
    }
    const hoverOut = (e) => {
        // setSPDail("0px");
        Ref.current.style.width = "0px";
    }
    React.useEffect(() => {
        // console.log(props);
        console.log(Ref.current.style.width);
    },[props]);
    return (
        <>
            <Stack
                onMouseEnter={hover}
                onMouseLeave={hoverOut}
                direction="row" alignItems="middle" spacing={1}>
                <div style={{ position: "relative"}}>
                    <div ref={Ref} style={{ position: "absolute", right: "0px", height: "auto", alignItems: "center", width:"0px", overflow: "hidden", transition: "all 10s" }}>
                        <Stack  direction="row" spacing={1}>
                            {actions.map((action) => (
                                <Paper key={action.name} elevation={22} variant="elevation" sx={{borderRadius:"50%"}}>
                                    <IconButton
                                        color='primary'
                                        onClick={() => props.data.handleClick(action.name)}
                                    >
                                        <Tooltip
                                            arrow={true}
                                            title={action.name}
                                        >
                                            {action.icon}
                                        </Tooltip>
                                    </IconButton>
                                </Paper>
                            ))}
                        </Stack>
                    </div>
                </div>
                <Paper elevation={22} variant="elevation" sx={{ borderRadius: "50%" }}>
                    <IconButton
                    children={<ControlPointIcon />} />
                </Paper>
            </Stack>
        </>
    );
}

export default React.memo(BasicMenu);

