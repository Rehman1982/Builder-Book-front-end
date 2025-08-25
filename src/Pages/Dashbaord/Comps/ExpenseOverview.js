import * as React from "react";
import { BarChart, BarPlot } from "@mui/x-charts/BarChart";
import { LinePlot, MarkPlot } from "@mui/x-charts/LineChart";
import {
  Autocomplete,
  Box,
  Divider,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { blue, green, grey, orange, red } from "@mui/material/colors";
import { ChartContainer } from "@mui/x-charts/ChartContainer";
import { useExpenseOverviewQuery } from "../../../features/dashboard/dashApi";
import dayjs from "dayjs";
import MyLoader from "../../helpers/MyLoader";

// const Data = [
//   4000, 3000, 2000, 2780, 1890, 2390, 3490, 4000, 3000, 2000, 2780, 1890, 2390,
//   3490,
// ];
const Months = [
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

export default function ExpenseOverview() {
  const currentYear = dayjs().year();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);
  const [state, setState] = React.useState({ labels: "", data: "" });
  const [selectedYear, setSelectedYear] = React.useState(currentYear);
  const { data, isLoading, isSuccess, isError, error } =
    useExpenseOverviewQuery({ year: selectedYear });
  React.useEffect(() => {
    if (isSuccess) {
      if (data.length > 0) {
        const Labels = data?.map((item) => Months[item.month - 1]);
        const Data = data?.map((item) => Number(item.cogs));
        setState({ labels: Labels, data: Data });
      }
      console.log("expense data", data, selectedYear);
    }
  }, [data]);
  return (
    <Box
      component={Paper}
      elevation={3}
      sx={{ p: 2, mt: 2, borderRadius: 3, width: "100%" }}
    >
      <Stack
        direction={"row"}
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        <Typography variant="body1" fontWeight={550} color={grey[600]}>
          Expense Overview
        </Typography>
        <TextField
          name="Year"
          label="Year"
          size="small"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          select
        >
          {years.map((year) => (
            <MenuItem key={year} value={year}>
              {year}
            </MenuItem>
          ))}
        </TextField>
      </Stack>
      <Divider sx={{ my: 1.5 }} variant="fullWidth" />
      {isLoading && <MyLoader />}
      {state.labels && state.data && (
        <BarChart
          barLabel="value"
          height={400}
          series={[
            {
              data: state?.data,
              color: orange[300],
            },
          ]}
          xAxis={[{ data: state?.labels, scaleType: "band" }]}
          yAxis={[{ width: 10 }]}
        />
      )}
    </Box>
  );
}
