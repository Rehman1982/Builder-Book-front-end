import { Settings } from "@mui/icons-material";
import {
  Box,
  Button,
  Divider,
  Grid,
  Icon,
  Stack,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import { useState } from "react";
// import LargeButton from "../helpers/LargeButton";
import LargeButton from "../ui/LargeButton";
import _ from "lodash";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { blue, grey } from "@mui/material/colors";
import Breadcrumbss from "../../Pages/helpers/Breadcrumbss";
import API from "../../api/axiosApi";
// import Breadcrumbss from "../helpers/Breadcrumbss";
const MenuLoader = () => {
  const [title, setTitle] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
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
      console.log("menuLoader Called");
      setMenuItems(result.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    // console.log("Locaaaaaaaaaation", location);
    setMenuItems([]);
    if (location?.state?.parent_id) {
      setTitle(location.state?.title);
      getData(location.state.parent_id);
    }
  }, [location]);
  return (
    <Box p={2}>
      <PageTitle
        setMenuItems={setMenuItems}
        navigate={navigate}
        location={location}
      />
      {menuItems.length > 0 && (
        <>
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
                {/* <Divider sx={{ mt: 2 }} /> */}
              </Box>
            )
          )}
        </>
      )}
      <Outlet />
    </Box>
  );
};
export default MenuLoader;

const PageTitle = ({ setMenuItems, navigate, location }) => {
  return (
    <>
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        alignItems="center"
        spacing={2}
        mb={2}
      >
        <Stack direction={"row"} alignItems="center" spacing={1}>
          <Icon
            onClick={() => {
              setMenuItems([]);
              navigate(-1);
            }}
            sx={{
              color: blue[800],
              cursor: "pointer",
              transition: "all 0.3s",
              ":hover": { transform: "scale(1.3)" },
            }}
          >
            arrow_back_ios
          </Icon>
          <Typography variant="h5" gutterBottom>
            {location?.state?.title || ""}
          </Typography>
        </Stack>
        {/* <Breadcrumbss /> need to refactor */}
      </Stack>
      <Divider sx={{ mb: 2 }} />
    </>
  );
};
