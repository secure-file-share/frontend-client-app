"use client";
import styles from "../styles/home.module.css";
import { useState } from "react";
import { InboxOutlined } from "@ant-design/icons";
import { Col, Row, message, Upload, Button, Tabs } from "antd";
import SuccessBtn from "../components/successBtn";
import React from "react";
import userSolid from "../../../public/user-solid.svg";
import Image from "next/image";
import Link from "next/link";

import { setAuth, setRefreshTimer } from "../../../authentication";
import { loadFromLocalStorage } from "../../../localStorage";

import $ from "jquery";
import { headers } from "../../../next.config";

const { Dragger } = Upload;

const MainPage = () => {
  function logout() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth");
      window.location.href = "/login";
    }
  }

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

  // const [user, setUser] = useState("Who am I?");

  let auth = loadFromLocalStorage("auth");
  let user = "Who am I?";

  if (auth) {
    setAuth(auth);
    setRefreshTimer(auth.refresh);
    // setUser(auth.user.username);
    user = auth.user.username;
  } else {
    logout();
  }

  const [files, setFiles] = useState({
    shared_with_you: [],
    shared_by_you: [],
  });

  const [messageApi, contextHolder] = message.useMessage();

  function downloadFile(filename, ext, code) {
    fetch(
      `https://securefileshare.pythonanywhere.com/api/fileshare/fileshare/${code}/`,
      {
        headers: {
          Authorization: `Bearer ${auth.access}`,
        },
      }
    )
      .then((resp) => resp.blob())
      .then((blob) => {
        if (typeof window !== "undefined") {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.style.display = "none";
          a.href = url;
          a.download = `${filename}.${ext}`;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
        }
      })
      .catch((err) => {
        console.log(err);

        messageApi.open({
          type: "error",
          content: "Unable to download",
        });
      });
  }

  function fetchFiles() {
    $.ajax({
      url: "https://securefileshare.pythonanywhere.com/api/fileshare/fileshare/",
      method: "GET",
      headers: {
        Authorization: `Bearer ${auth.access}`,
      },
      success: (resp) => {
        if (resp.status) {
          setFiles(resp.results);
        } else {
          console.log(resp);
        }
      },
      error: (err) => {
        console.log(err);
        messageApi.open({
          type: "error",
          content: "Unable to fetch files",
        });
      },
    });
  }

  function deleteFile(id) {
    if (window.confirm("Are you sure you want to delete this file?"))
      $.ajax({
        url: `https://securefileshare.pythonanywhere.com/api/fileshare/fileshare/${id}/`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${auth.access}`,
        },
        success: (resp) => {
          if (resp.status) {
            fetchFiles();
            messageApi.open({
              type: "success",
              content: "File deleted",
            });
          } else {
            console.log(resp);
          }
        },
        error: (err) => {
          console.log(err);
          messageApi.open({
            type: "error",
            content: "Unable to fetch files",
          });
        },
      });
  }

  fetchFiles();

  return (
    <div className={styles.mainDiv}>
      {contextHolder}
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
                    children: (
                      <div>
                        {files.shared_by_you.length > 0 ? (
                          files.shared_by_you.map((f, index) => (
                            <div key={index} className={styles.fileDiv}>
                              <div>
                                <small>{index + 1}. </small>
                                {f.file.name.length > 10
                                  ? `${f.file.name.substring(0, 10)}...`
                                  : f.file.name}
                                <br />
                                <small>
                                  {f.file.size.megabytes} MB, {f.file.ext}
                                  <br />
                                  <small>
                                    <i>
                                      Shared to {f.shared_to.username} on{" "}
                                      {f.created_at.datetime}
                                    </i>
                                  </small>
                                </small>
                              </div>
                              <div>
                                <small
                                  className={styles.downloadBtn}
                                  onClick={() =>
                                    downloadFile(
                                      f.file.name,
                                      f.file.ext,
                                      f.unique_code
                                    )
                                  }
                                >
                                  Download
                                </small>
                                <br />
                                <small
                                  className={styles.downloadBtn}
                                  onClick={() => deleteFile(f.id)}
                                >
                                  Delete
                                </small>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div style={{ padding: "1rem" }}>
                            Files you shared
                          </div>
                        )}
                      </div>
                    ),
                  };
                } else {
                  return {
                    label: "Received",
                    key: id,
                    children: (
                      <div>
                        {files.shared_with_you.length > 0 ? (
                          files.shared_with_you.map((f, index) => (
                            <div key={index} className={styles.fileDiv}>
                              <div>
                                <small>{index + 1}. </small>
                                {f.file.name.length > 10
                                  ? `${f.file.name.substring(0, 10)}...`
                                  : f.file.name}
                                <br />
                                <small>
                                  {f.file.size.megabytes} MB, {f.file.ext}
                                  <br />
                                  <small>
                                    <i>
                                      Shared by {f.shared_by.username} on{" "}
                                      {f.created_at.datetime}
                                    </i>
                                  </small>
                                </small>
                              </div>
                              <div>
                                <small
                                  className={styles.downloadBtn}
                                  onClick={() =>
                                    downloadFile(
                                      f.file.name,
                                      f.file.ext,
                                      f.unique_code
                                    )
                                  }
                                >
                                  Download
                                </small>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div style={{ padding: "1rem" }}>
                            Files you received.
                          </div>
                        )}
                      </div>
                    ),
                  };
                }
              })}
            />
          </div>
          <div className={styles.bottomButtons}>
            <div className={styles.refreshBtnDiv}>
              <Button
                type="primary"
                size="large"
                className={styles.refreshBtn}
                onClick={() => {
                  fetchFiles();
                  messageApi.open({
                    type: "success",
                    content: "Files fetched",
                  });
                }}
              >
                REFRESH FILES
              </Button>
            </div>
            {/* <br />
            <div className={styles.receiveviacodeBtnDiv}>
              <Button size="large" className={styles.receiveviacodeBtn}>
                RECEIVE VIA CODE
              </Button>
            </div> */}
          </div>
        </Col>
        <Col className={styles.homeDiv} span={18}>
          <div className={styles.profileDiv}>
            <SuccessBtn onClick={logout}>Log Out</SuccessBtn>
            <div style={{ marginLeft: "1rem" }}>
              <Link
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "black",
                }}
                href="/profile"
              >
                <Image
                  src={userSolid}
                  className={styles.user}
                  alt="User"
                  height={20}
                  width={20}
                />
                {user}
              </Link>
            </div>
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
