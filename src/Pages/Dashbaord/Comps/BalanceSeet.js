import * as React from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Paper,
  Typography,
} from "@mui/material";
import { blue, green, grey, orange, red, yellow } from "@mui/material/colors";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { useVitalsQuery } from "../../../features/dashboard/dashApi";
import dayjs from "dayjs";

// const Data = [1000, 2000, 3000, 4000];
// const Labels = ["Assets", "Payables", "Capital", "Earnings(Retained)"];

export default function BalanceSheet() {
  const [state, setState] = useState({});
  const [selectedYear, setSelectedYear] = useState(dayjs().year());
  const { data, isLoading, isSuccess, isError, error } = useVitalsQuery({
    year: selectedYear,
  });
  useEffect(() => {
    console.log(isSuccess);
    isSuccess && setState(data);
  }, [data]);
  return (
    <Box
      component={Paper}
      elevation={3}
      sx={{
        p: 2,
        mt: 2,
        borderRadius: 3,
        width: "40%",
      }}
    >
      <Typography variant="body1" fontWeight={550} color={grey[600]}>
        Vitals
      </Typography>
      <Divider sx={{ my: 1.5 }} variant="fullWidth" />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: 400,
        }}
      >
        {state && (
          <PieChart
            height={300}
            series={[
              {
                data: [
                  {
                    id: 0,
                    value: state?.Assets,
                    label: "Assets",
                    color: green[600],
                  },
                  {
                    id: 1,
                    value: state?.Liability,
                    label: "Payables",
                    color: blue[600],
                  },
                  {
                    id: 2,
                    value: Number(state?.Capital) + Number(state?.Earning),
                    label: "Capital",
                    color: orange[600],
                  },
                ],
                innerRadius: 50,
                paddingAngle: 2,
                cornerRadius: 5,
                arcLabel: (params) => params.label || "",
                arcLabelMinAngle: 10,
              },
            ]}
            slotProps={{ legend: { hidden: true } }}
            // hideLegend={true}
          />
        )}
      </Box>
    </Box>
  );
}
