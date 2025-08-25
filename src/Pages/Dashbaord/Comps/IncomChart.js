import * as React from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import { blue, green, grey, red } from "@mui/material/colors";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import _ from "lodash";
import MyLoader from "../../helpers/MyLoader";
import dayjs from "dayjs";
import { usePlOverviewQuery } from "../../../features/dashboard/dashApi";

const Data = [
  4000, 3000, 2000, 2780, 1890, 2390, 3490, 4000, 3000, 2000, 2780, 1890, 2390,
  3490,
];
const months = [
  "Jan",
  "Feb",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export default function IncomeOverview() {
  const [state, setState] = useState([]);
  const [selectedYear, setSelectedYear] = useState(dayjs().year());
  const { data, isLoading, isSuccess, isError, error } = usePlOverviewQuery({
    year: selectedYear,
  });
  useEffect(() => {
    if (isSuccess) {
      console.log("ApI Called", data, "success", isSuccess);
      setState(data);
    }
  }, [data, selectedYear]);
  return (
    <Box
      component={Paper}
      elevation={3}
      sx={{ p: 2, mt: 2, borderRadius: 3, width: "70%" }}
    >
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Typography variant="body1" fontWeight={550} color={grey[600]}>
          Income / Expense Overview
        </Typography>
        <YearSelect selected={selectedYear} changeYear={setSelectedYear} />
      </Stack>
      <Divider sx={{ my: 1.5 }} variant="fullWidth" />
      {isLoading ? (
        <MyLoader />
      ) : (
        state?.length > 0 && (
          <BarChart
            height={400}
            series={[
              {
                id: 0,
                data: state?.map((v) => Number(v.income)),
                color: green[400],
                label: "Income",
              },
              {
                id: 1,
                data: state?.map((v) => Number(v.cogs)),
                color: red[300],
                label: "Expense",
              },
            ]}
            xAxis={[
              {
                data: state.map((v) => months[v.month - 1]),
                scaleType: "band",
              },
            ]}
            yAxis={[{ width: 10 }]}
          />
        )
      )}
    </Box>
  );
}

const YearSelect = ({ selected, changeYear }) => {
  const currentYear = dayjs().year();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);
  return (
    <FormControl>
      <InputLabel>Year</InputLabel>
      <Select
        size="small"
        label="Year"
        value={selected}
        onChange={(e) => changeYear(e.target.value)}
      >
        {years.map((year) => (
          <MenuItem key={year} value={year}>
            {year}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
