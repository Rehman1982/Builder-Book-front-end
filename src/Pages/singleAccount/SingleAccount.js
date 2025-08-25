import React, { useState, useMemo, useEffect, Component, useRef, useCallback } from 'react';
import {
    TextField,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Grid,
    Card,
    CardContent,
    Typography,
    List,
    ListItem,
    ListItemText,
    Box,
    Paper,
    IconButton,
    TableCell,
    Dialog,
    Backdrop,
    CircularProgress,
    Stack,
    Table,
    TableRow,
    TableHead,
    TableBody,
    ButtonGroup,
    Button
} from '@mui/material';
import axios from 'axios';
import { Link, NavLink, Outlet, Route, useLocation } from "react-router-dom";
import { Edit, RemoveRedEyeOutlined } from '@mui/icons-material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { blue } from '@mui/material/colors';
import { FixedSizeList } from 'react-window';
import InfiniteScroll from 'react-infinite-scroller';
import LinearProgress from '@mui/material/LinearProgress';
const SingleAccount = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const [balance, SetBalance] = useState(0);
    const [data, setData] = useState([]);
    const [filter, setFilter] = useState('');
    const [groupBy, setGroupBy] = useState('');
    const [page, setPage] = useState(0);
    const [isBusy, setIsBusy] = useState(false);
    const [crossAc, setCrossAc] = useState(null);
    const [retrive, setRetrive] = useState(true);
    const [progress, setProgress] = useState(0);
    // const boxRef = useRef();

    // Filtering logic
    const filteredData = useMemo(() => {
        return data.filter(
            (transaction) =>
                transaction.desp?.toLowerCase().includes(filter.toLowerCase()) ||
                transaction.users.user.toLowerCase().includes(filter.toLowerCase())
        );
    }, [filter, data]);

    // Grouping logic
    const groupedData = useMemo(() => {
        return filteredData.reduce((acc, transaction) => {
            const groupKey = transaction[groupBy] || 'Ungrouped';
            if (!acc[groupKey]) acc[groupKey] = [];
            acc[groupKey].push(transaction);
            return acc;
        }, {});
    }, [filteredData, groupBy]);
    const handleScroll = useCallback((e) => {
        const { scrollTop, scrollHeight, clientHeight } = e.target;
        // console.log(scrollTop + clientHeight, scrollHeight)
        if (scrollTop + clientHeight >= scrollHeight) {
            setPage(prv => prv + 1);
            // getData();
        }
    }, [])
    const getData = async () => {
        if (retrive) {
            // setIsBusy(true);
            const response = await axios.get(route("info"), { params: { account_id: queryParams.get("account_id"), type: "data", page: page + 1 } });
            // console.log(response.data.data);
            if (response.status == 200) {
                const count = Math.round(response.data.data.details.length * 100 / 18704);
                setProgress(prv => prv + count);
                setPage((prv) => prv + 1);
                setData((prvData) => [...prvData, ...response.data.data.details]);
                SetBalance(response.data.data.openingBalance);
                // setIsBusy(false);
                if (response.data.data.details.length < 100) setRetrive(false);
            };
        }
    }
    // const loadMore = useCallback(() => {
    // }, [])
    const Row = ({ index, style }) => {
        const transaction = filteredData[index];
        return (
            <ListItem
                style={style}
                key={transaction.trans_no}
                component="div"
                disablePadding
                divider
                alignItems='center'

            >
                <ListItemText
                    sx={{ width: "20%" }}
                    primary={
                        <Typography variant="body1">
                            <strong>TR#: </strong>{transaction.trans_no}
                        </Typography>
                    }
                    secondary={<SecondryText transaction={transaction} />}
                    secondaryTypographyProps={{ component: "div" }}
                />
                <ListItemText
                    sx={{ width: "60%" }}
                    primary={
                        <Typography variant="body1">
                            <strong>Desp: </strong> {transaction.desp || 'No Description'}
                        </Typography>
                    }
                    secondary={
                        <Box sx={{ color: blue[800] }}>
                            <Typography variant="body2">
                                <strong>User: </strong>{transaction.users.user}
                            </Typography>
                            {
                                transaction.item_id &&
                                <Typography variant="body2">
                                    <strong>Item: </strong>{transaction.items.item}
                                </Typography>
                            }
                            {
                                transaction.project_id &&
                                <Typography variant="body2">
                                    <strong>Project: </strong> {transaction.projects.name}
                                </Typography>
                            }
                        </Box>
                    }
                    secondaryTypographyProps={{ component: "div" }}
                />
                <Typography variant="body2">
                    {transaction.Bal}
                    <IconButton onClick={() => setCrossAc(transaction.cross_ac)}>
                        <ArrowDropDownIcon />
                    </IconButton>
                </Typography>
            </ListItem>
        )
    }
    useEffect(() => {
        setProgress(Math.round((data.length * 100) / 18704));
    }, [data])
    return (
        <Paper sx={{ p: 2 }}>
            <Grid container spacing={2} sx={{ marginBottom: 1 }}>
                <Grid item xs={12} sm={12}>
                    <TextField
                        fullWidth
                        label="Filter by description or user"
                        variant="outlined"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    />
                </Grid>
                {/* <Grid item xs={12} sm={6}>
                    <FormControl fullWidth variant="outlined">
                        <InputLabel>Group By</InputLabel>
                        <Select
                            value={groupBy}
                            onChange={(e) => setGroupBy(e.target.value)}
                            label="Group By"
                        >
                            <MenuItem value="project_id">Project</MenuItem>
                            <MenuItem value="account_id">Account</MenuItem>
                            <MenuItem value="user_id">User</MenuItem>
                        </Select>
                    </FormControl>
                </Grid> */}
            </Grid>
            <CrossAc
                data={crossAc}
            />
            <Loading
                isBusy={isBusy}
                setIsBusy={setIsBusy}
            />
            <LinearProgressWithLabel progress={progress} />
            <InfiniteScroll
                pageStart={0}
                loadMore={getData}
                hasMore={retrive}
                loader="Loading....."
            >
                <FixedSizeList
                    height={600}
                    width="100%"
                    itemSize={100}
                    itemCount={data.length}
                >
                    {Row}
                </FixedSizeList >
            </InfiniteScroll>
        </Paper>
    );
};

