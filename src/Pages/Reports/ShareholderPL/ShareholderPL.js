import {
  Box,
  Card,
  CardContent,
  Collapse,
  Divider,
  Grid,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { orange, red } from "@mui/material/colors";
import axios from "axios";
import React, { useEffect, useState } from "react";
import API from "../../../api/axiosApi";

const ShareholderPL = () => {
  const [state, setState] = useState([]);
  const getData = async () => {
    try {
      const result = await API.get("reports/shareholderpl", {
        params: {
          type: "data",
        },
      });
      if (result.status == 200) {
        console.log(result.data);
        setState(result.data);
      }
    } catch (error) {
      console.log(error.response);
    }
  };
  useEffect(() => {
    getData();
  }, []);
  return (
    <Box p={3}>
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Typography variant="h5" gutterBottom>
          Shareholder Profit & Loss by Project
        </Typography>
      </Stack>
      <Divider sx={{ my: 2 }} />
      <Stack direction={"row"} alignItems={"flex-start"}>
        <Box width={"30%"} bgcolor={red[500]}>
          <Grid container>
            <Grid item xs={8} textAlign={"center"}>
              <Box border={1}>
                <Typography noWrap>Project</Typography>
              </Box>
            </Grid>
            <Grid item xs={4} textAlign={"center"}>
              <Box border={1}>
                <Typography noWrap>Income</Typography>
              </Box>
            </Grid>
          </Grid>
          {state?.map((item, index) => (
            <Grid container>
              <Grid item xs={8}>
                <Box border={1}>
                  <Typography noWrap>{item.name || "NO-Name"}</Typography>
                </Box>
              </Grid>
              <Grid item xs={4} textAlign={"right"}>
                <Box border={1}>
                  <Typography noWrap>{item.Income || "NO-Name"}</Typography>
                </Box>
              </Grid>
            </Grid>
          ))}
        </Box>
        <Box maxWidth={"70%"} bgcolor={orange[300]} overflow={"auto"}>
          <Grid container columns={33} wrap="nowrap">
            {Array.from({ length: 33 }).map((_, index) => (
              <Grid item border={1} px={1}>
                Name
              </Grid>
            ))}
          </Grid>
          {state?.map((item, i) => (
            <Grid container columns={33} wrap="nowrap">
              {Array.from({ length: 33 }).map((_, index) => (
                <Grid item border={1} px={1}>
                  3000000
                </Grid>
              ))}
            </Grid>
          ))}
        </Box>
        {/* <Grid
                    container
                    borderBottom={1}
                    borderColor={"divider"}
                    p={2}
                    component={Paper}
                    elevation={3}
                >
                    <Grid item xs={4}>
                        {state?.map((item, index) => (
                            <Stack direction={"row"} p={1}>
                                <Box>
                                    <Typography noWrap>{item.name}</Typography>
                                </Box>
                                <Box>
                                    <Typography>{item.Income}</Typography>
                                </Box>
                            </Stack>
                        ))}
                    </Grid>
                    <Grid item xs={8} overflow={"auto"}>
                        {state?.map((item, index) => (
                            <Stack direction={"row"}>
                                {Array.from({ length: 33 }).map((_, index) => (
                                    <Box border={1} p={1} mx={1}>
                                        {index}
                                    </Box>
                                ))}
                            </Stack>
                        ))}
                    </Grid>
                </Grid> */}
      </Stack>
    </Box>
  );
};
export default ShareholderPL;

// const ItemRow = ({ item }) => {
//     const [showCard, setShowCard] = useState(false);
//     return (
//         <Grid container>
//             <Grid item xs={2}></Grid>
//             <Grid item xs={10}></Grid>
//         </Grid>
//         <Stack direction={"row"} alignItems={"center"}>
//             <Box mr={1}>Project and income</Box>
//             <Stack direction={"row"} sx={{ overflow: "auto" }}>
//                 {Array.from({ length: 32 }).map((_, index) => (
//                     <Box border={1} p={1}>
//                         2000000
//                     </Box>
//                 ))}
//             </Stack>
//         </Stack>
//         // <Grid
//         //     container
//         //     alignItems={"center"}
//         //     borderBottom={1}
//         //     borderColor={"divider"}
//         //     p={2}
//         // >
//         //     <Grid
//         //         item
//         //         xs={2}
//         //         sx={{ cursor: "pointer" }}
//         //         onClick={() => setShowCard(!showCard)}
//         //     >
//         //         <Typography variant="body1" fontWeight={700} gutterBottom>
//         //             {item.name}
//         //         </Typography>
//         //     </Grid>
//         //     <Grid item xs={1} textAlign={"right"}>
//         //         {item.Income}
//         //     </Grid>
//         //     {/* <Grid item xs={12} component={Collapse} in={showCard}>
//         //         <Shares shares={item.share} />
//         //     </Grid> */}
//         // </Grid>
//     );
// };

const Shares = ({ shares }) => {
  return (
    <Card>
      <CardContent>
        <Table size="small">
          {/* <TableHead>
                        <TableRow>
                            <TableCell>Shareholder Name</TableCell>
                            <TableCell>Share in %</TableCell>
                            <TableCell>Amount In RS</TableCell>
                        </TableRow>
                    </TableHead> */}
          <TableBody>
            {shares?.map((sh, i) => (
              <TableRow>
                <TableCell>
                  <Typography variant="body1">{sh?.shareholdername}</Typography>
                  {sh?.account_name}
                </TableCell>
                <TableCell>
                  <Typography variant="body1">{sh?.share}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body1">{sh?.amount}</Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
    // <Grid container alignItems={"center"}>
    //     <Grid item xs={6}>
    //         {shares?.shareholdername}
    //         {shares?.account_name}
    //     </Grid>
    //     <Grid item xs={2}>
    //         {shares?.share}
    //     </Grid>
    //     <Grid item xs={4}>
    //         {shares?.amount}
    //     </Grid>
    // </Grid>
  );
};
