// import { Button } from "antd";
import SuccessBtn from "../components/successBtn";
import styles from "../styles/profile.module.css";
import userSolid from "../../../public/user-solid.svg";
import Image from "next/image";
import { Input, Tooltip, Button } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";

const Profile = () => {
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
        <div className={styles.labels}>
          <Input placeholder="First Name" size="large" />
        </div>
        <div className={styles.labels}>
          <Input placeholder="Last Name" size="large" />
        </div>
        <div className={styles.labels}>
          <Input placeholder="Email Address" size="large" />
        </div>
        <div className={styles.buttonDiv}>
          <SuccessBtn>Update</SuccessBtn>
          <Button>Change Password</Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
