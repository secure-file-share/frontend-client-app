// import { Button } from "antd";
import SuccessBtn from "../components/successBtn";
// import styles from "../styles/profile.module.css";

export default function profile() {
  return (
    <div>
      Hello this is the profile page.
      <div>
        <h1>Button from ant design</h1>
        <SuccessBtn type="success">Update</SuccessBtn>
      </div>
    </div>
  );
}
