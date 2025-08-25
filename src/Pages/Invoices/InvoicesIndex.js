import {
    Box,
    IconButton,
    Skeleton,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    useTheme,
    Button,
    TextField,
    FormControl,
    InputLabel,
    OutlinedInput,
    InputAdornment,
    FormControlLabel,
    Switch,
    Menu,
    MenuItem,
} from "@mui/material";
import { blue, green, lightGreen, orange } from "@mui/material/colors";
import React, { useState, useEffect } from "react";
import {
    ArrowBackIosNew,
    FilterAlt,
    RemoveRedEyeOutlined,
    VisibilityOff,
} from "@mui/icons-material";
import axios from "axios";
// import { AddIcon } from "@mui/icons-material/Add";
import AddIcon from "@mui/icons-material/Add";
import { CreateInvoice } from "./CreateInvoice";
import { useContext } from "react";
import CONTEXT from "./context";
import { Invoice } from "./Invoice";
import { Link, useNavigate } from "react-router-dom";

const InvoicesIndex = () => {
    const { refresh, setRefresh, allInvoices, setAllInvoices, getAllInvoices } =
        useContext(CONTEXT);
    const theme = useTheme();
    const [state, setState] = useState([]);
    const [searchstr, setSearchStr] = useState("");
    const [filtered, setFiltered] = useState([]);
    const [grouping, setGrouping] = useState({ id: "", array: "", name: "" });
    const [groupedData, setGroupedData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentInvoice, setCurrentInvoice] = useState(null);
    const [variant, setVariant] = useState("view");
    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate();
    const groupdata = (id, array, name) => {
        const HID = id;
        const ArrName = array;
        const Name = name;
        const total = allInvoices.reduce((ttl, c, i) => {
            let indx = ttl.findIndex((v) => v.headingId === c[HID]);
            console.log(indx);
            if (indx > -1) {
                ttl[indx]["childs"].push(c);
            } else {
                const abc = c[ArrName][Name];
                ttl.push({
                    headingId: c[HID],
                    headingName: abc,
                    childs: [{ ...c }],
                });
            }
            return ttl;
        }, []);
        setGroupedData(total);
    };
    useEffect(() => {
        const str = searchstr.toLowerCase();
        const filteredData = allInvoices.filter((item) => {
            return (
                item.prefix.toLowerCase().includes(str) ||
                item.date.toLowerCase().includes(str) ||
                item.project.name.toLowerCase().includes(str) ||
                item.customer.name.toLowerCase().includes(str)
            );
        });

        setState(filteredData);
    }, [searchstr, allInvoices]);

    useEffect(() => {
        if (grouping.id) {
            groupdata(grouping.id, grouping.array, grouping.name);
        } else {
            setGroupedData([]);
        }
    }, [grouping]);
    useEffect(() => {
        getAllInvoices();
    }, [getAllInvoices]);
    return (
        <Box>
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
            >
                <Stack direction="row" spacing={2}>
                    {/* <IconButton
                        sx={{ border: 1, borderColor: blue[800] }}
                        onClick={() => navigate(-1)}
                        children={<ArrowBackIosNew color="primary" />}
                    /> */}
                    <CreateInvoice variant="create" />
                </Stack>
                <SearchFiled
                    setAnchorEl={setAnchorEl}
                    searchstr={searchstr}
                    setSearchStr={setSearchStr}
                />
                <FilterForm
                    anchorEl={anchorEl}
                    setAnchorEl={setAnchorEl}
                    grouping={grouping}
                    setGrouping={setGrouping}
                />
            </Stack>

            <Invoice
                currentInvoice={currentInvoice}
                setCurrentInvoice={setCurrentInvoice}
                variant={variant}
            />

            <TableContainer>
                <Table>
                    <TableHead sx={{ backgroundColor: blue[300] }}>
                        <TableRow>
                            <TableCell>
                                <Typography variant="body1">
                                    Invoice #
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography variant="body1">
                                    Project/Customer
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography variant="body1">Amount</Typography>
                            </TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {groupedData.length > 0
                            ? groupedData.map((row, i) => (
                                  <>
                                      <TableRow>
                                          <TableCell colSpan={4}>
                                              <Typography
                                                  component={Link}
                                                  data-target={
                                                      "#row" + row.headingId
                                                  }
                                                  data-toggle="collapse"
                                                  variant="body1"
                                                  fontWeight={700}
                                              >
                                                  {row.headingName}
                                              </Typography>
                                          </TableCell>
                                      </TableRow>
                                      {row.childs.map((v, i) => (
                                          <TableRow
                                              className="collapse"
                                              id={"row" + row.headingId}
                                              key={v.id}
                                              sx={{
                                                  backgroundColor:
                                                      v.fresh == 1
                                                          ? lightGreen[300]
                                                          : v.updated == 1 &&
                                                            orange[300],
                                              }}
                                          >
                                              <TableCell>
                                                  <Typography variant="body2">
                                                      {v.prefix}-{v.date}-
                                                      {v.number}
                                                  </Typography>
                                                  <Typography variant="caption">
                                                      {v.date}
                                                  </Typography>
                                              </TableCell>
                                              <TableCell>
                                                  <Typography variant="body2">
                                                      {v.project.name}
                                                  </Typography>
                                                  <Typography variant="body2">
                                                      {v.customer.name}
                                                  </Typography>
                                              </TableCell>
                                              <TableCell>
                                                  <Typography variant="body1">
                                                      {v.details_sum_amount}
                                                  </Typography>
                                                  <Typography
                                                      variant="caption"
                                                      color={
                                                          v.trans_no
                                                              ? "primary"
                                                              : "error"
                                                      }
                                                  >
                                                      {v.trans_no
                                                          ? "Posted"
                                                          : "Un-Posted"}
                                                  </Typography>
                                              </TableCell>
                                              <TableCell padding="none">
                                                  <IconButton
                                                      onClick={() =>
                                                          setCurrentInvoice(
                                                              v.id
                                                          )
                                                      }
                                                      color="info"
                                                      sx={{
                                                          border: 1,
                                                          borderColor:
                                                              blue[200],
                                                      }}
                                                  >
                                                      <RemoveRedEyeOutlined />
                                                  </IconButton>
                                              </TableCell>
                                          </TableRow>
                                      ))}
                                  </>
                              ))
                            : state.length > 0 &&
                              state.map((v, i) => (
                                  <TableRow
                                      key={v.id}
                                      sx={{
                                          backgroundColor:
                                              v.fresh == 1
                                                  ? lightGreen[300]
                                                  : v.updated == 1 &&
                                                    orange[300],
                                      }}
                                  >
                                      <TableCell>
                                          <Typography variant="body2">
                                              {v.prefix}-{v.date}-{v.number}
                                          </Typography>
                                          <Typography variant="body2">
                                              {v.date}
                                          </Typography>
                                          <Typography
                                              variant="body2"
                                              children={"ID: " + v.id}
                                          />
                                      </TableCell>
                                      <TableCell>
                                          <Typography variant="body2">
                                              {v.project.name}
                                          </Typography>
                                          <Typography variant="body2">
                                              {v.customer.name}
                                          </Typography>
                                      </TableCell>
                                      <TableCell>
                                          <Typography variant="body1">
                                              {v.details_sum_amount}
                                          </Typography>
                                          <Typography
                                              variant="caption"
                                              color={
                                                  v.trans_no
                                                      ? "primary"
                                                      : "error"
                                              }
                                          >
                                              {v.trans_no
                                                  ? "Posted"
                                                  : "Un-Posted"}
                                          </Typography>
                                          {v.paid == 1 && (
                                              <Typography
                                                  variant="body2"
                                                  color={green[600]}
                                              >
                                                  Paid
                                              </Typography>
                                          )}
                                      </TableCell>
                                      <TableCell padding="none">
                                          <IconButton
                                              onClick={() =>
                                                  setCurrentInvoice(v.id)
                                              }
                                              color="info"
                                              sx={{
                                                  border: 1,
                                                  borderColor: blue[200],
                                              }}
                                          >
                                              <RemoveRedEyeOutlined />
                                          </IconButton>
                                      </TableCell>
                                  </TableRow>
                              ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

const SearchFiled = ({ setAnchorEl, searchstr, setSearchStr }) => {
    return (
        <FormControl
            sx={{ my: 1, width: { xs: "80%", md: "30%" } }}
            variant="outlined"
        >
            <InputLabel htmlFor="outlined-adornment-password">
                Search
            </InputLabel>
            <OutlinedInput
                id="outlined-adornment-password"
                type={"text"}
                value={searchstr}
                onChange={(e) => setSearchStr(e.target.value)}
                endAdornment={
                    <InputAdornment position="end">
                        <IconButton
                            aria-label={"display the password"}
                            onClick={(e) => setAnchorEl(e.target)}
                            // onClick={handleClickShowPassword}
                            // onMouseDown={handleMouseDownPassword}
                            // onMouseUp={handleMouseUpPassword}
                            edge="end"
                        >
                            {<FilterAlt color="warning" />}
                        </IconButton>
                    </InputAdornment>
                }
                label="Password"
            />
        </FormControl>
    );
};
const FilterForm = ({ anchorEl, setAnchorEl, grouping, setGrouping }) => {
    const handleChange = (e) => {
        if (e.target.checked) {
            if (e.target.value === "project") {
                setGrouping({
                    id: "project_id",
                    array: "project",
                    name: "name",
                });
            }
            if (e.target.value === "customer") {
                setGrouping({
                    id: "customer_id",
                    array: "customer",
                    name: "name",
                });
            }
        } else {
            setGrouping({
                id: "",
                array: "",
                name: "",
            });
        }
    };
    return (
        <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
        >
            <MenuItem divider dense>
                <Typography variant="body1" gutterBottom>
                    Grouped
                </Typography>
            </MenuItem>
            <MenuItem divider dense>
                <FormControlLabel
                    label="Project"
                    control={<Switch value="project" onChange={handleChange} />}
                />
            </MenuItem>
            <MenuItem divider dense>
                <FormControlLabel
                    label="Customer"
                    control={
                        <Switch value="customer" onChange={handleChange} />
                    }
                />
            </MenuItem>
        </Menu>
    );
};
export default InvoicesIndex;
