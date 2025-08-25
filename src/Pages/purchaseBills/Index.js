import React from "react";
import PageLayout from "../../components/ui/PageLayout";
import { Contents } from "./Contents";
import { Icon, IconButton, Paper } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  createPB,
  setPeriod,
} from "../../features/purcasheBill/purchaseBillSlice";
import { CURD } from "./CURD";

const Index = () => {
  const dispatch = useDispatch();
  // gloabl State
  const period = useSelector((S) => S.purchaseBillSlice.period);
  return (
    <>
      <CURD />
      <Paper sx={{ p: 2 }}>
        <PageLayout
          create={
            <IconButton onClick={() => dispatch(createPB())}>
              <Icon>add</Icon>
            </IconButton>
          }
          period={period}
          setPeriod={(v) => dispatch(setPeriod(v))}
        >
          <Contents />
        </PageLayout>
      </Paper>
    </>
  );
};

export default Index;
