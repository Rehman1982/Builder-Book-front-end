import { Pagination } from "@mui/material";
import React, { useState } from "react";

export const Paginate = ({ pages, page = 1, setPage }) => {
  // const [page, setPage] = useState(1);
  return (
    <Pagination
      size="small"
      variant="outlined"
      count={pages}
      page={page}
      onChange={(e, v) => setPage(v)}
      siblingCount={1}
      boundaryCount={0}
      color="primary"
    />
  );
};
