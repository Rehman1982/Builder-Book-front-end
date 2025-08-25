import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activeCompany: "",
  currentUser: "",
  mode: "light",
  isAuth: false,
};
const authSlice = createSlice({
  name: "authSlice",
  initialState,
  reducers: {
    setActiveCompany: (state, action) => {
      state.activeCompany = action.payload;
    },
    setUser: (state, action) => {
      state.currentUser = action.payload;
    },
    setAuth: (state, action) => {
      state.isAuth = action.payload;
    },
    setMode: (state, action) => {
      state.mode = action.payload;
    },
  },
});

export const { setActiveCompany, setUser, setAuth } = authSlice.actions;
export default authSlice.reducer;

// import axios from "axios";
// import React from "react";
// import { useEffect } from "react";
// import { useState } from "react";
// import { createContext } from "react";
// import { redirect } from "react-router-dom";
// import mytheme from "../Pages/colorTheme";
// import { ThemeProvider } from "@emotion/react";
// import { CssBaseline } from "@mui/material";
// import API from "../api/axiosApi";

// const AuthContext = createContext();

// export const AuthProvider = (props) => {
//     const [mode, setMode] = useState("light");
//     const [activeCompany, setActiveCompany] = useState(null);
//     const [user, setUser] = useState(null);
//     const [isAuth, setAuth] = useState(false);
//     const login = async (credentials) => {
//         try {
//             const result = await API.post("login", credentials);
//             console.log("result log", result);
//             if (result.status == 200) {
//                 setUser(result.data);
//                 setAuth(true);
//                 if (result.data.email_verified_at == null) {
//                     return redirect("/email/verify");
//                 }
//             }
//         } catch (error) {
//             console.log(error.response);
//         }
//     };
//     const logout = async () => {
//         try {
//             const signout = await API.post("logout");
//             if (signout.status === 204) {
//                 setUser(null);
//                 setAuth(false);
//                 console.log(signout);
//                 return true;
//             }
//         } catch (error) {
//             return false;
//         }
//     };
//     return (
//         <AuthContext.Provider
//             value={{
//                 isAuth,
//                 user,
//                 setUser,
//                 activeCompany,
//                 setActiveCompany,
//                 login,
//                 logout,
//                 mode,
//                 setMode,
//             }}
//         >
//             <ThemeProvider theme={mytheme(mode)}>
//                 <CssBaseline />
//                 {props.children}
//             </ThemeProvider>
//         </AuthContext.Provider>
//     );
// };
// export default AuthContext;
