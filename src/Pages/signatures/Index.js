import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  MenuItem,
  Icon,
  IconButton,
  Badge,
  Button,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import dayjs from "dayjs";
import { green, grey, red } from "@mui/material/colors";
import Decision from "./Decision";
import API from "../../api/axiosApi";
import Messenger from "../messenger/Messenger";
import ApprovalTimeline from "../../components/ui/ApprovalTimeline";
const Index = () => {
  const DecisionRef = useRef();
  const MessengerRef = useRef();
  const ApprovalRef = useRef();
  const [data, setData] = useState([]);
  const [filterProject, setFilterProject] = useState("");
  const [filterType, setFilterType] = useState("");
  const [current, setCurrent] = useState({});

  const getData = async () => {
    try {
      const result = await API.get("/signatures");
      console.log("Signatures", result);
      if (result.status === 200) {
        setData(result.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  // Extract unique projects and types for dropdowns
  const projectOptions = useMemo(() => {
    const set = new Set();
    data.forEach((item) => {
      if (item.project_name) set.add(item.project_name);
    });
    return Array.from(set);
  }, [data]);

  const typeOptions = useMemo(() => {
    const set = new Set(data.map((item) => item.screen_name));
    return Array.from(set);
  }, [data]);

  // Apply filters
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchesProject = filterProject
        ? item.project_name === filterProject
        : true;
      const matchesType = filterType ? item.screen_name === filterType : true;
      return matchesProject && matchesType;
    });
  }, [data, filterProject, filterType]);

  // Group by project
  const groupedData = useMemo(() => {
    return filteredData.reduce((acc, item) => {
      const key = item.project_name || "No Project";
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    }, {});
  }, [filteredData]);
  useEffect(() => {
    getData();
  }, []);
  return (
    <Box p={2}>
      <Decision ref={DecisionRef} id={current?.id} refresh={getData} />
      <Messenger
        ref={MessengerRef}
        type={current?.object_type}
        id={current?.object_id}
      />
      <ApprovalTimeline
        ref={ApprovalRef}
        type={current?.object_type}
        id={current?.object_id}
      />
      <Typography variant="h5" gutterBottom>
        Signatures
      </Typography>

      {/* Filters */}
      <Box display="flex" gap={2} mb={2}>
        <TextField
          label="Filter by Project"
          select
          value={filterProject}
          onChange={(e) => setFilterProject(e.target.value)}
          fullWidth
        >
          <MenuItem value="">All Projects</MenuItem>
          {projectOptions.map((project) => (
            <MenuItem key={project} value={project}>
              {project}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="Filter by Object Type"
          select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          fullWidth
        >
          <MenuItem value="">All Types</MenuItem>
          {typeOptions.map((type) => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      {/* Grouped Tables */}
      {Object.entries(groupedData).map(([group, items]) => (
        <Accordion key={group} defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Badge
              sx={{ pr: 1 }}
              variant="standard"
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              badgeContent={items.length || 0}
              color="secondary"
            >
              <Typography variant="h6">{group}</Typography>
            </Badge>
          </AccordionSummary>
          <AccordionDetails>
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Type</TableCell>
                    <TableCell>ID</TableCell>
                    <TableCell>Signature</TableCell>
                    <TableCell>Marked On</TableCell>
                    <TableCell>Decision</TableCell>
                    <TableCell>Messages</TableCell>
                    <TableCell>Approvals</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.screen_name}</TableCell>
                      <TableCell>{item.object_id}</TableCell>
                      <TableCell>{item.signature == 0 && "Pending"}</TableCell>
                      <TableCell>
                        {dayjs(item.created_at).format("DD-MMM-YYYY")}
                      </TableCell>
                      <TableCell>
                        <IconButton
                          onClick={() => {
                            setCurrent(item);
                            DecisionRef.current.open();
                          }}
                          sx={{
                            ":hover": {
                              bgcolor: green[600],
                              color: grey[50],
                            },
                            bgcolor: green[300],
                            mr: 1,
                          }}
                        >
                          <Icon children="check" />
                        </IconButton>
                      </TableCell>
                      <TableCell>
                        <Button
                          onClick={() => {
                            setCurrent(item);
                            MessengerRef.current.open();
                          }}
                        >
                          Messages
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Button
                          onClick={() => {
                            setCurrent(item);
                            ApprovalRef.current.open();
                          }}
                        >
                          Approvals
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default Index;
