"use client";
import styles from "../styles/home.module.css";
import { InboxOutlined } from "@ant-design/icons";
import { Col, Row, message, Upload, Button, Tabs } from "antd";
import SuccessBtn from "../components/successBtn";
import React from "react";
import userSolid from "../../../public/user-solid.svg";
import Image from "next/image";
import Link from "next/link";

const { Dragger } = Upload;

const MainPage = () => {
  const props = {
    name: "file",
    multiple: true,
    action: "https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188",
    onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  return (
    <div className={styles.mainDiv}>
      <Row className={styles.rowDiv}>
        <Col className={styles.sideBar} span={6}>
          <div className={styles.sidebarTitle}>RECENTLY TRANSFERRED</div>
          <div className={styles.tabDiv}>
            <Tabs
              defaultActiveKey="1"
              centered
              items={new Array(2).fill(null).map((_, i) => {
                const id = String(i + 1);
                if (id == 1) {
                  return {
                    label: "Shared",
                    key: id,
                    children: "File you shared.",
                  };
                } else {
                  return {
                    label: "Received",
                    key: id,
                    children: "File you received.",
                  };
                }
              })}
            />
          </div>
          <div className={styles.bottomButtons}>
            <div className={styles.receiveviacodeBtnDiv}>
              <Button size="large" className={styles.receiveviacodeBtn}>
                RECEIVE VIA CODE
              </Button>
            </div>
            <div className={styles.refreshBtnDiv}>
              <Button type="primary" size="large" className={styles.refreshBtn}>
                REFRESH
              </Button>
            </div>
          </div>
        </Col>
        <Col className={styles.homeDiv} span={18}>
          <div className={styles.profileDiv}>
            <Link href="/profile">
              <Image
                src={userSolid}
                className={styles.user}
                alt="User"
                height={25}
                width={25}
              />
            </Link>
          </div>
          <div className={styles.homeDivTitle}>SECURE FILE SHARE</div>
          <div className={styles.dragger}>
            <Dragger {...props}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                Click or drag file to this area to upload
              </p>
              <p className="ant-upload-hint">
                Support for a single or bulk upload. Strictly prohibited from
                uploading company data or other banned files.
              </p>
            </Dragger>
            <div className={styles.uploadBtn}>
              <SuccessBtn>Upload</SuccessBtn>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default MainPage;
