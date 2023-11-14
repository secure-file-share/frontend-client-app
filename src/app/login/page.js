import styles from "../styles/login.module.css";
import React from "react";
import { Input, Tooltip } from "antd";
import SuccessBtn from "../components/successBtn";
import { InfoCircleOutlined } from "@ant-design/icons";

const Login = () => {
  return (
    <div className={styles.mainDiv}>
      <div className={styles.loginHeading}>SECURE FILE SHARE</div>
      <div className={styles.form}>
        <div className={styles.username}>
          <Input
            placeholder="Username"
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
          <Input type="password" size="large" placeholder="Password" />
        </div>
        <div className={styles.loginBtnDiv}>
          <SuccessBtn
            className={styles.loginBtn}
            type="success"
            style={{ width: "100%" }}
          >
            Login
          </SuccessBtn>
        </div>
      </div>
    </div>
  );
};

export default Login;
