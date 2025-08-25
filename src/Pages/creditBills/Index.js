import React, { useState, useMemo, useEffect, useRef } from "react";
import PeriodSelector from "../../components/ui/PeriodSelector";
import {
    Box,
    Typography,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Icon,
    Stack,
    Button,
    Pagination,
    Tabs,
    Tab,
    useMediaQuery,
    useTheme,
    IconButton,
} from "@mui/material";
import dayjs from "dayjs";
import { blue, green, grey, orange, yellow } from "@mui/material/colors";
import debounce from "lodash.debounce";
import CURD from "./CURD";
import FilterForm from "./FilterForm";
// import billWorker from "../../workers/billWorker";
import MyLoader from "../helpers/MyLoader";
import _ from "lodash";
import Bills from "./Bills";

import Create from "./Create";

const Index = () => {
    const theme = useTheme();
    const createRef = useRef();
    const [period, setPeriod] = useState({
        periodFrom: dayjs().startOf("month").format("YYYY-MM-DD"),
        periodTo: dayjs().endOf("month").format("YYYY-MM-DD"),
    });
    const [activeTab, setActiveTab] = useState(0);
    const isMdUp = useMediaQuery(theme.breakpoints.up("md"));

    return (
        <Box>
            <Create ref={createRef} setActiveTab={setActiveTab} />
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                mb={1}
            >
                <Typography variant="body2" gutterBottom>
                    {`${period.periodFrom || ""} -  ${period.periodTo || ""}`}
                </Typography>
                <Box display={"flex"} gap={2}>
                    <Box sx={{ height: "100%" }}>
                        <PeriodSelector
                            {...period}
                            onSubmit={(prd) =>
                                setPeriod({
                                    periodFrom: prd.from,
                                    periodTo: prd.to,
                                })
                            }
                        />
                    </Box>
                    <IconButton
                        onClick={() => createRef.current.open()}
                        size="small"
                        sx={{ border: 1, borderColor: blue[500] }}
                    >
                        <Icon>add</Icon>
                    </IconButton>
                </Box>
            </Stack>
            <Box
                sx={{
                    width: "100%",
                    bgcolor: "background.paper",
                    borderRadius: 2,
                    boxShadow: 1,
                }}
            >
                <Tabs
                    value={activeTab}
                    onChange={(e, v) => setActiveTab(v)}
                    variant="fullWidth"
                    indicatorColor="primary"
                    textColor="primary"
                    aria-label="status tabs"
                    sx={{
                        borderBottom: 1,
                        borderColor: "divider",
                    }}
                >
                    <Tab
                        icon={
                            <Icon
                                sx={{
                                    border: 2,
                                    borderColor: orange[500],
                                    p: 2,
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    borderRadius: 5,
                                }}
                                children="check"
                            />
                        }
                        label={isMdUp ? "Approved" : null}
                        iconPosition="end"
                        sx={{ bgcolor: activeTab == 0 ? orange[100] : "" }}
                    />
                    <Tab
                        label={isMdUp ? "Pending" : null}
                        icon={
                            <Icon
                                sx={{
                                    border: 2,
                                    borderColor: orange[500],
                                    p: 2,
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    borderRadius: 5,
                                }}
                                children="hourglass_empty"
                            />
                        }
                        iconPosition="end"
                        sx={{ bgcolor: activeTab == 1 ? orange[100] : "" }}
                    />
                    <Tab
                        label={isMdUp ? "Retruned" : null}
                        icon={
                            <Icon
                                sx={{
                                    border: 2,
                                    borderColor: orange[500],
                                    p: 2,
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    borderRadius: 5,
                                }}
                                children="replay"
                            />
                        }
                        iconPosition="end"
                        sx={{ bgcolor: activeTab == 2 ? orange[100] : "" }}
                    />
                </Tabs>
                <Box>
                    {activeTab == 0 && (
                        <Bills period={period} status="approved" />
                    )}
                    {activeTab == 1 && (
                        <Bills period={period} status="pending" />
                    )}
                    {activeTab == 2 && (
                        <Bills period={period} status="drafted" />
                    )}
                </Box>
            </Box>
        </Box>
    );
};

export default Index;
