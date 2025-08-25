import React, {
  useState,
  useMemo,
  useEffect,
  useRef,
  useCallback,
} from "react";

import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Icon,
  Stack,
  Pagination,
  IconButton,
  Button,
  Skeleton,
} from "@mui/material";
import dayjs from "dayjs";
import { blue, green, grey, yellow } from "@mui/material/colors";
import _ from "lodash";
import FilterForm from "./FilterForm";
import API from "../../api/axiosApi";
// import ApprovalTimeline from "../../components/ui/ApprovalTimeline";
import CURD from "./CURD";
import { useLoaderData } from "react-router-dom";
import {
  setBill,
  view,
  create,
} from "../../features/creditBill/creditBillSlice";
import { useDispatch } from "react-redux";
import { viewSignatures } from "../../features/signatures/signatureSlice";

const Bills = ({ period, status }) => {
  const dispatch = useDispatch();
  const user = useLoaderData();
  const [Bills, setBills] = useState([]);
  const [selected, setSelected] = useState(null);
  const [perPage, setPerpage] = useState(500);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [signature, setSignature] = useState({ type: null, id: null });
  const [filters, setFilters] = useState({
    billNo: "",
    vendor: "",
    project: "",
    text: "",
  });
  const getData = async () => {
    try {
      setLoading(true);
      const result = await API.get("transactions/creditBills", {
        params: {
          period,
          filters,
          page: currentPage,
          perPage,
          status: status,
        },
      });
      console.log(result.data);
      setCurrentPage(1);
      setBills(result.data.data);
      setTotalPages(result.data.last_page);
      setCurrentPage(result.data.current_page);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getData();
  }, [period, filters, currentPage, perPage]);
  return (
    <Box sx={{ mt: 1 }}>
      <CURD />
      {/* <ApprovalTimeline /> */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems={"center"}
        mb={1}
        px={1}
      >
        <FilterForm filters={filters} setFilters={setFilters} />
        <Pagination
          page={currentPage}
          count={totalPages}
          variant="outlined"
          color="success"
          siblingCount={2}
          size="small"
          onChange={(e, v) => setCurrentPage(v)}
        />
      </Stack>
      {Bills?.length > 0 ? (
        <TableContainer
          component={Paper}
          sx={{ maxHeight: "60vh", borderRadius: 1 }}
        >
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: "10%" }}>Bill#/PO</TableCell>
                <TableCell
                  sx={{
                    width: "40%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  Description/Project
                </TableCell>
                <TableCell sx={{ width: "10%" }}>Date</TableCell>
                <TableCell sx={{ width: "30%" }}>User/Vendor</TableCell>
                <TableCell sx={{ width: "10%" }}>Total</TableCell>
              </TableRow>
            </TableHead>
            {loading ? <Skelton /> : <TblBody bills={Bills} />}
          </Table>
        </TableContainer>
      ) : (
        <Typography variant="body1" sx={{ p: 3 }}>
          NO Data to display
        </Typography>
      )}
    </Box>
  );
};

export default Bills;

const TblBody = React.memo(({ bills }) => {
  const dispatch = useDispatch();
  return (
    <TableBody>
      {bills?.map((bill) => (
        <TableRow key={bill.Bill_no}>
          <TableCell>
            <Typography
              sx={{ cursor: "pointer", color: blue[700] }}
              onClick={() => {
                // console.log(create);
                dispatch(view(bill));
              }}
              variant="body2"
            >
              {bill.Bill_no}
            </Typography>
            <Typography variant="body2">{bill.po_id}</Typography>
          </TableCell>
          <TableCell>
            <Typography variant="body2">{bill.bill_desp}</Typography>
            <Typography variant="body2">{bill.project_name}</Typography>
          </TableCell>
          <TableCell>
            <Typography variant="body2" noWrap>
              {dayjs(bill.created_at).format("DD-MM-YYYY")}
            </Typography>
          </TableCell>
          <TableCell>
            <Typography variant="body2">{bill.user_name}</Typography>
            <Typography variant="body2">{bill.vendor_name}</Typography>
          </TableCell>
          <TableCell>
            <Stack
              direction={"row"}
              justifyContent={"flex-end"}
              alignItems={"center"}
            >
              <Typography variant="body2">{_.round(bill.Total)}</Typography>
              <IconButton
                size="small"
                onClick={() => {
                  dispatch(
                    viewSignatures({
                      type: "creditBills",
                      id: bill?.Bill_no,
                    })
                  );
                  //   showSignatures(bill);
                }}
              >
                <Icon>
                  {bill.status == "approved" ? "check_circle" : "pending"}
                </Icon>
              </IconButton>
            </Stack>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
});

const Skelton = () => {
  return (
    <TableBody>
      {_.times(50, (i) => (
        <TableRow key={i}>
          <TableCell colSpan={6}>
            <Skeleton variant="text" width="100%" height={24} />
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
};
