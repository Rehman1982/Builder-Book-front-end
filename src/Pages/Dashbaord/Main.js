import {
  Box,
  Divider,
  FormControlLabel,
  FormLabel,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
import React, { Suspense, lazy } from "react";
import Card from "./Comps/Card";
import { grey } from "@mui/material/colors";
import IncomeOverview from "./Comps/IncomChart";
import BalanceSheet from "./Comps/BalanceSeet";
import ExpenseOverview from "./Comps/ExpenseOverview";
import { useContext } from "react";
import AuthContext from "../../context/AuthContext";
import Cards from "./Comps/Cards";

const Main = () => {
  const { mode, setMode } = useContext(AuthContext);
  return (
    <Box>
      <Stack
        direction={"row"}
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        <Typography
          color={grey[600]}
          variant="h5"
          component={"h1"}
          fontWeight={800}
          gutterBottom
        >
          Dashbaord
        </Typography>
        <FormControlLabel
          control={
            <Switch
              checked={mode == "dark" ? true : false}
              onChange={(e, c) => {
                const update = c ? "dark" : "light";
                setMode(update);
              }}
            />
          }
          label={<Typography variant="subtitle2">Dark Mode</Typography>}
          labelPlacement="end"
        />
      </Stack>
      <Divider variant="fullWidth" sx={{ my: 1.5 }} />
      <Cards />
      <Stack
        direction={"row"}
        spacing={2}
        mt={2}
        justifyContent={"space-between"}
      >
        <IncomeOverview />
        <BalanceSheet />
      </Stack>
      <ExpenseOverview />
    </Box>
  );
};

export default Main;
