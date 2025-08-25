import {
  Box,
  Menu,
  TextField,
  Button,
  Stack,
  Typography,
  Icon,
  ButtonGroup,
  IconButton,
} from "@mui/material";
import { blue } from "@mui/material/colors";
import _, { filter } from "lodash";
import React, { forwardRef, useEffect, useState } from "react";

const FilterForm = forwardRef(({ filters, setFilters }, ref) => {
  const [currentFilters, setCurrent] = useState();
  const [open, setOpen] = useState(null);
  const handleChange = (e, index) => {
    const { name, value } = e.target;
    setCurrent((prv) => {
      return prv.map((v, i) => (i === index ? { ...v, value: value } : v));
    });
  };
  const handleClear = () => {
    setOpen(false);
    setFilters(currentFilters.map((filter) => ({ ...filter, value: "" })));
  };
  useEffect(() => {
    setCurrent(filters);
  }, [filters]);
  useEffect(() => {
    console.log(currentFilters);
  }, [currentFilters]);
  return (
    <Box>
      <IconButton
        onClick={(e) => setOpen(e.currentTarget)}
        sx={{ border: 1, borderColor: blue[600] }}
      >
        <Icon sx={{ color: blue[600] }}>filter_alt</Icon>
      </IconButton>
      <Menu
        sx={{ mt: 0.5 }}
        open={Boolean(open)}
        anchorEl={open}
        onClose={() => setOpen(null)}
      >
        <Stack direction={"column"} sx={{ p: 2 }}>
          {currentFilters?.map(({ label, name, value }, index) => (
            <TextField
              key={name}
              name={name}
              value={value}
              onChange={(e) => handleChange(e, index)}
              size="small"
              label={label}
              margin="dense"
            />
          ))}
        </Stack>
        <ButtonGroup fullWidth variant="outlined" sx={{ px: 1 }}>
          <Button variant="outlined" onClick={handleClear}>
            Clear
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              setOpen(null);
              setFilters(currentFilters);
            }}
          >
            Submit
          </Button>
        </ButtonGroup>
      </Menu>
    </Box>
  );
});

export default FilterForm;
