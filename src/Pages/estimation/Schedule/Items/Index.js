import React, { useCallback, useContext, useState } from "react";
import {
    Box,
    Typography,
    TextField,
    Button,
    Card,
    CardContent,
    CardActions,
    Grid,
    MenuItem,
    Container,
    Paper,
    Tooltip,
    Stack,
    Pagination,
    PaginationItem,
    IconButton,
    Menu,
    CircularProgress,
    Backdrop,
    ButtonGroup,
} from "@mui/material";
import CreateItem from "./Create";
import { useRef } from "react";
import { blue, grey } from "@mui/material/colors";
import { useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import FilterListIcon from "@mui/icons-material/FilterList";
import { Alert } from "../../../../context/AlertBar/AlertBar";

const ItemsIndex = () => {
    const location = useLocation();
    const { scheduleId, name } = location.state;
    const CreateRef = useRef();
    const [variant, setVariant] = useState("Add");
    const [currentItem, setCurrentItem] = useState(null);
    const [refresh, setRefresh] = useState(false);
    // pagination
    const [currentpage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(100);
    const [totalPage, setTotalPages] = useState(0);
    const [busy, setBusy] = useState(false);

    // pagination end
    // State to manage the list of items
    const [items, setItems] = useState([
        {
            schedule: "sadfsda",
            item_code: "4464",
            description: "asfdsafsa",
            bs_base_qty: "asdfsf",
            bs_unit: "dfafsdaf",
            bs_composite: "asdfds",
        },
    ]);
    const getItemsData = async (scheduleId) => {
        setBusy(true);
        try {
            const res = await axios.get(
                route("estimation.schedules.items.index", {
                    type: "data",
                    schedule_id: scheduleId,
                    page: currentpage,
                    perpage: perPage,
                })
            );
            if (res.status == 200) {
                setTotalPages(Math.ceil(res.data.totalRecords / perPage));
                setItems(res.data.data);
            }
            setBusy(false);
        } catch (error) {
            console.log(error.response);
            setBusy(false);
        }
    };
    const CURD = useCallback((action, data) => {
        console.log(action, data);
        if (action == "Edit") {
            setCurrentItem(data);
            setVariant("Edit");
            CreateRef.current.open();
        }
        if (action == "View") {
            setVariant("View");
            setCurrentItem(data);
            CreateRef.current.open();
        }
        if (action == "Add") {
            setVariant("Add");
            setCurrentItem();
            CreateRef.current.open();
        }
    }, []);
    useEffect(() => {
        getItemsData(scheduleId);
    }, [currentpage, perPage]);
    useEffect(() => {
        if (refresh) {
            getItemsData(scheduleId);
            setRefresh(false);
        }
    }, [refresh]);
    return (
        <div>
            <Backdrop
                open={busy}
                children={<CircularProgress sx={{ color: grey[50] }} />}
            ></Backdrop>
            <Container
                sx={{
                    maxWidth: 1000,
                    px: 3,
                }}
            >
                <Box>
                    <CreateItem
                        variant={variant}
                        currentItem={currentItem}
                        setCurrentItem={setCurrentItem}
                        ref={CreateRef}
                        scheduleId={scheduleId}
                        setRefresh={setRefresh}
                    />
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        mb={1}
                    >
                        <Typography variant="h6">{name}</Typography>
                        <Button
                            onClick={() => {
                                CURD("Add", "");
                            }}
                        >
                            Create Item
                        </Button>
                    </Stack>

                    <Stack
                        spacing={2}
                        direction="row"
                        justifyContent="flex-end"
                        alignItems="center"
                        my={1}
                    >
                        <LimitPerPage
                            perPage={perPage}
                            setPerPage={setPerPage}
                            setCurrentPage={setCurrentPage}
                        />
                        <Paginate
                            totalPage={totalPage}
                            currentpage={currentpage}
                            setCurrentPage={setCurrentPage}
                            busy={busy}
                        />
                        <Filter
                            setItems={setItems}
                            scheduleId={scheduleId}
                            getItemsData={getItemsData}
                        />
                        {busy && <CircularProgress />}
                    </Stack>
                    <Grid
                        container
                        borderBottom={0.5}
                        borderTop={0.5}
                        borderColor={grey[400]}
                        p={1}
                        bgcolor={blue[200]}
                        columnSpacing={2}
                    >
                        <Grid item xs={2}>
                            <Typography variant="body1" fontWeight={700}>
                                Item_code
                            </Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography variant="body1" fontWeight={700} noWrap>
                                Description
                            </Typography>
                        </Grid>
                        <Grid item xs={2}>
                            <Typography variant="body1" fontWeight={700}>
                                Quantity
                            </Typography>
                        </Grid>
                        <Grid item xs={1}>
                            <Typography variant="body1" fontWeight={700}>
                                Unit
                            </Typography>
                        </Grid>
                        <Grid item xs={2}>
                            <Typography variant="body1" fontWeight={700}>
                                Rate
                            </Typography>
                        </Grid>
                        <Grid item xs={1}></Grid>
                    </Grid>
                </Box>
                <Box>
                    <Contents items={items} CURD={CURD} />
                </Box>
                {items.length === 0 ? (
                    <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{ mt: 2 }}
                    >
                        No items available. Add one to get started!
                    </Typography>
                ) : (
                    <Stack
                        direction="row"
                        justifyContent="flex-end"
                        alignItems="center"
                        my={1}
                    >
                        <Paginate
                            totalPage={totalPage}
                            currentpage={currentpage}
                            setCurrentPage={setCurrentPage}
                            busy={busy}
                        />
                    </Stack>
                )}
            </Container>
        </div>
    );
};

const Paginate = ({
    totalPage,
    currentpage,
    setCurrentPage,
    perPage,
    setPerPage,
    busy,
}) => {
    return (
        <Pagination
            variant="outlined"
            count={totalPage}
            page={currentpage}
            onChange={(event, page) => setCurrentPage(page)}
            color="primary"
            disabled={busy}
        />
    );
};
const Filter = ({ setItems, scheduleId, getItemsData }) => {
    const { showAlert, setMessage, setSeverity } = useContext(Alert);
    const [anchor, setAnchor] = useState(null);
    const [search, setSearch] = useState({
        item_code: "",
        description: "",
        bs_base_qty: "",
        bs_unit: "",
        bs_composite: "",
    });
    const handleChange = (event) => {
        const { name, value } = event.target;
        setSearch({ ...search, [name]: value });
    };
    const handleSearch = async () => {
        try {
            const res = await axios.get(
                route("estimation.schedules.items.index", {
                    type: "search",
                    schedule_id: scheduleId,
                    search: search,
                })
            );
            if (res.status == 200) {
                console.log(res.data);
                if (res.data.length > 0) {
                    setItems(res.data);
                } else {
                    setMessage("No data found!");
                    setSeverity("warning");
                    showAlert(true);
                }
            }
            // setTotalPages(Math.ceil(res.data.totalRecords / perPage));
            // if (res.status == 200) {
            //     setTotalPages(Math.ceil(res.data.totalRecords / perPage));
            //     setItems(res.data.data);
            // }
        } catch (error) {
            console.log(error.response);
        }
    };
    useEffect(() => {
        console.log(search);
    }, [search]);
    return (
        <>
            <IconButton
                onClick={(e) => setAnchor(e.currentTarget)}
                children={<FilterListIcon color="primary" />}
                sx={{ border: 0.5, borderColor: blue[300] }}
            />
            <Menu
                open={Boolean(anchor)}
                anchorEl={anchor}
                onClose={() => setAnchor(null)}
            >
                <Stack direction="column" spacing={1} p={1}>
                    <TextField
                        name="item_code"
                        value={search.item_code}
                        onChange={handleChange}
                        size="small"
                        label="Item Code"
                    />
                    <TextField
                        name="description"
                        value={search.description}
                        onChange={handleChange}
                        multiline
                        rows={4}
                        size="small"
                        label="Desp"
                    />
                    <TextField
                        name="bs_base_qty"
                        value={search.bs_base_qty}
                        onChange={handleChange}
                        size="small"
                        label="Quantity"
                    />
                    <TextField
                        name="bs_unit"
                        value={search.bs_unit}
                        onChange={handleChange}
                        size="small"
                        label="Unit"
                    />
                    <TextField
                        name="bs_composite"
                        value={search.bs_composite}
                        onChange={handleChange}
                        size="small"
                        label="Rate"
                    />
                    <ButtonGroup fullWidth>
                        <Button
                            onClick={() => {
                                getItemsData(scheduleId);
                                setAnchor(null);
                            }}
                        >
                            Reset
                        </Button>
                        <Button onClick={handleSearch} variant="contained">
                            Search
                        </Button>
                    </ButtonGroup>
                </Stack>
            </Menu>
        </>
    );
};

const LimitPerPage = ({ perPage, setPerPage, setCurrentPage }) => {
    const [anchor, setAnchor] = useState(null);
    const [pp, setPP] = useState(perPage);
    const handlePerPage = () => {
        setPerPage(pp);
        setAnchor(null);
        setCurrentPage(1);
    };
    return (
        <>
            <Tooltip title="Records per Page">
                <IconButton
                    onClick={(e) => setAnchor(e.currentTarget)}
                    children={
                        <Typography variant="caption">{perPage}</Typography>
                    }
                    sx={{
                        border: 1,
                        borderColor: blue[400],
                    }}
                />
            </Tooltip>
            <Menu
                open={Boolean(anchor)}
                onClose={() => setAnchor(null)}
                anchorEl={anchor}
            >
                <Stack direction="column" spacing={1} p={1}>
                    <TextField
                        value={pp}
                        onChange={(e) => setPP(e.target.value)}
                        size="small"
                        label="Records per Page"
                    />
                    <Button variant="contained" onClick={handlePerPage}>
                        Update
                    </Button>
                </Stack>
            </Menu>
        </>
    );
};

const Contents = React.memo(({ items, CURD }) => {
    return items.map((item, index) => (
        <Grid
            container
            borderBottom={0.5}
            borderColor={grey[400]}
            p={1}
            columnSpacing={2}
            key={index}
        >
            {console.log("item")}
            <Grid item xs={2}>
                <Typography variant="body1">{item.item_code}</Typography>
            </Grid>
            <Grid item xs={4}>
                <Tooltip title={item.description}>
                    <Typography variant="body1" noWrap>
                        {item.description}
                    </Typography>
                </Tooltip>
            </Grid>
            <Grid item xs={2}>
                <Typography variant="body1">{item.bs_base_qty}</Typography>
            </Grid>
            <Grid item xs={1}>
                <Typography variant="body1">{item.bs_unit}</Typography>
            </Grid>
            <Grid item xs={2}>
                <Typography variant="body1">{item.bs_composite}</Typography>
            </Grid>
            <Grid item xs={1}>
                <Button
                    size="small"
                    onClick={() => {
                        CURD("Edit", item);
                    }}
                >
                    Edit
                </Button>
            </Grid>
        </Grid>
    ));
});
export default ItemsIndex;
