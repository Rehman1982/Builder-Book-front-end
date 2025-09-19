import {
  BottomNavigation,
  BottomNavigationAction,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { blue, grey, orange } from "@mui/material/colors";
import _ from "lodash";
import React, { useEffect, useMemo, useState } from "react";
import MyLoader from "./MyLoader";
import { useDispatch, useSelector } from "react-redux";
import {
  closeDetails,
  openMoreDetails,
  setGroupDetailReport,
} from "../../features/reports/reportSlice";
import { useReportMultyQuery } from "../../features/reports/reportApi";
import MoreDetails from "./MoreDetails";
import useIsMobile from "../../hooks/useIsMobile";
import { Body1, Bold } from "./MyTypo";
import { Body2 } from "./UiComponents";

const Details = (props, ref) => {
  const isMobile = useIsMobile();
  const dispatch = useDispatch();
  // gloabal States
  const { endpoint, period, groupby } = useSelector(
    (state) => state.reportSlice
  );
  const { showComp, conditions, groupedOn, title } = useSelector(
    (state) => state.reportSlice.detailReport
  );
  // local State
  const [str, setStr] = useState("");

  // API Calls
  const {
    data = [],
    isLoading,
    isError,
    error,
  } = useReportMultyQuery(
    {
      url: endpoint,
      conditions: conditions,
      period: period,
      groupby: groupedOn,
    },
    { skip: !showComp }
  );
  const state = useMemo(() => {
    if (isLoading) return [];
    if (isError) return [];
    if (str) {
      return data.filter((itm) =>
        itm.display_name.toLowerCase().includes(str.toLowerCase())
      );
    }
    return data;
  }, [data, str]);
  useEffect(() => {
    // console.log("Details of Report Data", data);
    // console.log("Details isLoading", isLoading);
    console.log("Details Component Data", state);
  }, [state]);
  return (
    <Dialog
      open={showComp}
      onClose={() => {
        dispatch(closeDetails());
      }}
      fullWidth
      maxWidth="md"
    >
      <MoreDetails />
      <DialogTitle>
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
          spacing={2}
        >
          <Typography flexGrow={1} color={blue[900]} variant="body1">
            {title || ""}
          </Typography>
          <TextField
            value={str || ""}
            onChange={(e) => setStr(e.target.value)}
            placeholder="Search..."
            size="small"
            sx={{ width: "50%" }}
          />
        </Stack>
        <ButtonGroup fullWidth sx={{ my: 1 }}>
          {groupby.map((v) => (
            <Button
              size="small"
              sx={{
                bgcolor: v.value === groupedOn ? blue[500] : "",
                color: v.value === groupedOn ? grey[50] : "",
              }}
              key={Math.random()}
              onClick={() => dispatch(setGroupDetailReport(v.value))}
            >
              {v.name}
            </Button>
          ))}
        </ButtonGroup>
        {!isMobile && (
          <Grid
            component={Paper}
            container
            bgcolor={grey[200]}
            p={0.5}
            alignItems={"center"}
            borderRadius={2}
          >
            <Grid item xs={6}></Grid>
            <Grid
              item
              xs={2}
              textAlign={"right"}
              component={Typography}
              variant="subtitle1"
            >
              Debit
            </Grid>
            <Grid
              item
              xs={2}
              textAlign={"right"}
              component={Typography}
              variant="subtitle1"
            >
              Credit
            </Grid>
            <Grid
              item
              pr={1}
              xs={2}
              textAlign={"right"}
              component={Typography}
              variant="subtitle1"
            >
              Net
            </Grid>
          </Grid>
        )}
      </DialogTitle>
      <DialogContent sx={{ minHeight: "50vh" }}>
        {isLoading ? (
          <MyLoader />
        ) : (
          <List dense>
            {state?.map((item, index) =>
              isMobile ? (
                <ListItemButton
                  dense
                  divider
                  onClick={() => {
                    dispatch(
                      openMoreDetails({
                        title: item.display_name || "",
                        condition: {
                          key: groupedOn,
                          value: item.id,
                        },
                      })
                    );
                  }}
                >
                  <ListItemText
                    primary={item.display_name || "No Name"}
                    secondary={
                      <>
                        {item?.debit > 0 && "Dr: " + item?.debit}
                        {item?.credit > 0 && "Cr: " + item?.credit}
                      </>
                    }
                  />
                </ListItemButton>
              ) : (
                <Grid
                  container
                  borderBottom={1}
                  borderColor={"divider"}
                  p={1}
                  key={Math.random()}
                >
                  <Grid
                    item
                    xs={6}
                    sx={{ cursor: "pointer" }}
                    onClick={() => {
                      dispatch(
                        openMoreDetails({
                          title: item.display_name || "",
                          condition: {
                            key: groupedOn,
                            value: item.id,
                          },
                        })
                      );
                    }}
                  >
                    <Typography variant="body2">
                      {item.display_name || "No Name"}
                    </Typography>
                  </Grid>
                  <Grid item xs={2} textAlign={"right"}>
                    <Typography variant="body2">{item.debit}</Typography>
                  </Grid>
                  <Grid item xs={2} textAlign={"right"}>
                    <Typography variant="body2">{item.credit}</Typography>
                  </Grid>
                  <Grid item xs={2} textAlign={"right"}>
                    <Typography variant="body2">{item.net}</Typography>
                  </Grid>
                </Grid>
              )
            )}
          </List>
        )}
      </DialogContent>
      <DialogTitle>
        {isMobile ? (
          <Card variant="outlined" raised sx={{ bgcolor: orange[100] }}>
            <CardContent>
              <Stack
                direction={"row"}
                alignItems={"center"}
                justifyContent={"space-between"}
              >
                <Body2 fontWeight={600}>Total</Body2>
                <Body2 fontWeight={600}>
                  {_.sumBy(state, (item) => Number(item.net))}
                </Body2>
              </Stack>
            </CardContent>
          </Card>
        ) : (
          <Grid
            component={Paper}
            container
            bgcolor={grey[200]}
            p={0.5}
            alignItems={"center"}
            borderRadius={2}
          >
            <Grid
              item
              textAlign={"center"}
              xs={6}
              component={Typography}
              variant="subtitle1"
              fontWeight={600}
            >
              Total
            </Grid>
            <Grid
              item
              xs={2}
              textAlign={"right"}
              component={Typography}
              variant="subtitle1"
              fontWeight={600}
            >
              {_.sumBy(state, (item) => Number(item.debit))}
            </Grid>
            <Grid
              item
              xs={2}
              textAlign={"right"}
              component={Typography}
              variant="subtitle1"
              fontWeight={600}
            >
              {_.sumBy(state, (item) => Number(item.credit))}
            </Grid>
            <Grid
              item
              xs={2}
              textAlign={"right"}
              component={Typography}
              variant="body1"
              fontWeight={600}
            >
              {_.sumBy(state, (item) => Number(item.net))}
            </Grid>
          </Grid>
        )}
      </DialogTitle>
    </Dialog>
  );
};
export default React.memo(Details);