export default SingleAccount;

const SecondryText = ({ transaction }) => (
    <Box sx={{ color: blue[800] }}>
        <Typography variant="body2">
            <strong>Dt:</strong> {transaction.created_at}
        </Typography>
        {
            transaction.bill_no &&
            <Typography variant="body2">
                <strong>Bill#:</strong> {transaction.bill_no}
            </Typography>
        }
        {
            transaction.pb_no &&
            <Typography variant="body2">
                <strong>PB#</strong> {transaction.pb_no}
            </Typography>
        }
        {
            transaction.drMemoNo &&
            <Typography variant="body2">
                <strong>Dr: Memo#</strong> {transaction.drMemoNo}
            </Typography>
        }
        {
            transaction.entry_no &&
            <Typography variant="body2">
                <strong>JR:#</strong> {transaction.entry_no}
            </Typography>
        }
        {
            transaction.invoice_no &&
            <Typography variant="body2">
                <strong>Inv:#</strong> {transaction.invoice_no}
            </Typography>
        }
        {
            transaction.payment_no &&
            <Typography variant="body2">
                <strong>PMT:#</strong> {transaction.payment_no}
            </Typography>
        }
        {
            transaction.pr_exp_no &&
            <Typography variant="body2">
                <strong>PExp:#</strong> {transaction.pr_exp_no}
            </Typography>
        }
        {
            transaction.reten_release_no &&
            <Typography variant="body2">
                <strong>RR:#</strong> {transaction.reten_release_no}
            </Typography>
        }
    </Box>
)
const CrossAc = ({ data }) => {
    const [open, setOpen] = useState(false);
    const handleClose = () => {
        setOpen(false);
    }
    useEffect(() => {
        if (data) setOpen(true);
    }, [data])
    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
        >
            <Box sx={{ p: 2 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>AC/Desp</TableCell>
                            <TableCell>Debit</TableCell>
                            <TableCell>Credit</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data && data.map(item =>
                            <TableRow key={item.id}>
                                <TableCell>
                                    <Typography>{`To AC: ${item.accounts.acctname}`}</Typography>
                                    <Typography>{item.desp}</Typography>
                                </TableCell>
                                <TableCell>{item.debit}</TableCell>
                                <TableCell>{item.credit}</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </Box>
        </Dialog >
    )
};
const Loading = ({ isBusy, setIsBusy }) => {

    return (
        <Backdrop
            sx={{ color: "#fff" }}
            open={isBusy}
        >
            <CircularProgress color="inherit" />
        </Backdrop>
    )
}
const RenderList = React.memo(({ data, setCrossAc, handleScroll, retrive }) => {
    return (
        <Box sx={{ maxHeight: "80vh", overflowY: "auto", color: blue[800] }} onScroll={handleScroll}>
            {Object.keys(data).map((groupKey, i) => (
                <List key={i} sx={{ marginBottom: 2, color: blue[800] }}
                    subheader={<Typography variant="h6" gutterBottom>{groupKey}</Typography>}
                    disablePadding
                >
                    {data[groupKey].map((transaction) => (
                        <ListItem key={transaction.id} sx={{ marginBottom: 1 }} divider alignItems="flex-start">
                            {console.log("mainCalled")}
                            <ListItemText
                                sx={{ width: "30%" }}
                                primary={
                                    <Typography variant="body1">
                                        <strong>TR#: </strong>{transaction.id}
                                    </Typography>
                                }
                                secondary={<SecondryText transaction={transaction} />}
                                secondaryTypographyProps={{ component: "div" }}
                            />
                            <ListItemText
                                sx={{ width: "60%" }}
                                primary={
                                    <Typography variant="body1">
                                        <strong>Desp: </strong> {transaction.desp || 'No Description'}
                                    </Typography>
                                }
                                secondary={
                                    <Box sx={{ color: blue[800] }}>
                                        <Typography variant="body2">
                                            <strong>User: </strong>{transaction.users.user}
                                        </Typography>
                                        {
                                            transaction.item_id &&
                                            <Typography variant="body2">
                                                <strong>Item: </strong>{transaction.items.item}
                                            </Typography>
                                        }
                                        {
                                            transaction.project_id &&
                                            <Typography variant="body2">
                                                <strong>Project: </strong> {transaction.projects.name}
                                            </Typography>
                                        }
                                    </Box>
                                }
                                secondaryTypographyProps={{ component: "div" }}
                            />
                            <Typography variant="body2">
                                {transaction.Bal}
                                <IconButton onClick={() => setCrossAc(transaction.cross_ac)}>
                                    <ArrowDropDownIcon />
                                </IconButton>
                            </Typography>
                        </ListItem>
                    ))}
                </List>
            ))}
            {!retrive && <Typography variant='body2'>No More Data Available</Typography>}
        </Box>
    )
});
function LinearProgressWithLabel({ progress }) {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ width: '100%', mr: 1, height: 10 }}>
                <LinearProgress variant="determinate" value={progress} />
            </Box>
            <Box sx={{ minWidth: 35 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {`${Math.round(progress)}%`}
                </Typography>
            </Box>
        </Box>
    );
}
