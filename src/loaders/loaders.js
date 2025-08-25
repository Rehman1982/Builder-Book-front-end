import axios from "axios";
import { redirect } from "react-router-dom";
import API from "../api/axiosApi";

export async function authLoader() {
  console.log("Authentication Checking ");
  try {
    const res = await API.get("me");
    return res.data;
  } catch (error) {
    if (error.status === 403) {
      return redirect("/email/verify");
      throw new Response(error.status, {
        statusText: error.data?.message || "Unknown error",
      });
    }
    if (error.status === 403) {
      throw new Response(error.status, {
        statusText: error.data?.message || "Unknown error",
      });
    }
    return redirect("/login");
  }
  return null;
}

export async function guestOnly() {
  console.log("Authentication Checking ");
  try {
    const res = await API.get("me");
    if (res.status == 200 && res?.data) {
      return redirect("/main");
    }
  } catch (error) {
    return null;
  }
  return null;
}

export async function emailverifyLoader() {
  console.log("Authentication Checking ");
  try {
    const res = await API.get("me");
    if (res.status == 200 && res.data) {
      return redirect("/main");
    }
  } catch (error) {
    if (error.status !== 403) {
      return redirect("/main");
    }
  }
  return null;
}
