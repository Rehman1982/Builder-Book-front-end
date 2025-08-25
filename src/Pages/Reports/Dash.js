import { Settings } from "@mui/icons-material";
import { Box, Divider, Grid, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { useState } from "react";
import LargeButton from "../helpers/LargeButton";
import _ from "lodash";
import axios from "axios";
import { Outlet, useLocation } from "react-router-dom";
import Breadcrumbss from "../helpers/Breadcrumbss";
import API from "../../api/axiosApi";

const Dash = () => {
  const [title, setTitle] = useState("");
  const location = useLocation();
  const [menuItems, setMenuItems] = useState([]);
  const getData = async (parent_id) => {
    try {
      const result = await API.get("menu", {
        params: {
          for: "data",
          type: "children",
          parent_id: parent_id,
        },
      });
      // console.log(result);
      setMenuItems(result.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (location?.state?.parent_id) {
      setTitle(location.state?.title);
      getData(location.state.parent_id);
      // console.log("requted state", location?.state);
    }
  }, [location]);
  return (
    <Box p={2}>
      {/* <Breadcrumbss items={menuItems} /> */}
      {menuItems.length > 0 && (
        <>
          <Typography variant="h5" gutterBottom>
            {title}
          </Typography>
          <Divider sx={{ my: 2 }} />
          {Object.entries(_.groupBy(menuItems, "heading")).map(
            ([heading, data]) => (
              <Box key={heading}>
                <Grid container columns={12} spacing={2}>
                  {data?.map((v, i) => (
                    <LargeButton
                      key={v.id}
                      icon={v.icon}
                      text={v.title}
                      sizes={{ lg: 4, xs: 12 }}
                      path={v.href}
                      state={{
                        parent_id: v.id,
                        title: v.title,
                      }}
                    />
                  ))}
                </Grid>
                <Divider sx={{ mt: 2 }} />
              </Box>
            )
          )}
        </>
      )}
      <Outlet />
    </Box>
  );
};
export default Dash;
