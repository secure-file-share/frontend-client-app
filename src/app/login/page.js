"use client";

import styles from "../styles/login.module.css";
import React, {
  useState,
  // useEffect
} from "react";
// import { useRouter, redirect } from "next/navigation";
import { Input, Tooltip, Button, message } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";

import { loadFromLocalStorage } from "../../../localStorage";
import { setAuth, setRefreshTimer, logInAction } from "../../../authentication";

const Login = (props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [messageApi, contextHolder] = message.useMessage();

  function redirectHome() {
    // const { push } = useRouter();

    // useEffect(() => {
    //   push("/home");
    // }, []);

    // redirect("/home");
    if (typeof window !== "undefined") {
      window.location.href = "/home";
    }
  }

  let auth = loadFromLocalStorage("auth");

  if (auth) {
    setAuth(auth);
    setRefreshTimer(auth.refresh);
    redirectHome();
  }

  return (
    <div className={styles.mainDiv}>
      {contextHolder}
      <div className={styles.loginHeading}>SECURE FILE SHARE</div>
      <form
        className={styles.form}
        onSubmit={(e) => {
          e.preventDefault();

          logInAction(username, password, redirectHome, () =>
            messageApi.open({
              type: "warning",
              content: "Unable to authenticate",
            })
          );
        }}
      >
        <div className={styles.username}>
          <Input
            placeholder="Username"
            onChange={(event) => {
              setUsername(event.target.value);
            }}
            size="large"
            suffix={
              <Tooltip title="Enter your username or email">
                <InfoCircleOutlined
                  style={{
                    color: "rgba(0,0,0,.45)",
                  }}
                />
              </Tooltip>
            }
          />
        </div>
        <div className={styles.password}>
          <Input
            onChange={(event) => {
              setPassword(event.target.value);
            }}
            type="password"
            size="large"
            placeholder="Password"
          />
        </div>
        <div className={styles.loginBtnDiv}>
          <Button type="success" htmlType="submit" className={styles.loginBtn}>
            Log In
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Login;
