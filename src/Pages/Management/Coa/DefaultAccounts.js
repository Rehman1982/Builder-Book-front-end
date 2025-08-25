import React, {
    forwardRef,
    useCallback,
    useEffect,
    useImperativeHandle,
    useRef,
    useState,
} from "react";
import {
    Box,
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Slide,
    List,
    Stack,
    FormControlLabel,
    ListItem,
    ListItemText,
    Icon,
    IconButton,
    Dialog,
    Divider,
    Grid,
    ButtonGroup,
    DialogContent,
    TextField,
    DialogActions,
} from "@mui/material";
import API from "../../../api/axiosApi";
import { blue, blueGrey, grey } from "@mui/material/colors";
import { Error } from "../../../components/ui/helpers";
import _ from "lodash";

const mockData = {
    default: [
        {
            id: 475,
            type: "Assets",
            acctno: 1475,
            acctname: "Assets",
            status: "active",
            parent_id: null,
            entry: "0",
            TypeCoa: "Construction",
            children: [
                {
                    id: 476,
                    type: "Assets",
                    acctno: 1476,
                    acctname: "Current Assets",
                    status: "active",
                    parent_id: 475,
                    entry: "0",
                    TypeCoa: "Construction",
                    children: [
                        {
                            id: 477,
                            type: "Assets",
                            acctno: 1477,
                            acctname: "Cash-Petty",
                            status: "active",
                            parent_id: 476,
                            entry: "1",
                            TypeCoa: "Construction",
                            children: [],
                        },
                        {
                            id: 478,
                            type: "Assets",
                            acctno: 1478,
                            acctname: "Cash-General",
                            status: "active",
                            parent_id: 476,
                            entry: "1",
                            TypeCoa: "Construction",
                            children: [],
                        },
                        {
                            id: 479,
                            type: "Assets",
                            acctno: 1479,
                            acctname: "Cash-Payroll",
                            status: "active",
                            parent_id: 476,
                            entry: "1",
                            TypeCoa: "Construction",
                            children: [],
                        },
                        {
                            id: 480,
                            type: "Assets",
                            acctno: 1480,
                            acctname: "Short-Term Investments",
                            status: "active",
                            parent_id: 476,
                            entry: "0",
                            TypeCoa: "Construction",
                            children: [
                                {
                                    id: 481,
                                    type: "Assets",
                                    acctno: 1481,
                                    acctname: "Saving Deposits",
                                    status: "active",
                                    parent_id: 480,
                                    entry: "1",
                                    TypeCoa: "Construction",
                                    children: [],
                                },
                                {
                                    id: 482,
                                    type: "Assets",
                                    acctno: 1482,
                                    acctname: "Other",
                                    status: "active",
                                    parent_id: 480,
                                    entry: "1",
                                    TypeCoa: "Construction",
                                    children: [],
                                },
                            ],
                        },
                        {
                            id: 483,
                            type: "Assets",
                            acctno: 1483,
                            acctname: "Receviables",
                            status: "active",
                            parent_id: 476,
                            entry: "0",
                            TypeCoa: "Construction",
                            children: [
                                {
                                    id: 484,
                                    type: "Assets",
                                    acctno: 1484,
                                    acctname: "Contracts-Receviables",
                                    status: "active",
                                    parent_id: 483,
                                    entry: "1",
                                    TypeCoa: "Construction",
                                    children: [],
                                },
                                {
                                    id: 485,
                                    type: "Assets",
                                    acctno: 1485,
                                    acctname: "Contracts-Retentions",
                                    status: "active",
                                    parent_id: 483,
                                    entry: "1",
                                    TypeCoa: "Construction",
                                    children: [],
                                },
                                {
                                    id: 486,
                                    type: "Assets",
                                    acctno: 1486,
                                    acctname: "Notes-Retentions",
                                    status: "active",
                                    parent_id: 483,
                                    entry: "1",
                                    TypeCoa: "Construction",
                                    children: [],
                                },
                                {
                                    id: 487,
                                    type: "Assets",
                                    acctno: 1487,
                                    acctname: "Underbillings",
                                    status: "active",
                                    parent_id: 483,
                                    entry: "1",
                                    TypeCoa: "Construction",
                                    children: [],
                                },
                                {
                                    id: 488,
                                    type: "Assets",
                                    acctno: 1488,
                                    acctname: "Accured Interests",
                                    status: "active",
                                    parent_id: 483,
                                    entry: "1",
                                    TypeCoa: "Construction",
                                    children: [],
                                },
                                {
                                    id: 489,
                                    type: "Assets",
                                    acctno: 1489,
                                    acctname: "Doubtful Accounts",
                                    status: "active",
                                    parent_id: 483,
                                    entry: "1",
                                    TypeCoa: "Construction",
                                    children: [],
                                },
                            ],
                        },
                        {
                            id: 490,
                            type: "Assets",
                            acctno: 1490,
                            acctname: "Inventory",
                            status: "active",
                            parent_id: 476,
                            entry: "0",
                            TypeCoa: "Construction",
                            children: [
                                {
                                    id: 491,
                                    type: "Assets",
                                    acctno: 1491,
                                    acctname: "Merchantdise Inventory",
                                    status: "active",
                                    parent_id: 490,
                                    entry: "1",
                                    TypeCoa: "Construction",
                                    children: [],
                                },
                            ],
                        },
                        {
                            id: 492,
                            type: "Assets",
                            acctno: 1492,
                            acctname: "Other Current Assets",
                            status: "active",
                            parent_id: 476,
                            entry: "0",
                            TypeCoa: "Construction",
                            children: [
                                {
                                    id: 493,
                                    type: "Assets",
                                    acctno: 1493,
                                    acctname: "Refundables",
                                    status: "active",
                                    parent_id: 492,
                                    entry: "1",
                                    TypeCoa: "Construction",
                                    children: [],
                                },
                                {
                                    id: 494,
                                    type: "Assets",
                                    acctno: 1494,
                                    acctname: "Pre-Payments",
                                    status: "active",
                                    parent_id: 492,
                                    entry: "0",
                                    TypeCoa: "Construction",
                                    children: [
                                        {
                                            id: 495,
                                            type: "Assets",
                                            acctno: 1495,
                                            acctname: "Prepaid insurance",
                                            status: "active",
                                            parent_id: 494,
                                            entry: "1",
                                            TypeCoa: "Construction",
                                            children: [],
                                        },
                                        {
                                            id: 496,
                                            type: "Assets",
                                            acctno: 1496,
                                            acctname: "Prepaid commitment fees",
                                            status: "active",
                                            parent_id: 494,
                                            entry: "1",
                                            TypeCoa: "Construction",
                                            children: [],
                                        },
                                        {
                                            id: 497,
                                            type: "Assets",
                                            acctno: 1497,
                                            acctname: "Prepaid interest",
                                            status: "active",
                                            parent_id: 494,
                                            entry: "1",
                                            TypeCoa: "Construction",
                                            children: [],
                                        },
                                        {
                                            id: 498,
                                            type: "Assets",
                                            acctno: 1498,
                                            acctname: "Prepaid taxes",
                                            status: "active",
                                            parent_id: 494,
                                            entry: "1",
                                            TypeCoa: "Construction",
                                            children: [],
                                        },
                                    ],
                                },
                                {
                                    id: 499,
                                    type: "Assets",
                                    acctno: 1499,
                                    acctname: "Salary Advances",
                                    status: "active",
                                    parent_id: 492,
                                    entry: "1",
                                    TypeCoa: "Construction",
                                    children: [],
                                },
                            ],
                        },
                        {
                            id: 500,
                            type: "Assets",
                            acctno: 1500,
                            acctname: "Fixed Assetes",
                            status: "active",
                            parent_id: 476,
                            entry: "0",
                            TypeCoa: "Construction",
                            children: [
                                {
                                    id: 501,
                                    type: "Assets",
                                    acctno: 1501,
                                    acctname: "Land",
                                    status: "active",
                                    parent_id: 500,
                                    entry: "1",
                                    TypeCoa: "Construction",
                                    children: [],
                                },
                                {
                                    id: 502,
                                    type: "Assets",
                                    acctno: 1502,
                                    acctname: "Buildings",
                                    status: "active",
                                    parent_id: 500,
                                    entry: "1",
                                    TypeCoa: "Construction",
                                    children: [],
                                },
                                {
                                    id: 503,
                                    type: "Assets",
                                    acctno: 1503,
                                    acctname: "Furniture & Fixtures",
                                    status: "active",
                                    parent_id: 500,
                                    entry: "1",
                                    TypeCoa: "Construction",
                                    children: [],
                                },
                                {
                                    id: 504,
                                    type: "Assets",
                                    acctno: 1504,
                                    acctname: "Motor Vehicles",
                                    status: "active",
                                    parent_id: 500,
                                    entry: "1",
                                    TypeCoa: "Construction",
                                    children: [],
                                },
                                {
                                    id: 505,
                                    type: "Assets",
                                    acctno: 1505,
                                    acctname: "Construction Equipments",
                                    status: "active",
                                    parent_id: 500,
                                    entry: "1",
                                    TypeCoa: "Construction",
                                    children: [],
                                },
                            ],
                        },
                    ],
                },
            ],
        },
        {
            id: 506,
            type: "Liability",
            acctno: 2506,
            acctname: "Liability",
            status: "active",
            parent_id: null,
            entry: "0",
            TypeCoa: "Construction",
            children: [
                {
                    id: 507,
                    type: "Liability",
                    acctno: 2507,
                    acctname: "Current Liability",
                    status: "active",
                    parent_id: 506,
                    entry: "0",
                    TypeCoa: "Construction",
                    children: [
                        {
                            id: 508,
                            type: "Liability",
                            acctno: 2508,
                            acctname: "Deposite by Customers",
                            status: "active",
                            parent_id: 507,
                            entry: "1",
                            TypeCoa: "Construction",
                            children: [],
                        },
                        {
                            id: 509,
                            type: "Liability",
                            acctno: 2509,
                            acctname: "Accounts Payables",
                            status: "active",
                            parent_id: 507,
                            entry: "0",
                            TypeCoa: "Construction",
                            children: [
                                {
                                    id: 510,
                                    type: "Liability",
                                    acctno: 2510,
                                    acctname: "Account Payables-Trade",
                                    status: "active",
                                    parent_id: 509,
                                    entry: "1",
                                    TypeCoa: "Construction",
                                    children: [],
                                },
                                {
                                    id: 511,
                                    type: "Liability",
                                    acctno: 2511,
                                    acctname: "Account Payables-Retention",
                                    status: "active",
                                    parent_id: 509,
                                    entry: "1",
                                    TypeCoa: "Construction",
                                    children: [],
                                },
                                {
                                    id: 512,
                                    type: "Liability",
                                    acctno: 2512,
                                    acctname: "Account Payables-Other",
                                    status: "active",
                                    parent_id: 509,
                                    entry: "1",
                                    TypeCoa: "Construction",
                                    children: [],
                                },
                            ],
                        },
                        {
                            id: 513,
                            type: "Liability",
                            acctno: 2513,
                            acctname: "Notes Payables",
                            status: "active",
                            parent_id: 507,
                            entry: "0",
                            TypeCoa: "Construction",
                            children: [
                                {
                                    id: 514,
                                    type: "Liability",
                                    acctno: 2514,
                                    acctname: "Notes Payables-Trade",
                                    status: "active",
                                    parent_id: 513,
                                    entry: "1",
                                    TypeCoa: "Construction",
                                    children: [],
                                },
                                {
                                    id: 515,
                                    type: "Liability",
                                    acctno: 2515,
                                    acctname: "Notes Payables-Retention",
                                    status: "active",
                                    parent_id: 513,
                                    entry: "1",
                                    TypeCoa: "Construction",
                                    children: [],
                                },
                                {
                                    id: 516,
                                    type: "Liability",
                                    acctno: 2516,
                                    acctname: "Notes Payables-Other",
                                    status: "active",
                                    parent_id: 513,
                                    entry: "1",
                                    TypeCoa: "Construction",
                                    children: [],
                                },
                            ],
                        },
                        {
                            id: 517,
                            type: "Liability",
                            acctno: 2517,
                            acctname: "Taxes Payables",
                            status: "active",
                            parent_id: 507,
                            entry: "0",
                            TypeCoa: "Construction",
                            children: [
                                {
                                    id: 518,
                                    type: "Liability",
                                    acctno: 2518,
                                    acctname: "Sales Tax-Payable",
                                    status: "active",
                                    parent_id: 517,
                                    entry: "1",
                                    TypeCoa: "Construction",
                                    children: [],
                                },
                                {
                                    id: 519,
                                    type: "Liability",
                                    acctno: 2519,
                                    acctname: "Income Tax-Payable",
                                    status: "active",
                                    parent_id: 517,
                                    entry: "1",
                                    TypeCoa: "Construction",
                                    children: [],
                                },
                                {
                                    id: 520,
                                    type: "Liability",
                                    acctno: 2520,
                                    acctname: "KPPRA Tax-Payable",
                                    status: "active",
                                    parent_id: 517,
                                    entry: "1",
                                    TypeCoa: "Construction",
                                    children: [],
                                },
                                {
                                    id: 521,
                                    type: "Liability",
                                    acctno: 2521,
                                    acctname: "PPRA Tax-Payable",
                                    status: "active",
                                    parent_id: 517,
                                    entry: "1",
                                    TypeCoa: "Construction",
                                    children: [],
                                },
                                {
                                    id: 522,
                                    type: "Liability",
                                    acctno: 2522,
                                    acctname: "Other Tax-Payable",
                                    status: "active",
                                    parent_id: 517,
                                    entry: "1",
                                    TypeCoa: "Construction",
                                    children: [],
                                },
                            ],
                        },
                    ],
                },
                {
                    id: 523,
                    type: "Liability",
                    acctno: 2523,
                    acctname: "Non-Current Liability",
                    status: "active",
                    parent_id: 506,
                    entry: "0",
                    TypeCoa: "Construction",
                    children: [
                        {
                            id: 524,
                            type: "Liability",
                            acctno: 2524,
                            acctname: "Mortgages Payables",
                            status: "active",
                            parent_id: 523,
                            entry: "1",
                            TypeCoa: "Construction",
                            children: [],
                        },
                        {
                            id: 525,
                            type: "Liability",
                            acctno: 2525,
                            acctname: "Other Payables",
                            status: "active",
                            parent_id: 523,
                            entry: "1",
                            TypeCoa: "Construction",
                            children: [],
                        },
                    ],
                },
            ],
        },
        {
            id: 526,
            type: "Equity",
            acctno: 526,
            acctname: "Equity",
            status: "active",
            parent_id: null,
            entry: "0",
            TypeCoa: "Construction",
            children: [
                {
                    id: 527,
                    type: "Equity",
                    acctno: 527,
                    acctname: "Comman Stock",
                    status: "active",
                    parent_id: 526,
                    entry: "1",
                    TypeCoa: "Construction",
                    children: [],
                },
                {
                    id: 528,
                    type: "Equity",
                    acctno: 528,
                    acctname: "Retained Earnings",
                    status: "active",
                    parent_id: 526,
                    entry: "1",
                    TypeCoa: "Construction",
                    children: [],
                },
                {
                    id: 529,
                    type: "Equity",
                    acctno: 529,
                    acctname: "Partner-1",
                    status: "active",
                    parent_id: 526,
                    entry: "1",
                    TypeCoa: "Construction",
                    children: [],
                },
                {
                    id: 530,
                    type: "Equity",
                    acctno: 530,
                    acctname: "Partner-2",
                    status: "active",
                    parent_id: 526,
                    entry: "1",
                    TypeCoa: "Construction",
                    children: [],
                },
            ],
        },
        {
            id: 531,
            type: "Income",
            acctno: 531,
            acctname: "Income",
            status: "active",
            parent_id: null,
            entry: "0",
            TypeCoa: "Construction",
            children: [
                {
                    id: 532,
                    type: "Income",
                    acctno: 532,
                    acctname: "Income from Constructions",
                    status: "active",
                    parent_id: 531,
                    entry: "1",
                    TypeCoa: "Construction",
                    children: [],
                },
                {
                    id: 533,
                    type: "Income",
                    acctno: 533,
                    acctname: "Income - Other",
                    status: "active",
                    parent_id: 531,
                    entry: "0",
                    TypeCoa: "Construction",
                    children: [
                        {
                            id: 534,
                            type: "Income",
                            acctno: 534,
                            acctname: "Rental Income",
                            status: "active",
                            parent_id: 533,
                            entry: "1",
                            TypeCoa: "Construction",
                            children: [],
                        },
                        {
                            id: 535,
                            type: "Income",
                            acctno: 535,
                            acctname: "Income from Investments",
                            status: "active",
                            parent_id: 533,
                            entry: "1",
                            TypeCoa: "Construction",
                            children: [],
                        },
                        {
                            id: 536,
                            type: "Income",
                            acctno: 536,
                            acctname: "Discount Received Income",
                            status: "active",
                            parent_id: 533,
                            entry: "1",
                            TypeCoa: "Construction",
                            children: [],
                        },
                        {
                            id: 537,
                            type: "Income",
                            acctno: 537,
                            acctname: "Miscellaneous Income",
                            status: "active",
                            parent_id: 533,
                            entry: "1",
                            TypeCoa: "Construction",
                            children: [],
                        },
                    ],
                },
            ],
        },
        {
            id: 538,
            type: "COGS",
            acctno: 4538,
            acctname: "COGS",
            status: "active",
            parent_id: null,
            entry: "0",
            TypeCoa: "Construction",
            children: [
                {
                    id: 539,
                    type: "COGS",
                    acctno: 4539,
                    acctname: "Cost of Construction",
                    status: "active",
                    parent_id: 538,
                    entry: "0",
                    TypeCoa: "Construction",
                    children: [
                        {
                            id: 540,
                            type: "COGS",
                            acctno: 4540,
                            acctname: "Labour",
                            status: "active",
                            parent_id: 539,
                            entry: "1",
                            TypeCoa: "Construction",
                            children: [],
                        },
                        {
                            id: 541,
                            type: "COGS",
                            acctno: 4541,
                            acctname: "Material",
                            status: "active",
                            parent_id: 539,
                            entry: "1",
                            TypeCoa: "Construction",
                            children: [],
                        },
                        {
                            id: 542,
                            type: "COGS",
                            acctno: 4542,
                            acctname: "Sub-Conturctors",
                            status: "active",
                            parent_id: 539,
                            entry: "1",
                            TypeCoa: "Construction",
                            children: [],
                        },
                        {
                            id: 543,
                            type: "COGS",
                            acctno: 4543,
                            acctname: "Equipments and Vehicles",
                            status: "active",
                            parent_id: 539,
                            entry: "1",
                            TypeCoa: "Construction",
                            children: [],
                        },
                        {
                            id: 544,
                            type: "COGS",
                            acctno: 4544,
                            acctname: "Indirect Cost",
                            status: "active",
                            parent_id: 539,
                            entry: "0",
                            TypeCoa: "Construction",
                            children: [
                                {
                                    id: 545,
                                    type: "COGS",
                                    acctno: 4545,
                                    acctname: "Salaries Expense",
                                    status: "active",
                                    parent_id: 544,
                                    entry: "1",
                                    TypeCoa: "Construction",
                                    children: [],
                                },
                                {
                                    id: 546,
                                    type: "COGS",
                                    acctno: 4546,
                                    acctname: "Equipment Expense",
                                    status: "active",
                                    parent_id: 544,
                                    entry: "1",
                                    TypeCoa: "Construction",
                                    children: [],
                                },
                                {
                                    id: 547,
                                    type: "COGS",
                                    acctno: 4547,
                                    acctname: "Taxes Expense",
                                    status: "active",
                                    parent_id: 544,
                                    entry: "1",
                                    TypeCoa: "Construction",
                                    children: [],
                                },
                                {
                                    id: 548,
                                    type: "COGS",
                                    acctno: 4548,
                                    acctname: "Depreciation Expense",
                                    status: "active",
                                    parent_id: 544,
                                    entry: "1",
                                    TypeCoa: "Construction",
                                    children: [],
                                },
                                {
                                    id: 549,
                                    type: "COGS",
                                    acctno: 4549,
                                    acctname: "Tools Expense",
                                    status: "active",
                                    parent_id: 544,
                                    entry: "1",
                                    TypeCoa: "Construction",
                                    children: [],
                                },
                                {
                                    id: 550,
                                    type: "COGS",
                                    acctno: 4550,
                                    acctname: "Rental Expense",
                                    status: "active",
                                    parent_id: 544,
                                    entry: "1",
                                    TypeCoa: "Construction",
                                    children: [],
                                },
                                {
                                    id: 551,
                                    type: "COGS",
                                    acctno: 4551,
                                    acctname: "Automobiles Expense",
                                    status: "active",
                                    parent_id: 544,
                                    entry: "1",
                                    TypeCoa: "Construction",
                                    children: [],
                                },
                                {
                                    id: 552,
                                    type: "COGS",
                                    acctno: 4552,
                                    acctname: "Other Expense",
                                    status: "active",
                                    parent_id: 544,
                                    entry: "1",
                                    TypeCoa: "Construction",
                                    children: [],
                                },
                            ],
                        },
                    ],
                },
                {
                    id: 553,
                    type: "COGS",
                    acctno: 4553,
                    acctname: "Financing Expense",
                    status: "active",
                    parent_id: 538,
                    entry: "1",
                    TypeCoa: "Construction",
                    children: [],
                },
                {
                    id: 554,
                    type: "COGS",
                    acctno: 4554,
                    acctname: "Marketing Expense",
                    status: "active",
                    parent_id: 538,
                    entry: "1",
                    TypeCoa: "Construction",
                    children: [],
                },
                {
                    id: 555,
                    type: "COGS",
                    acctno: 4555,
                    acctname: "Administrative Expense",
                    status: "active",
                    parent_id: 538,
                    entry: "0",
                    TypeCoa: "Construction",
                    children: [
                        {
                            id: 556,
                            type: "COGS",
                            acctno: 4556,
                            acctname: "Officers Salaries",
                            status: "active",
                            parent_id: 555,
                            entry: "1",
                            TypeCoa: "Construction",
                            children: [],
                        },
                        {
                            id: 557,
                            type: "COGS",
                            acctno: 4557,
                            acctname: "Other Charges",
                            status: "active",
                            parent_id: 555,
                            entry: "1",
                            TypeCoa: "Construction",
                            children: [],
                        },
                    ],
                },
                {
                    id: 558,
                    type: "COGS",
                    acctno: 4558,
                    acctname: "Office Expenses",
                    status: "active",
                    parent_id: 538,
                    entry: "0",
                    TypeCoa: "Construction",
                    children: [
                        {
                            id: 559,
                            type: "COGS",
                            acctno: 4559,
                            acctname: "Rent Expense",
                            status: "active",
                            parent_id: 558,
                            entry: "1",
                            TypeCoa: "Construction",
                            children: [],
                        },
                        {
                            id: 560,
                            type: "COGS",
                            acctno: 4560,
                            acctname: "Supplies",
                            status: "active",
                            parent_id: 558,
                            entry: "1",
                            TypeCoa: "Construction",
                            children: [],
                        },
                        {
                            id: 561,
                            type: "COGS",
                            acctno: 4561,
                            acctname: "Postage & Mailing",
                            status: "active",
                            parent_id: 558,
                            entry: "1",
                            TypeCoa: "Construction",
                            children: [],
                        },
                        {
                            id: 562,
                            type: "COGS",
                            acctno: 4562,
                            acctname: "Office Mechines & Equipments",
                            status: "active",
                            parent_id: 558,
                            entry: "1",
                            TypeCoa: "Construction",
                            children: [],
                        },
                        {
                            id: 563,
                            type: "COGS",
                            acctno: 4563,
                            acctname: "Utility Bills",
                            status: "active",
                            parent_id: 558,
                            entry: "1",
                            TypeCoa: "Construction",
                            children: [],
                        },
                        {
                            id: 564,
                            type: "COGS",
                            acctno: 4564,
                            acctname: "Miscellaneous",
                            status: "active",
                            parent_id: 558,
                            entry: "1",
                            TypeCoa: "Construction",
                            children: [],
                        },
                    ],
                },
                {
                    id: 565,
                    type: "COGS",
                    acctno: 4565,
                    acctname: "Taxes",
                    status: "active",
                    parent_id: 538,
                    entry: "0",
                    TypeCoa: "Construction",
                    children: [],
                },
            ],
        },
    ],
    construction: [
        {
            id: 252,
            type: "Assets",
            acctno: 1252,
            acctname: "Assets",
            status: "active",
            parent_id: null,
            entry: "0",
            TypeCoa: "default",
            children: [
                {
                    id: 253,
                    type: "Assets",
                    acctno: 1253,
                    acctname: "Current Assets",
                    status: "active",
                    parent_id: 252,
                    entry: "0",
                    TypeCoa: "default",
                    children: [
                        {
                            id: 254,
                            type: "Assets",
                            acctno: 1254,
                            acctname: "Cash",
                            status: "active",
                            parent_id: 253,
                            entry: "1",
                            TypeCoa: "default",
                            children: [],
                        },
                        {
                            id: 255,
                            type: "Assets",
                            acctno: 1255,
                            acctname: "Bank",
                            status: "active",
                            parent_id: 253,
                            entry: "1",
                            TypeCoa: "default",
                            children: [],
                        },
                        {
                            id: 256,
                            type: "Assets",
                            acctno: 1256,
                            acctname: "Recevibels",
                            status: "active",
                            parent_id: 253,
                            entry: "1",
                            TypeCoa: "default",
                            children: [],
                        },
                    ],
                },
                {
                    id: 257,
                    type: "Assets",
                    acctno: 1257,
                    acctname: "Fixed Assets",
                    status: "active",
                    parent_id: 252,
                    entry: "0",
                    TypeCoa: "default",
                    children: [
                        {
                            id: 258,
                            type: "Assets",
                            acctno: 1258,
                            acctname: "Mechinery",
                            status: "active",
                            parent_id: 257,
                            entry: "1",
                            TypeCoa: "default",
                            children: [],
                        },
                        {
                            id: 259,
                            type: "Assets",
                            acctno: 1259,
                            acctname: "Vehicles",
                            status: "active",
                            parent_id: 257,
                            entry: "1",
                            TypeCoa: "default",
                            children: [],
                        },
                        {
                            id: 260,
                            type: "Assets",
                            acctno: 1260,
                            acctname: "Buildings",
                            status: "active",
                            parent_id: 257,
                            entry: "1",
                            TypeCoa: "default",
                            children: [],
                        },
                        {
                            id: 261,
                            type: "Assets",
                            acctno: 1261,
                            acctname: "Plants",
                            status: "active",
                            parent_id: 257,
                            entry: "1",
                            TypeCoa: "default",
                            children: [],
                        },
                    ],
                },
            ],
        },
        {
            id: 262,
            type: "Liability",
            acctno: 2262,
            acctname: "Liability",
            status: "active",
            parent_id: null,
            entry: "0",
            TypeCoa: "default",
            children: [
                {
                    id: 263,
                    type: "Liability",
                    acctno: 2263,
                    acctname: "Long Term Liability",
                    status: "active",
                    parent_id: 262,
                    entry: "1",
                    TypeCoa: "default",
                    children: [],
                },
                {
                    id: 264,
                    type: "Liability",
                    acctno: 2264,
                    acctname: "Short Term Liability",
                    status: "active",
                    parent_id: 262,
                    entry: "0",
                    TypeCoa: "default",
                    children: [
                        {
                            id: 265,
                            type: "Liability",
                            acctno: 2265,
                            acctname: "Vendors Liability",
                            status: "active",
                            parent_id: 264,
                            entry: "1",
                            TypeCoa: "default",
                            children: [],
                        },
                        {
                            id: 266,
                            type: "Liability",
                            acctno: 2266,
                            acctname: "Payables",
                            status: "active",
                            parent_id: 264,
                            entry: "1",
                            TypeCoa: "default",
                            children: [],
                        },
                    ],
                },
            ],
        },
        {
            id: 267,
            type: "Equity",
            acctno: 267,
            acctname: "Equity",
            status: "active",
            parent_id: null,
            entry: "0",
            TypeCoa: "default",
            children: [
                {
                    id: 268,
                    type: "Equity",
                    acctno: 268,
                    acctname: "Partner 1",
                    status: "active",
                    parent_id: 267,
                    entry: "1",
                    TypeCoa: "default",
                    children: [],
                },
                {
                    id: 269,
                    type: "Equity",
                    acctno: 269,
                    acctname: "Partner 2",
                    status: "active",
                    parent_id: 267,
                    entry: "1",
                    TypeCoa: "default",
                    children: [],
                },
            ],
        },
        {
            id: 270,
            type: "Income",
            acctno: 270,
            acctname: "Income",
            status: "active",
            parent_id: null,
            entry: "0",
            TypeCoa: "default",
            children: [
                {
                    id: 271,
                    type: "Income",
                    acctno: 271,
                    acctname: "Income from Services",
                    status: "active",
                    parent_id: 270,
                    entry: "1",
                    TypeCoa: "default",
                    children: [],
                },
                {
                    id: 272,
                    type: "Income",
                    acctno: 272,
                    acctname: "Discount Received",
                    status: "active",
                    parent_id: 270,
                    entry: "1",
                    TypeCoa: "default",
                    children: [],
                },
                {
                    id: 273,
                    type: "Income",
                    acctno: 273,
                    acctname: "Meterial Returned",
                    status: "active",
                    parent_id: 270,
                    entry: "1",
                    TypeCoa: "default",
                    children: [],
                },
            ],
        },
        {
            id: 274,
            type: "COGS",
            acctno: 4274,
            acctname: "COGS",
            status: "active",
            parent_id: null,
            entry: "0",
            TypeCoa: "default",
            children: [
                {
                    id: 275,
                    type: "COGS",
                    acctno: 4275,
                    acctname: "Direct Expenses",
                    status: "active",
                    parent_id: 274,
                    entry: "0",
                    TypeCoa: "default",
                    children: [
                        {
                            id: 276,
                            type: "COGS",
                            acctno: 4276,
                            acctname: "Material Charges",
                            status: "active",
                            parent_id: 275,
                            entry: "1",
                            TypeCoa: "default",
                            children: [],
                        },
                        {
                            id: 277,
                            type: "COGS",
                            acctno: 4277,
                            acctname: "Mechinary Charges",
                            status: "active",
                            parent_id: 275,
                            entry: "1",
                            TypeCoa: "default",
                            children: [],
                        },
                        {
                            id: 278,
                            type: "COGS",
                            acctno: 4278,
                            acctname: "Salaries Expense",
                            status: "active",
                            parent_id: 275,
                            entry: "1",
                            TypeCoa: "default",
                            children: [],
                        },
                        {
                            id: 279,
                            type: "COGS",
                            acctno: 4279,
                            acctname: "Labour Charges",
                            status: "active",
                            parent_id: 275,
                            entry: "1",
                            TypeCoa: "default",
                            children: [],
                        },
                        {
                            id: 280,
                            type: "COGS",
                            acctno: 4280,
                            acctname: "Loading/Un-Loading Expenses",
                            status: "active",
                            parent_id: 275,
                            entry: "1",
                            TypeCoa: "default",
                            children: [],
                        },
                        {
                            id: 281,
                            type: "COGS",
                            acctno: 4281,
                            acctname: "Rental Expenditure",
                            status: "active",
                            parent_id: 275,
                            entry: "1",
                            TypeCoa: "default",
                            children: [],
                        },
                    ],
                },
                {
                    id: 282,
                    type: "COGS",
                    acctno: 4282,
                    acctname: "Indirect Expenses",
                    status: "active",
                    parent_id: 274,
                    entry: "0",
                    TypeCoa: "default",
                    children: [
                        {
                            id: 283,
                            type: "COGS",
                            acctno: 4283,
                            acctname: "POL Expense",
                            status: "active",
                            parent_id: 282,
                            entry: "1",
                            TypeCoa: "default",
                            children: [],
                        },
                        {
                            id: 284,
                            type: "COGS",
                            acctno: 4284,
                            acctname: "Tranportation Expenses",
                            status: "active",
                            parent_id: 282,
                            entry: "1",
                            TypeCoa: "default",
                            children: [],
                        },
                        {
                            id: 285,
                            type: "COGS",
                            acctno: 4285,
                            acctname: "Communication Charges",
                            status: "active",
                            parent_id: 282,
                            entry: "1",
                            TypeCoa: "default",
                            children: [],
                        },
                        {
                            id: 286,
                            type: "COGS",
                            acctno: 4286,
                            acctname: "Bank Charges",
                            status: "active",
                            parent_id: 282,
                            entry: "1",
                            TypeCoa: "default",
                            children: [],
                        },
                        {
                            id: 287,
                            type: "COGS",
                            acctno: 4287,
                            acctname: "Taxes",
                            status: "active",
                            parent_id: 282,
                            entry: "0",
                            TypeCoa: "default",
                            children: [
                                {
                                    id: 288,
                                    type: "COGS",
                                    acctno: 4288,
                                    acctname: "Income Tax",
                                    status: "active",
                                    parent_id: 287,
                                    entry: "1",
                                    TypeCoa: "default",
                                    children: [],
                                },
                                {
                                    id: 289,
                                    type: "COGS",
                                    acctno: 4289,
                                    acctname: "Sale Tax",
                                    status: "active",
                                    parent_id: 287,
                                    entry: "1",
                                    TypeCoa: "default",
                                    children: [],
                                },
                                {
                                    id: 290,
                                    type: "COGS",
                                    acctno: 4290,
                                    acctname: "KPPRA Tax",
                                    status: "active",
                                    parent_id: 287,
                                    entry: "1",
                                    TypeCoa: "default",
                                    children: [],
                                },
                                {
                                    id: 291,
                                    type: "COGS",
                                    acctno: 4291,
                                    acctname: "With Holding Tax",
                                    status: "active",
                                    parent_id: 287,
                                    entry: "1",
                                    TypeCoa: "default",
                                    children: [],
                                },
                                {
                                    id: 292,
                                    type: "COGS",
                                    acctno: 4292,
                                    acctname: "Professional Tax",
                                    status: "active",
                                    parent_id: 287,
                                    entry: "1",
                                    TypeCoa: "default",
                                    children: [],
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    ],
};

const GroupTablePagination = () => {
    const EditAcRef = useRef(null);
    const [accountsTree, setAccountsTree] = useState(mockData);
    const groups = Object.keys(accountsTree);
    const [activeIndex, setActiveIndex] = useState(0);
    const [slideIn, setSlideIn] = useState(true);
    const [direction, setDirection] = useState("left");
    const [selectedAc, setSelectedAc] = useState({
        index: null,
        content: null,
    });
    const handleEdit = useCallback((data) => {
        setSelectedAc(data);
        EditAcRef.current.open();
    }, []);
    const handleChange = (newIndex) => {
        setSlideIn(false);
        setTimeout(() => {
            setDirection(newIndex > activeIndex ? "left" : "right");
            setActiveIndex(newIndex);
            setSlideIn(true);
        }, 300); // Delay must match Slide exit timeout
    };

    const handleNext = () => {
        if (activeIndex < groups.length - 1) {
            handleChange(activeIndex + 1);
        }
    };

    const handleBack = () => {
        if (activeIndex > 0) {
            handleChange(activeIndex - 1);
        }
    };

    const currentGroup = groups[activeIndex];
    const rows = accountsTree[currentGroup];
    useEffect(() => {
        console.log(rows);
    }, [rows]);
    // const getData = async () => {
    //     try {
    //         const result = await API.get(
    //             route("management.defaultAccounts.index")
    //         );
    //         console.log(result.data);
    //         const tree = result.data.map((accts) => {
    //             return generateNestedTree(accts.accounts);
    //         });
    //         console.log(tree);
    //         setAccountsTree(tree);
    //     } catch (error) {
    //         console.log(error);
    //     }
    // };
    // useEffect(() => {
    //     getData();
    // }, []);
    return (
        <Box>
            <Grid container spacing={1}>
                <Grid item sx={{ display: "flex", alignItems: "center" }}>
                    <IconButton
                        size="large"
                        onClick={handleBack}
                        disabled={activeIndex === 0}
                    >
                        <Icon>arrow_back_ios</Icon>
                    </IconButton>
                </Grid>
                <Grid item flexGrow={1}>
                    <Box sx={{ width: "100%" }}>
                        <Slide
                            direction={direction}
                            in={slideIn}
                            mountOnEnter
                            unmountOnExit
                            timeout={{ enter: 500, exit: 300 }}
                        >
                            <Box
                                key={activeIndex}
                                component={Paper}
                                elevation={3}
                                sx={{ p: 4 }}
                            >
                                <Stack
                                    direction={"row"}
                                    justifyContent={"space-between"}
                                    alignItems={"center"}
                                    px={2}
                                >
                                    <Box>
                                        <Typography variant="h6" align="left">
                                            {currentGroup.toUpperCase()}
                                        </Typography>

                                        <Typography
                                            color="text.secondary"
                                            variant="caption"
                                        >
                                            Accounts can be edited after saving.
                                        </Typography>
                                    </Box>

                                    <InjectAccouts accounts={rows} />
                                </Stack>
                                <Divider sx={{ my: 1 }} />
                                <Box
                                    sx={{
                                        position: "relative",
                                        maxHeight: "100vh",
                                        overflow: "auto",
                                        px: 3,
                                    }}
                                >
                                    <EditAC ref={EditAcRef} {...selectedAc} />
                                    {/* <List> */}
                                    {rows.length == 0
                                        ? "no Account Available"
                                        : rows.map((item) => (
                                              <TreeItem
                                                  key={item.id}
                                                  item={item}
                                                  pdl={0}
                                                  Edit={handleEdit}
                                              />
                                          ))}
                                    {/* </List> */}
                                </Box>
                            </Box>
                        </Slide>
                    </Box>
                </Grid>
                <Grid item sx={{ display: "flex", alignItems: "center" }}>
                    <IconButton
                        size="large"
                        onClick={handleNext}
                        disabled={activeIndex === groups.length - 1}
                    >
                        <Icon>arrow_forward_ios</Icon>
                    </IconButton>
                </Grid>
            </Grid>

            {/* <Box mt={2} display="flex" justifyContent="space-between">
                <Button
                    variant="outlined"
                    onClick={handleBack}
                    disabled={activeIndex === 0}
                >
                    ← Back
                </Button>
                <Button
                    variant="outlined"
                    onClick={handleNext}
                    disabled={activeIndex === groups.length - 1}
                >
                    Next →
                </Button>
            </Box> */}
        </Box>
    );
};

export default GroupTablePagination;

function generateNestedTree(data) {
    const map = {};
    const tree = [];

    // Create a map with default children array
    data.forEach((item) => {
        map[item.id] = { ...item, children: [] };
    });

    // Build the tree
    data.forEach((item) => {
        if (item.parent_id && map[item.parent_id]) {
            map[item.parent_id].children.push(map[item.id]);
        } else {
            tree.push(map[item.id]);
        }
    });

    return tree;
}

const TreeItem = ({ item, pdl, Edit }) => {
    const hasChildren = item.children && item.children.length > 0;
    return (
        <Box>
            <Stack
                direction={"row"}
                justifyContent={"space-between"}
                alignItems={"center"}
                borderBottom={1}
                borderColor="divider"
                pl={pdl}
            >
                <Typography variant="body1">{item.acctname}</Typography>

                {/* <Stack direction={"row"} alignItems={"center"} spacing={1}>
                    <IconButton onClick={() => Edit({index})} size="small">
                        <Icon color="warning">edit</Icon>
                    </IconButton>
                    <IconButton size="small">
                        <Icon color="error">delete</Icon>
                    </IconButton>
                </Stack> */}
            </Stack>
            {
                hasChildren &&
                    // <List>
                    item.children.map((child) => (
                        <TreeItem
                            key={child.id}
                            item={child}
                            pdl={pdl + 3}
                            Edit={Edit}
                        />
                    ))
                // </List>
            }
        </Box>
    );
};

const InjectAccouts = (accounts) => {
    const [open, setOpen] = useState(false);
    const [currentAcs, setCurrentAcs] = useState(accounts);
    const [code, setCode] = useState("");
    const [errors, setErrors] = useState({});
    const handleClose = () => {
        setOpen(false);
        setErrors({});
        setCode("");
    };
    const handleInject = async () => {
        try {
            const res = await API.post(
                route("management.defaultAccounts.store"),
                { ...accounts, code: code }
            );
            if (res.status === 203) {
                setErrors(res.data);
            }
            console.log(res);
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <Box>
            <Button variant="contained" onClick={() => setOpen(true)}>
                Use As Chart of Accounts
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogContent>
                    <TextField
                        label="Signatory Code"
                        name="code"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        margin="dense"
                        error={_.has(errors, "code")}
                        helperText={<Error errors={errors} name="code" />}
                    />
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" onClick={handleInject}>
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

const EditAC = forwardRef((props, ref) => {
    useImperativeHandle(ref, () => ({
        open: () => setOpen(true),
        close: () => setOpen(false),
    }));
    const [open, setOpen] = useState(false);
    return (
        <Dialog open={open} onClose={() => setOpen(false)}>
            <DialogContent>
                <TextField
                    label="Account Name"
                    value={props.acctname || ""}
                    margin="dense"
                />
            </DialogContent>
        </Dialog>
    );
});
