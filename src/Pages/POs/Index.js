import React, {
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import PageLayout from "../../components/ui/PageLayout";
import API from "../../api/axiosApi";
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  Icon,
  List,
  ListItem,
  Pagination,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
  IconButton,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import _ from "lodash";
import { blue, orange } from "@mui/material/colors";
import dayjs from "dayjs";
import { App } from "../../context/AppProvider";
import ViewPO from "./ViewPO";
import CreatePO from "./CreatePO/CreatePO";
import AuthContext from "../../context/AuthContext";
import { useGetPOsQuery } from "../../features/purchseOrders/poApi";
import { Body2, Bold } from "../../components/ui/MyTypo";

const from = dayjs().subtract(1, "year").startOf("year").format("YYYY-MM-DD");
const to = dayjs().endOf("year").format("YYYY-MM-DD");
const Index = () => {
  const { user } = useContext(AuthContext);
  const { showBill } = useContext(App);
  const BillsRef = useRef(null);
  const ViewPORef = useRef(null);
  const CreateRef = useRef(null);
  const [currentPo, setCurrentPo] = useState({});
  const viewBills = useCallback((data) => {
    setCurrentPo(data);
    BillsRef?.current?.open();
  }, []);
  const viewpo = useCallback((data) => {
    setCurrentPo(data);
    ViewPORef?.current?.open();
  }, []);
  const [page, setPage] = useState(1);
  const [paginate, setPaginate] = useState({});
  const [period, setPeriod] = useState({
    from: from,
    to: to,
  });
  const [filters, setFilters] = useState([
    { key: "p.name", value: "", label: "Project Name", operator: "like" },
    { key: "v.name", value: "", label: "Vendor Name", operator: "like" },
    { key: "u.user", value: "", label: "User Name", operator: "like" },
    { key: "po.id", value: "", label: "PO Number", operator: "=" },
    { key: "po.status", value: "", label: "Status", operator: "=" },
    { key: "il.item", value: "", label: "Item Name", operator: "like" },
  ]);
  const [state, setState] = useState([]);
  const { data, isLoading, isError } = useGetPOsQuery();
  //   const getData = async () => {
  //     try {
  //       const res = await API.get("PO", {
  //         params: {
  //           filters,
  //           filters,
  //           from: period?.from,
  //           to: period?.to,
  //           page: page,
  //         },
  //       });
  //       console.log("PO components Data", res.data);
  //       if (res.status == 200) {
  //         setPaginate(res.data);
  //         setState(res.data.data);
  //       }
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  //   useEffect(() => {
  //     console.log(filters);
  //   }, [filters]);
  useEffect(() => {
    console.log(data);
  }, [data]);
  return (
    <>
      <CreatePO ref={CreateRef} />
      <ViewPO ref={ViewPORef} PoId={currentPo?.POID} />
      <Bills ref={BillsRef} currentPo={currentPo || null} />
      <PageLayout
        create={
          <IconButton
            sx={{ border: 1, borderColor: blue[800] }}
            onClick={() => CreateRef?.current?.open()}
          >
            <Icon sx={{ color: blue[800] }}>add</Icon>
          </IconButton>
        }
        filters={filters}
        setFilters={setFilters}
        period={period}
        setPeriod={setPeriod}
        pagination={<Paginate {...paginate} page={page} setPage={setPage} />}
      >
        <Body data={data} />
      </PageLayout>
    </>
  );
};

export default Index;

const Paginate = (props) => {
  return (
    <Pagination
      count={props.last_page}
      page={props.page}
      onChange={(e, p) => props.setPage(p)}
      size="small"
    />
  );
};

const Body = React.memo(({ data }) => {
  return (
    <List dense>
      {data?.map((v, i) => (
        <ListItemButton divider>
          <ListItemText
            primary={<Bold>{v?.display_name}</Bold>}
            secondary={
              <>
                <Body2>{`PO : ${_.round(v?.ATtotalPO, 0)}`}</Body2>
                <Body2>{`Billed : ${_.round(v?.BilledAmount, 0)}`}</Body2>
              </>
            }
          />
        </ListItemButton>
      ))}
    </List>
    // <TableContainer sx={{ maxHeight: "90vh" }} component={Paper} elevation={3}>
    //   <Table stickyHeader size="small">
    //     <TableHead>
    //       <TableRow>
    //         <TableCell>PO/User</TableCell>
    //         <TableCell>Project/Vendor</TableCell>
    //         <TableCell>Amounts</TableCell>
    //       </TableRow>
    //     </TableHead>
    //     <TableBody>
    //       {data?.map((v, i) => (
    //         <TableRow key={v.POID}>
    //           <TableCell>
    //             <Button
    //               size="small"
    //               variant="outlined"
    //               onClick={() => viewpo(v)}
    //             >
    //               {"PO : " + v.POID}
    //             </Button>
    //             <IconText name="User" text={v.user_name} />
    //             <IconText name="status" text={v.status} />
    //           </TableCell>
    //           <TableCell>
    //             <IconText name="project" text={v.project_name} />
    //             <IconText name="Vendor" text={v.vendor_name} />
    //             <IconText name="Desp" text={v.podesp} />
    //           </TableCell>
    //           <TableCell>
    //             <IconText name="Total" text={Number(v.PoAmount)} />
    //             <Button
    //               onClick={() => showBills(v)}
    //               size="small"
    //               variant="outlined"
    //             >
    //               {"Supplied " + _.sumBy(v.bills, (b) => Number(b.Amount))}
    //             </Button>
    //           </TableCell>
    //         </TableRow>
    //       ))}
    //     </TableBody>
    //   </Table>
    // </TableContainer>
  );
});

const IconText = ({ name, text }) => (
  <Grid container alignItems={"center"} spacing={1}>
    <Grid item>
      <Typography variant="caption">{name}</Typography>
    </Grid>
    <Grid item>
      <Typography variant="body2">{text}</Typography>
    </Grid>
  </Grid>
);

const Bills = forwardRef(({ currentPo }, ref) => {
  const { showBill } = useContext(App);
  const { POID, bills } = currentPo;
  const [open, setOpen] = useState(false);
  useImperativeHandle(ref, () => ({
    open: () => setOpen(true),
    close: () => setOpen(false),
  }));
  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>PO: {POID}</DialogTitle>
      <DialogContent>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Bill No.</TableCell>
              <TableCell>Bill Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bills?.map((bill) => (
              <TableRow key={bill.BillNo}>
                <TableCell>
                  <Button onClick={() => showBill(bill?.BillNo)}>
                    {bill?.BillNo}
                  </Button>
                </TableCell>
                <TableCell>{bill?.Amount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  );
});
