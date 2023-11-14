import { Button } from "antd";
import styles from "../styles/successBtn.module.css";

export default function SuccessBtn(props) {
  return (
    <Button
      type="success"
      className={styles.successBtn}
      style={props.style || null}
    >
      {props.children}
    </Button>
  );
}
