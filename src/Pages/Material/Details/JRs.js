import {
    Box,
    Button,
    ButtonGroup,
    Collapse,
    Grid,
    Link,
    Menu,
    MenuItem,
    Paper,
    Stack,
    Tooltip,
    Typography,
} from "@mui/material";
import { blue, green, grey } from "@mui/material/colors";
import axios from "axios";
import React from "react";
import { use } from "react";
import { useState } from "react";
import { useEffect } from "react";
import CreateBoq from "../../BOQs/CreateBoq";
import { useRef } from "react";
import { useCallback } from "react";
import { filter, flatMap, flatten, groupBy, round, sumBy } from "lodash";
import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material";
export const JRs = ({ project_id, item_id, unit, item_name }) => {
    const [data, setData] = useState([]);
    const [grp, setGrp] = useState(null);
    const getData = async () => {
        try {
            const res = await axios.get(route("estimation.material.index"), {
                params: {
                    type: "entrydetails",
                    project_id: project_id,
                    item_id: item_id,
                },
            });
            if (res.status == 200) {
                setData(res.data);
            }
            console.log(res.data);
        } catch (error) {
            console.log(error.response);
        }
    };
    useEffect(() => {
        getData();
    }, []);
    return (
        <Box padding={3}>
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                mb={1}
            >
                <Typography variant="body1">{`${item_name} in ${unit}`}</Typography>
                <Stack
                    direction="row"
                    justifyContent="flex-end"
                    alignItems="center"
                    spacing={1}
                >
                    <Typography variant="body1" mr={2}>
                        Group By:
                    </Typography>
                    <ButtonGroup>
                        <Button
                            onClick={() => setGrp("transactions.users.user")}
                        >
                            User
                        </Button>
                        <Button
                            onClick={() => setGrp("transactions.created_at")}
                        >
                            Date
                        </Button>
                        <Button onClick={() => setGrp("trans_no")}>
                            Trans
                        </Button>
                        <Button onClick={() => setGrp("accounts.acctname")}>
                            A/C
                        </Button>
                        <Button onClick={() => setGrp("desp")}>Desp</Button>
                        <Button onClick={() => setGrp(null)}>Default</Button>
                    </ButtonGroup>
                </Stack>
            </Stack>
            <Header unit={unit} />
            {grp == null && <Contents data={data} />}
            {grp !== null && <Grouped data={data} groupby={grp} />}
            <Footer data={data} />
        </Box>
    );
};
// if (type == "entrydetails") {
//     return (
//         <>
//             <TableHead>
//                 <TableRow>
//                     <TableCell>Type</TableCell>
//                     <TableCell>Date/User</TableCell>
//                     <TableCell>Desp</TableCell>
//                     <TableCell>Amount</TableCell>
//                 </TableRow>
//             </TableHead>
//             <TableBody>
//                 {data.map((v, i) => (
//                     <TableRow>
//                         <TableCell>
//                             <Typography noWrap={true}>
//                                 {v.trans_no && (
//                                     <Link
//                                         target="_blank"
//                                         rel="noreferrer"
//                                         href={route("journal.show", {
//                                             journal: v.trans_no,
//                                         })}
//                                         children={`TR#: ${v.trans_no}`}
//                                     />
//                                 )}
//                             </Typography>
//                         </TableCell>
//                         <TableCell>
//                             {converDate(v.created_at)}
//                             <Divider />
//                             {v.user}
//                         </TableCell>
//                         <TableCell>{v.desp}</TableCell>
//                         <TableCell>{v.debit - v.credit}</TableCell>
//                     </TableRow>
//                 ))}
//             </TableBody>
//             <TableFooter>
//                 <TableRow>
//                     <TableCell colSpan={3}>Total</TableCell>
//                     <TableCell>
//                         {data.reduce((t, c) => {
//                             t += c.debit - c.credit;
//                             return t;
//                         }, 0)}
//                     </TableCell>
//                 </TableRow>
//             </TableFooter>
//         </>
//     );
// }

const QtyDetails = ({ details }) => {
    const [anchor, setAnchor] = useState(null);
    const [state, setState] = useState([]);
    const [total, setTotal] = useState(0);
    useEffect(() => {
        setState(details);
        const dr = round(
            sumBy(details, (o) => parseFloat(o.debit)),
            2
        );
        const cr = round(
            sumBy(details, (o) => parseFloat(o.credit)),
            2
        );
        setTotal(dr - cr);
    }, [details]);
    return (
        <>
            <Button onClick={(e) => setAnchor(e.currentTarget)}>
                {total && total}
            </Button>
            <Menu
                open={Boolean(anchor)}
                anchorEl={anchor}
                onClose={() => setAnchor(null)}
            >
                {state?.map((v) => (
                    // <MenuItem key={v.id}>
                    <Grid
                        key={v.id}
                        container
                        columnSpacing={2}
                        rowSpacing={0.5}
                        p={1}
                        borderBottom={1}
                        borderColor={grey[400]}
                    >
                        <Grid item xs={6}>
                            <Typography variant="subtitle2">
                                {v.desp}
                            </Typography>
                        </Grid>
                        <Grid item xs={2}>
                            <Typography variant="subtitle2">
                                {v.debit}
                            </Typography>
                        </Grid>
                        <Grid item xs={2}>
                            <Typography variant="subtitle2">
                                {v.credit}
                            </Typography>
                        </Grid>
                    </Grid>
                    // </MenuItem>
                ))}
            </Menu>
        </>
    );
};

