import React from "react";

import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import * as H from "history";
import { auth } from "../../firebase";

import styles from "./Header.module.scss";

interface PropTypes {
  history: H.History;
}

const Header: React.FC<PropTypes> = ({ history }) => {
  const handleSignOut = async () => {
    try {
      await auth.signOut();
      history.push("/");
    } catch (err) {
      alert(err.message);
    }
  };
  return (
    <div className={styles.root}>
      <AppBar position="static" className={styles.app_bar}>
        <Toolbar className={styles.tool_bar}>
          <Typography variant="h6" className={styles.title}>
            redux tool kit
          </Typography>
          <Button onClick={handleSignOut}>ログアウト</Button>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Header;
