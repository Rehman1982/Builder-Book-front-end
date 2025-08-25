// import {
//     Box,
//     Button,
//     Dialog,
//     DialogActions,
//     DialogContent,
//     Grid,
//     List,
//     ListItem,
//     ListItemButton,
//     ListItemText,
//     Paper,
//     Stack,
// } from "@mui/material";
// import React, { forwardRef, useEffect } from "react";
// import DatePicker from "../../helpers/DatePicker";
// import dayjs from "dayjs";

// const PeriodSelector = forwardRef((props, ref) => {
//     const [open, setOpen] = React.useState(false);
//     const [currentperiod, setCurrentPeriod] = React.useState({
//         from: props.periodFrom || null,
//         to: props.periodTo || null,
//     });
//     const number_of_columns = props.periodFrom && props.periodTo ? 3 : 2;
//     const [periods, setPeriods] = React.useState([
//         { name: "Current Fiscal year", slug: "current_fiscal_year", id: 1 },
//         { name: "Last Fiscal year", slug: "last_fiscal_year", id: 2 },
//         {
//             name: "Current Financial year",
//             slug: "current_financial_year",
//             id: 3,
//         },
//         { name: "Last Financial year", slug: "last_financial_year", id: 4 },
//         { name: "Current Month", slug: "current_month", id: 6 },
//         { name: "To Day", slug: "to_day", id: 7 },
//     ]);
//     const handleChange = (slug) => {
//         if (slug == "current_fiscal_year") {
//             setCurrentPeriod({
//                 from: dayjs().startOf("year").format("YYYY-MM-DD"),
//                 to: dayjs().endOf("year").format("YYYY-MM-DD"),
//             });
//         }
//         if (slug == "last_fiscal_year") {
//             setCurrentPeriod({
//                 from: dayjs()
//                     .subtract(1, "year")
//                     .startOf("year")
//                     .format("YYYY-MM-DD"),
//                 to: dayjs()
//                     .subtract(1, "year")
//                     .endOf("year")
//                     .format("YYYY-MM-DD"),
//             });
//         }
//         if (slug == "current_financial_year") {
//             const currentMonth = dayjs().month();
//             console.log(currentMonth);
//             if (currentMonth > 5) {
//                 setCurrentPeriod({
//                     from: dayjs(`${dayjs().year()}-07-01`).format("YYYY-MM-DD"),
//                     to: dayjs(`${dayjs().add(1, "year").year()}-06-30`).format(
//                         "YYYY-MM-DD"
//                     ),
//                 });
//             } else {
//                 setCurrentPeriod({
//                     from: dayjs(
//                         `${dayjs().subtract(1, "year").year()}-07-01`
//                     ).format("YYYY-MM-DD"),
//                     to: dayjs(`${dayjs().year()}-06-30`).format("YYYY-MM-DD"),
//                 });
//             }
//         }
//         if (slug == "last_financial_year") {
//             setCurrentPeriod({
//                 from: dayjs(
//                     `${dayjs().subtract(2, "year").year()}-07-01`
//                 ).format("YYYY-MM-DD"),
//                 to: dayjs(`${dayjs().subtract(1, "year").year()}-06-30`).format(
//                     "YYYY-MM-DD"
//                 ),
//             });
//         }
//         if (slug == "current_month") {
//             setCurrentPeriod({
//                 from: dayjs().startOf("month").format("YYYY-MM-DD"),
//                 to: dayjs().endOf("month").format("YYYY-MM-DD"),
//             });
//         }
//         if (slug == "to_day") {
//             setCurrentPeriod({
//                 from: dayjs().format("YYYY-MM-DD"),
//                 to: dayjs().format("YYYY-MM-DD"),
//             });
//         }
//     };
//     useEffect(() => {
//         console.log(currentperiod);
//     }, [currentperiod]);
//     switch (props.component) {
//         default:
//             return (
//                 <>
//                     <Button variant="outlined" onClick={() => setOpen(true)}>
//                         Date Filter
//                     </Button>
//                     <Dialog
//                         open={open}
//                         onClose={() => setOpen(false)}
//                         fullWidth
//                         maxWidth="md"
//                     >
//                         <DialogContent>
//                             <Box border={1} borderColor="divider" p={2}>
//                                 <Grid
//                                     container
//                                     justifyContent={"space-between"}
//                                     alignItems={"flex-start"}
//                                     spacing={2}
//                                     columns={number_of_columns}
//                                 >
//                                     <Grid item xs={1}>
//                                         <Box
//                                             component={Paper}
//                                             elevation={3}
//                                             sx={{
//                                                 maxHeight: 400,
//                                                 overflow: "auto",
//                                             }}
//                                         >
//                                             <List dense disablePadding>
//                                                 {periods.map((period) => (
//                                                     <ListItem
//                                                         key={period.slug}
//                                                         size="small"
//                                                         divider
//                                                         disablePadding
//                                                     >
//                                                         <ListItemButton
//                                                             onClick={() =>
//                                                                 handleChange(
//                                                                     period.slug
//                                                                 )
//                                                             }
//                                                         >
//                                                             <ListItemText
//                                                                 children={
//                                                                     period.name
//                                                                 }
//                                                             />
//                                                         </ListItemButton>
//                                                     </ListItem>
//                                                 ))}
//                                             </List>
//                                         </Box>
//                                     </Grid>
//                                     {props.periodFrom && (
//                                         <Grid item xs={1}>
//                                             <DatePicker
//                                                 date={currentperiod.from}
//                                                 setDate={(value) =>
//                                                     setCurrentPeriod({
//                                                         ...currentperiod,
//                                                         from: value,
//                                                     })
//                                                 }
//                                                 label={"From"}
//                                             />
//                                         </Grid>
//                                     )}
//                                     {props.periodTo && (
//                                         <Grid item xs={1}>
//                                             <DatePicker
//                                                 date={currentperiod.to}
//                                                 setDate={(value) =>
//                                                     setCurrentPeriod({
//                                                         ...currentperiod,
//                                                         to: value,
//                                                     })
//                                                 }
//                                                 label={"TO"}
//                                             />
//                                         </Grid>
//                                     )}
//                                     {props.periodUpto && (
//                                         <Grid item>
//                                             <DatePicker
//                                                 date={currentperiod.to}
//                                                 setDate={(value) =>
//                                                     setCurrentPeriod({
//                                                         ...currentperiod,
//                                                         to: value,
//                                                     })
//                                                 }
//                                                 label={"UpTo"}
//                                             />
//                                         </Grid>
//                                     )}
//                                 </Grid>
//                             </Box>
//                         </DialogContent>
//                         <DialogActions>
//                             {props.onSubmit && (
//                                 <Button
//                                     variant="outlined"
//                                     onClick={() => {
//                                         props.onSubmit(currentperiod);
//                                         setOpen(false);
//                                     }}
//                                 >
//                                     Submit
//                                 </Button>
//                             )}
//                         </DialogActions>
//                     </Dialog>
//                 </>
//             );
//         case "box":
//             return (
//                 <Box>
//                     <Box>
//                         <Box border={1} borderColor="divider" p={2}>
//                             <Grid
//                                 container
//                                 justifyContent={"space-between"}
//                                 alignItems={"flex-start"}
//                                 spacing={2}
//                             >
//                                 <Grid item xs={12} md={4}>
//                                     <Box
//                                         sx={{
//                                             maxHeight: 400,
//                                             overflow: "auto",
//                                         }}
//                                     >
//                                         <List dense disablePadding>
//                                             {periods.map((period) => (
//                                                 <ListItem
//                                                     key={period.slug}
//                                                     size="small"
//                                                     divider
//                                                     disablePadding
//                                                 >
//                                                     <ListItemButton
//                                                         onClick={() =>
//                                                             handleChange(
//                                                                 period.slug
//                                                             )
//                                                         }
//                                                     >
//                                                         <ListItemText
//                                                             children={
//                                                                 period.name
//                                                             }
//                                                         />
//                                                     </ListItemButton>
//                                                 </ListItem>
//                                             ))}
//                                         </List>
//                                     </Box>
//                                 </Grid>
//                                 {props.periodFrom && (
//                                     <Grid item xs={12} md={4}>
//                                         <DatePicker
//                                             date={currentperiod.from}
//                                             setDate={(value) =>
//                                                 setCurrentPeriod({
//                                                     ...currentperiod,
//                                                     from: value,
//                                                 })
//                                             }
//                                             label={"From"}
//                                         />
//                                     </Grid>
//                                 )}
//                                 {props.periodTo && (
//                                     <Grid item xs={12} md={4}>
//                                         <DatePicker
//                                             date={currentperiod.to}
//                                             setDate={(value) =>
//                                                 setCurrentPeriod({
//                                                     ...currentperiod,
//                                                     to: value,
//                                                 })
//                                             }
//                                             label={"TO"}
//                                         />
//                                     </Grid>
//                                 )}
//                                 {props.periodUpto && (
//                                     <Grid item xs={12} md={4}>
//                                         <DatePicker
//                                             date={currentperiod.to}
//                                             setDate={(value) =>
//                                                 setCurrentPeriod({
//                                                     ...currentperiod,
//                                                     to: value,
//                                                 })
//                                             }
//                                             label={"UpTo"}
//                                         />
//                                     </Grid>
//                                 )}
//                             </Grid>
//                         </Box>
//                     </Box>
//                     <Box>
//                         {props.onSubmit && (
//                             <Button
//                                 variant="outlined"
//                                 onClick={() => {
//                                     props.onSubmit(currentperiod);
//                                     setOpen(false);
//                                 }}
//                             >
//                                 Submit
//                             </Button>
//                         )}
//                     </Box>
//                 </Box>
//             );
//     }
// });
// export default PeriodSelector;
