"use client";

import $ from "jquery";
import { saveToLocalStorage, loadFromLocalStorage } from "./localStorage";

export function setAuth(auth) {
  saveToLocalStorage("auth", auth);
}

export function setRefreshTimer(refresh) {
  setInterval(
    () => {
      $.ajax({
        url:
          `https://securefileshare.pythonanywhere.com` +
          `/api/auth/token/refresh/`,
        method: "POST",
        data: {
          refresh,
        },
        success: (resp) => {
          let auth = loadFromLocalStorage("auth");
          auth.access = resp.access;
          setAuth(auth);
        },
        error: (err) => {
          console.log(err);
        },
      });
    },
    1 * 60 * 1000 // minutes, seconds, milliseconds
  );
}

export function logInAction(
  username,
  password,
  redirectCallback,
  errorCallback
) {
  $.ajax({
    url:
      `https://securefileshare.pythonanywhere.com` + `/api/auth/token/login/`,
    method: "POST",
    data: {
      username,
      password,
    },
    success: (resp) => {
      let auth = resp;
      let { refresh } = auth;

      setAuth(auth);
      setRefreshTimer(refresh);
      redirectCallback();
    },
    error: (err) => {
      console.log(err);

      errorCallback();
    },
  });
}
