import { IconButton, TableCell, TableRow, Tooltip, Typography, Button } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import { amber, blueGrey, green, grey, lightGreen, red } from '@mui/material/colors';
import React, { useEffect, useState, memo, useContext } from 'react';
import { BOQContext } from './BOQContext';
import Create1 from './Create1';
import CreateBoq from './CreateBoq';
const Row = memo(({ data, mrgn }) => {
    const { toggles, setToggles } = useContext(BOQContext);
    const [create, setCreate] = useState({ parent_id: "", show: false });
    const [refresh, setRefresh] = useState(false);
    const [selectItem, setSelectItem] = useState({});
    useEffect(() => {
        console.log("row called")
    }, [])
    return (
        <>
            {/* <Create1 create={create} setCreate={setCreate} /> */}
            <CreateBoq
                data={{ selectItem: selectItem, setRefresh: setRefresh }}
            />
            {data.map((v, i) => {
                console.log("mapCalled");
                return (
                    <React.Fragment key={v.id}>
                        <TableRow
                            className={v.parent_id !== null ? "collapse" : ""}
                            id={"id" + v.parent_id}
                            sx={{
                                backgroundColor: v.parent_id == null ?
                                    lightGreen[300] :
                                    v.childs.length > 0 ? red[200] : blueGrey[100]
                            }}
                        >
                            <TableCell sx={{ border: 1, borderColor: grey[500], padding: "0px" }}>
                                {v.childs.length > 0 &&
                                    <Tooltip title="Click to Expand">
                                        <IconButton sx={{ marginLeft: mrgn }} size='small' data-toggle="collapse" data-target={"#id" + v.id}>
                                            <NavigateNextIcon color='primary' />
                                        </IconButton>
                                    </Tooltip>
                                }
                            </TableCell>
                            <TableCell sx={{ border: 1, borderColor: grey[500] }}>
                                <Typography variant='subtitle2'>{v.sno}</Typography>
                            </TableCell>
                            <TableCell sx={{ border: 1, borderColor: grey[500] }}>
                                <Typography variant='subtitle2'>
                                    {(v.analysis.length > 0) ? <CheckIcon fontSize='large' color='success' /> : <ClearIcon fontSize='large' color='error' />}
                                </Typography>
                            </TableCell>
                            <TableCell sx={{ border: 1, borderColor: grey[500] }}>
                                <Typography variant='subtitle2'>{v.desp} </Typography>
                            </TableCell>
                            <TableCell sx={{ border: 1, borderColor: grey[500] }}>
                                <Typography variant='subtitle2'>{v.item_code}</Typography>
                            </TableCell>
                            <TableCell sx={{ border: 1, borderColor: grey[500] }}>
                                <Typography variant='subtitle2'>{v.quoted_rate}/{v.unit}</Typography>
                            </TableCell>
                            <TableCell sx={{ border: 1, borderColor: grey[500] }}>
                                <Typography variant='subtitle2'>{v.qty}</Typography>
                            </TableCell>
                            <TableCell sx={{ border: 1, borderColor: grey[500] }}>
                                <Typography variant='subtitle2'>{v.revision}</Typography>
                            </TableCell>
                            <TableCell sx={{ border: 1, borderColor: grey[500] }}>
                                <Typography variant='subtitle2'>{v.total}</Typography>
                            </TableCell>
                            <TableCell sx={{ border: 1, borderColor: grey[500] }}>
                                <Typography variant='subtitle2'>{v.amount}</Typography>
                            </TableCell>
                            <TableCell align="center" sx={{ border: 1, borderColor: grey[500], padding: "0px" }}>
                                {/* <Stack
                                direction="row"
                                divider={<Divider orientation="vertical" flexItem />}
                            >
                                <Tooltip
                                    title="Add Child to this Item"
                                    TransitionComponent={Zoom}
                                    TransitionProps={{ timeout: 500 }}
                                    children={
                                        <IconButton
                                            children={<ControlPointIcon color='primary' />}
                                            onClick={() => handleClick("Add", v)}
                                        />
                                    }
                                />
                                <Tooltip
                                    title="Edit current Item"
                                    TransitionComponent={Zoom}
                                    TransitionProps={{ timeout: 500 }}
                                    children={
                                        <IconButton
                                            children={<EditIcon color='warning' />}
                                            onClick={() => handleClick("Edit", v.id)}
                                        />
                                    }
                                />
                                <IconButton
                                    children={<DeleteForeverIcon color='error' />}
                                    onClick={() => handleClick("Delete", v.id)}
                                />
                                {v.Header == 0 &&
                                    <IconButton
                                        children={<SyncIcon color='secondary' />}
                                        onClick={() => handleClick("Revision", v.id)}
                                    />
                                }
                            </Stack> */}
                                <Button
                                    key={v.id}
                                    onClick={() => { setToggles({ ...toggles, createForm: true }); }}
                                    children={"Click"}
                                />
                            </TableCell>
                        </TableRow>
                        {v.childs.length > 0 && <Row create={create} setCreate={setCreate} mrgn={mrgn + 4} data={v.childs} />}
                    </React.Fragment>
                )
            })}
        </>
    )
})

export default Row
