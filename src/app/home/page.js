"use client";
import styles from "../styles/home.module.css";
import React, { useState, useEffect } from "react";
import { InboxOutlined } from "@ant-design/icons";
import {
  Col,
  Row,
  message,
  Upload,
  Button,
  Tabs,
  Modal,
  Input,
  List,
  Divider,
  Popover,
} from "antd";
import SuccessBtn from "../components/successBtn";
import userSolid from "../../../public/user-solid.svg";
import Image from "next/image";
import Link from "next/link";

import { setAuth, setRefreshTimer } from "../../../authentication";
import { loadFromLocalStorage } from "../../../localStorage";
import { API_ROOT } from "../../../authentication";

import $ from "jquery";

const { Dragger } = Upload;

const MainPage = () => {
  function logout() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth");
      window.location.href = "/login";
    }
  }

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
  const [users, setUsers] = useState([]);
  const [filterUser, setFilterUser] = useState("");
  const [messageApi, contextHolder] = message.useMessage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [file, setFile] = useState(null);

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  function downloadFile(filename, ext, code) {
    fetch(`${API_ROOT}/api/fileshare/fileshare/${code}/`, {
      headers: {
        Authorization: `Bearer ${auth.access}`,
      },
    })
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

  function fetchUsers() {
    if (typeof window !== "undefined") {
      $.ajax({
        url: `${API_ROOT}/api/client/search/`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${auth.access}`,
        },
        data: {
          q: "",
        },
        success: (resp) => {
          if (resp.status) {
            let results = resp.results;
            for (let u of results) {
              if (u.username === user) {
                results.splice(results.indexOf(u), 1);
                break;
              }
            }
            setUsers(results);
          } else {
            console.log(resp);
          }
        },
        error: (err) => {
          console.log(err);
          messageApi.open({
            type: "error",
            content: "Unable to fetch users",
          });
        },
      });
    }
  }

  function fetchFiles() {
    if (typeof window !== "undefined") {
      $.ajax({
        url: `${API_ROOT}/api/fileshare/fileshare/`,
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
  }

  function deleteFile(id) {
    if (typeof window !== "undefined") {
      if (window.confirm("Are you sure you want to delete this file?"))
        $.ajax({
          url: `${API_ROOT}/api/fileshare/fileshare/${id}/`,
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
  }

  function uploadFile(username) {
    if (typeof window !== "undefined") {
      let formData = new FormData();

      formData.append("shared_to", username);
      formData.append("file", file.originFileObj);

      $.ajax({
        url: `${API_ROOT}/api/fileshare/fileshare/`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${auth.access}`,
        },
        data: formData,
        processData: false,
        contentType: false,
        success: (resp) => {
          if (resp.status) {
            messageApi.open({
              type: "success",
              content: "File shared",
            });
            setIsModalOpen(false);
          } else {
            console.log(resp);
            messageApi.open({
              type: "warning",
              content: "Unable to share",
            });
          }
          fetchFiles();
        },
        error: (err) => {
          console.log(err);
          messageApi.open({
            type: "error",
            content: "Unable to share",
          });
        },
      });
    }
  }

  const props = {
    name: "file",
    showUploadList: false,
    customRequest: () => {},
    onChange(info) {
      setFile(info.file);
      showModal(true);
    },
  };

  useEffect(() => {
    fetchFiles();
    fetchUsers();
  }, []);

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
                                <Popover
                                  placement="right"
                                  content={
                                    <>
                                      <small>
                                        {f.file.size.megabytes} MB
                                        <br />
                                        {f.file.ext} file
                                        <br />
                                        Shared to {f.shared_to.username} on{" "}
                                        {f.created_at.datetime}
                                        <br />
                                        Expires on {f.file.expiration.datetime}
                                      </small>
                                    </>
                                  }
                                  title="More info"
                                  trigger="click"
                                >
                                  <small className={styles.downloadBtn}>
                                    More info
                                  </small>
                                </Popover>
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
                                <Popover
                                  placement="right"
                                  content={
                                    <>
                                      <small>
                                        {f.file.size.megabytes} MB
                                        <br />
                                        {f.file.ext} file
                                        <br />
                                        Shared by {f.shared_by.username} on{" "}
                                        {f.created_at.datetime}
                                        <br />
                                        Expires on {f.file.expiration.datetime}
                                      </small>
                                    </>
                                  }
                                  title="More info"
                                  trigger="click"
                                >
                                  <small className={styles.downloadBtn}>
                                    More info
                                  </small>
                                </Popover>
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
          <div>
            <Dragger {...props}>
              <div className={styles.dragger}>
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">
                  Click or drag file to this area to upload
                </p>
              </div>
            </Dragger>
            {/* <div className={styles.uploadBtn}>
              <SuccessBtn onClick={showModal}>Upload</SuccessBtn>
            </div> */}
          </div>
        </Col>
      </Row>
      <Modal
        title={`Share ${
          file
            ? file.name.length > 20
              ? `${file.name.substring(0, 20)}...`
              : file.name
            : null
        } with...`}
        footer={null}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Input
          placeholder="Filter user by username..."
          onChange={(e) => setFilterUser(e.target.value)}
          value={filterUser}
        />
        <Divider />
        <List
          size="large"
          bordered
          dataSource={
            filterUser
              ? users.filter(
                  (user) =>
                    user.username
                      .toLowerCase()
                      .indexOf(filterUser.toLowerCase()) !== -1
                )
              : users
          }
          renderItem={(user) => (
            <List.Item>
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  {user.username}
                  <br />
                  <small>{user.email}</small>
                </div>
                <div>
                  <Button
                    size="sm"
                    onClick={() => {
                      showModal(false);
                      uploadFile(user.username);
                    }}
                  >
                    Share
                  </Button>
                </div>
              </div>
            </List.Item>
          )}
        />
      </Modal>
    </div>
  );
};

export default MainPage;
