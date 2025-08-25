import { Stack } from "@mui/material";
import React from "react";
import Card from "./Card";
import { grey } from "@mui/material/colors";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import {
  useCardsMutation,
  useCardsQuery,
} from "../../../features/dashboard/dashApi";

const Cards = () => {
  const [state, setState] = useState([]);
  const { data, isLoading, isSuccess, isError, error } = useCardsQuery();
  useEffect(() => {
    // getVitals();
    if (isSuccess) {
      setState(data);
    }
  }, [data]);
  return (
    <Stack
      direction={"row"}
      spacing={2}
      alignItems={"center"}
      justifyContent={"space-between"}
    >
      {state?.map((v, i) => (
        <Card key={v.title} title={v.title} icon="" data={v.total} />
      ))}
    </Stack>
  );
};

export default Cards;
