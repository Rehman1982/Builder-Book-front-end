import axios from "axios";
import { toast } from "../features/alert/alertSlice";
import { store } from "../app/store"; /// this is not proper way it must be changed....

const API = axios.create({
  baseURL: "http://localhost/api/",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

API.interceptors.response.use(
  (res) => res,
  async (err) => {
    if (err.response?.status === 401) {
      try {
        console.log("calling refresh token");
        await API.post("refresh-token");
        return axios(err.config); // retry original request
      } catch (refreshErr) {}
    }
    if (err.response?.status === 403) {
      store.dispatch(
        toast({
          message:
            "Access Denied: You dont have permission to view/use this resource(s)",
          severity: "warning",
        })
      );
      // if (window.location.pathname !== "/forbidden")
      //   window.location.href = "/forbidden";
    }
    // if (err.response?.status === 429) {
    //   store.dispatch(
    //     toast({
    //       message: "Wait: 429:API call limit exceed",
    //       severity: "warning",
    //     })
    //   );
    //   if (window.location.pathname !== "/main") window.location.href = "/main";
    // }
    return Promise.reject(err);
  }
);
export default API;