const Grouped = ({ data, groupby }) => {
    const [state, setState] = useState([]);
    const [open, setOpen] = useState([]);
    const handleOpen = (head) => {
        if (open.includes(head)) {
            setOpen(open.filter((v) => v !== head));
        } else {
            setOpen([...open, head]);
        }
    };
    useEffect(() => {
        setState(Object.entries(groupBy(data, groupby)));
    }, [data, groupby]);
    useEffect(() => {
        console.log(state);
    }, [state]);
    return state.map(([head, details]) => (
        <Box key={head} sx={{ my: 0.5 }}>
            <Grid
                container
                p={1}
                component={Paper}
                bgcolor={green[200]}
                columnSpacing={2}
                rowSpacing={0.5}
                my={0.25}
            >
                <Grid
                    item
                    xs={6}
                    sx={{ cursor: "pointer" }}
                    onClick={() => handleOpen(head)}
                >
                    {open.includes(head) ? (
                        <ArrowDropUp fontSize="0.5rem" />
                    ) : (
                        <ArrowDropDown fontSize="0.5rem" />
                    )}{" "}
                    {head}
                </Grid>
                <Grid
                    item
                    xs={3}
                    children={sumBy(
                        details,
                        (o) => parseFloat(o.debit) - parseFloat(o.credit)
                    )}
                />
                <Grid item xs={3} textAlign="right">
                    <Typography variant="body1">
                        Rs.
                        {/* {sumBy(
                            flatMap(details, (o) => o.journals),
                            (o) => o.qty * o.rate
                        )} */}
                    </Typography>
                </Grid>
            </Grid>
            <Collapse in={open.includes(head) ? true : false}>
                <Contents data={details} />
            </Collapse>
        </Box>
    ));
};
const Header = ({ unit }) => {
    return (
        <Grid
            component={Paper}
            elevation={8}
            container
            columnSpacing={2}
            rowSpacing={0.5}
            justifyContent="center"
            alignItems="center"
            p={1}
            mb={0.5}
            border={0.5}
            borderColor={grey[200]}
            bgcolor={blue[300]}
        >
            <Grid item xs={2}>
                Tr# / JR#
            </Grid>
            <Grid item xs={2}>
                Date
            </Grid>
            <Grid item xs={2}>
                User
            </Grid>
            <Grid item xs={2}>
                Debit
            </Grid>
            <Grid item xs={2}>
                Credit
            </Grid>
            <Grid item xs={2}>
                Balance
            </Grid>
        </Grid>
    );
};
const Contents = ({ data }) => {
    return data.map((v) => {
        return (
            <Grid
                component={Paper}
                container
                columnSpacing={2}
                rowSpacing={0.5}
                justifyContent="center"
                alignItems="center"
                key={v.id}
                p={1}
                border={0.5}
                borderColor={grey[200]}
            >
                <Grid item xs={2} textAlign="left" px={0}>
                    <Link
                        // href={route("creditBills.show", {
                        //     creditBill: v.bill_no,
                        // })}
                        target="_blank"
                        rel="noopener"
                        children={v.trans_no}
                    />
                    <Typography variant="body2">
                        {v.transactions.entry_no}
                    </Typography>
                </Grid>

                <Grid item xs={2}>
                    {v.transactions.created_at}
                </Grid>
                <Grid item xs={2}>
                    <Typography variant="body2">
                        {v?.transactions?.users?.user}
                    </Typography>
                </Grid>
                <Grid item xs={2}>
                    <Typography variant="body2">
                        {/* {round(sumBy(v.journals, (o) => parseFloat(o.debit)))} */}
                        {v.debit}
                    </Typography>
                </Grid>
                <Grid item xs={2}>
                    <Typography variant="body2">
                        {/* {round(sumBy(v.journals, (o) => parseFloat(o.credit)))} */}
                        {v.credit}
                    </Typography>
                </Grid>
                <Grid item xs={2}>
                    <Typography variant="body2">
                        {v.debit - v.credit}
                        {/* <QtyDetails details={v.journals} /> */}
                    </Typography>
                </Grid>
            </Grid>
        );
    });
};
const Footer = ({ data }) => {
    return (
        <Grid
            component={Paper}
            elevation={8}
            container
            columnSpacing={2}
            rowSpacing={0.5}
            justifyContent="center"
            alignItems="center"
            p={1}
            mb={0.5}
            border={0.5}
            borderColor={grey[200]}
            bgcolor={blue[300]}
        >
            <Grid item xs={6}>
                Total
            </Grid>
            <Grid item xs={3}>
                {sumBy(data, (v) => parseFloat(v.debit))}
            </Grid>
            <Grid item xs={3}>
                {sumBy(data, (v) => parseFloat(v.credit))}
            </Grid>
        </Grid>
    );
};
