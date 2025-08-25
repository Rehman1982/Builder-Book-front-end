import {
  Autocomplete,
  Button,
  Dialog,
  DialogContent,
  Stack,
  TextField,
} from "@mui/material";

import React, { useMemo, useState } from "react";
import { useEffect } from "react";

import _, { find, set } from "lodash";

import { useDispatch, useSelector } from "react-redux";
import { setConditions } from "../../features/reports/reportSlice";
import { useReportPartialsQuery } from "../../features/reports/reportApi";

const FilterForm = () => {
  const dispatch = useDispatch();
  // GlobalStates
  const { conditions, partials } = useSelector((s) => s.reportSlice);
  // RTK API Call
  const { businesses, status, projects } = partials;
  // Local State
  const [show, setShow] = React.useState(false);

  const [conds, setConds] = React.useState([]);

  useEffect(() => {
    setConds(conditions);
  }, [conditions]);

  const filteredProjects = useMemo(() => {
    const bus = _.get(_.find(conds, { key: "link" }), "value");
    const status = _.get(_.find(conds, { key: "p.status" }), "value");
    return projects?.filter((pr) => {
      if (bus !== null && status !== null) {
        if (pr.link === bus && pr.status === status) return true;
      }
      if (status !== null && bus === null) {
        if (pr.status === status) return true;
      }
      if (bus !== null && status === null) {
        if (pr.link === bus) return true;
      }
    });
  }, [conds]);
  return (
    <>
      <Button onClick={() => setShow(true)}>Filter Report</Button>
      <Dialog open={show} onClose={() => setShow(false)} fullWidth>
        <DialogContent>
          <Stack>
            <Autocomplete
              options={businesses || []}
              getOptionLabel={(opt) => opt || "All"}
              value={conds?.find((cd) => cd?.key === "link")?.value || ""}
              onChange={(e, v) => {
                setConds((prv) => {
                  if (prv.length > 0) {
                    return prv.map((obj) =>
                      obj.key === "link" ? { ...obj, value: v } : obj
                    );
                  } else {
                    return [{ key: "link", value: v }];
                  }
                });
              }}
              renderInput={(params) => (
                <TextField {...params} label="Business Type" />
              )}
            />
            <Autocomplete
              options={status || []}
              getOptionLabel={(opt) => opt.status || ""}
              value={{
                status:
                  conds?.find((cd) => cd?.key === "p.status")?.value || null,
              }}
              renderInput={(params) => (
                <TextField {...params} label="Project Status" margin="dense" />
              )}
              onChange={(e, v) => {
                setConds((prv) => {
                  if (prv.length > 0) {
                    return prv.map((obj) =>
                      obj.key === "p.status" ? { ...obj, value: v.status } : obj
                    );
                  } else {
                    return [{ key: "p.status", value: v.status }];
                  }
                });
              }}
            />
            <Autocomplete
              options={filteredProjects || []}
              getOptionLabel={(opt) => opt?.name || ""}
              value={
                filteredProjects?.find(
                  (d) =>
                    d?.id ===
                    _.get(_.find(conds, { key: "project_id" }), "value")
                ) || null
              }
              onChange={(e, v) => {
                setConds((prv) => {
                  return prv.map((obj) =>
                    obj.key === "project_id" ? { ...obj, value: v.id } : obj
                  );
                });
              }}
              renderInput={(params) => (
                <TextField {...params} margin="dense" label="Projects" />
              )}
            />
          </Stack>
          <Button
            variant="contained"
            onClick={() => dispatch(setConditions(conds))}
          >
            Apply Filter
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
};
export default FilterForm;
