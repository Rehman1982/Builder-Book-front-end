import { createSlice, nanoid } from "@reduxjs/toolkit";
import _ from "lodash";

const initialState = {
    poList: [],
    selectedPoId: null,
    items: [],
    projects: [],
    vendors: [],
    deductions: [],
    createPo: { po: { id: "" }, details: [], deductions: [] },
    poAmount: 0,
    poDdAmount: 0,
};
const poSlice = createSlice({
    name: "purchaseOrder",
    initialState,
    reducers: {
        setPOList: (state, action) => {
            state.poList = action.payload;
        },
        setCreatePo: (state, action) => {
            state.createPo = action.payload;
        },
        resetCreatePo: (state) => {
            state.createPo = { po: {}, details: [], deductions: [] };
        },
        selectPoId: (state, action) => {
            state.selectedPoId = action.payload;
        },
        clearSelectedPO: (state) => {
            state.selectedPoId = null;
        },
        setItems: (state, action) => {
            state.items = action.payload;
        },
        setProjects: (state, action) => {
            state.projects = action.payload;
        },
        setVendors: (state, action) => {
            state.vendors = action.payload;
        },
        setDeductions: (state, action) => {
            state.deductions = action.payload;
        },
        setPOHead: (state, action) => {
            state.createPo.po = action.payload;
        },
        setPODetails: (state, action) => {
            state.createPo.details.push(action.payload);
        },
        updatePODetails: (state, action) => {
            const updated = state.createPo.details.map((v, i) => {
                if (i === action.payload.index) {
                    v = action.payload.data;
                }
                return v;
            });
            state.createPo.details = updated;
        },
        removePODetails: (state, action) => {
            state.createPo.details = state.createPo.details.filter(
                (d, i) => i !== action.payload
            );
        },
        setPODeductions: (state, action) => {
            state.createPo.deductions.push(action.payload);
        },
        updatePODeductions: (state, action) => {
            const updated = state.createPo.deductions.map((v, i) => {
                if (i === action.payload.index) {
                    v = action.payload.data;
                }
                return v;
            });
            state.createPo.deductions = updated;
        },
        removePODeductions: (state, action) => {
            state.createPo.deductions = state.createPo.deductions.filter(
                (d, i) => i !== action.payload
            );
        },
        poAmount: (state) => {
            const amount = _.sumBy(state.createPo.details, (d) =>
                _.round(d.finalRate * d.qty, 0)
            );
            return amount;
        },
    },
});

export const {
    setPOList,
    selectPoId,
    clearSelectedPO,
    setCreatePo,
    resetCreatePo,
    setItems,
    setProjects,
    setVendors,
    setDeductions,
    setPOHead,
    setPODetails,
    updatePODetails,
    removePODetails,
    setPODeductions,
    updatePODeductions,
    removePODeductions,
    poAmount,
} = poSlice.actions;
export default poSlice.reducer;
