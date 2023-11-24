// import { Button } from "antd";
"use client";
import React, { useState } from "react";
import SuccessBtn from "../components/successBtn";
import styles from "../styles/profile.module.css";
import userSolid from "../../../public/user-solid.svg";
import Image from "next/image";
import { Input, Tooltip, Button, Modal } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import Link from "next/link";

const Profile = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const [details, setDetails] = useState({
    username: "aashirwad43",
    firstname: "aashirwad",
    lastname: "shrestha",
    email: "aashirwad43@gmail.com",
  });

  return (
    <div className={styles.outerDiv}>
      <div className={styles.mainDiv}>
        <div className={styles.userImage}>
          <Image
            src={userSolid}
            className={styles.user}
            alt="User"
            height={80}
            width={80}
          />
        </div>
        <div className={styles.labels}>
          <Input
            placeholder="Username"
            size="large"
            suffix={
              <Tooltip title="Enter your username">
                <InfoCircleOutlined
                  style={{
                    color: "rgba(0,0,0,.45)",
                  }}
                />
              </Tooltip>
            }
            value={details.username}
            onChange={(event) => {
              setDetails((prev) => ({
                ...prev,
                username: event.target.value,
              }));
            }}
          />
        </div>
        <div className={styles.labels}>
          <Input
            value={details.firstname}
            onChange={(event) => {
              setDetails((prev) => ({
                ...prev,
                firstname: event.target.value,
              }));
            }}
            placeholder="First Name"
            size="large"
          />
        </div>
        <div className={styles.labels}>
          <Input
            value={details.lastname}
            onChange={(event) => {
              setDetails((prev) => ({
                ...prev,
                lastname: event.target.value,
              }));
            }}
            placeholder="Last Name"
            size="large"
          />
        </div>
        <div className={styles.labels}>
          <Input
            value={details.email}
            onChange={(event) => {
              setDetails((prev) => ({
                ...prev,
                email: event.target.value,
              }));
            }}
            placeholder="Email Address"
            size="large"
          />
        </div>
        <div className={styles.buttonDiv}>
          <Button onClick={showModal}>Change Password</Button>
          <SuccessBtn>Update</SuccessBtn>
          <Link href="/home">
            <Button>Back</Button>
          </Link>
        </div>
      </div>
      <Modal
        title="Change Password"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
        centered
      >
        <div className={styles.labels}>
          <Input placeholder="New Password" size="large" />
        </div>
        <div className={styles.labels}>
          <Input placeholder="Retype New Password" size="large" />
        </div>
        <div className={styles.buttonDiv}>
          <SuccessBtn>Update Password</SuccessBtn>
        </div>
      </Modal>
    </div>
  );
};

export default Profile;
