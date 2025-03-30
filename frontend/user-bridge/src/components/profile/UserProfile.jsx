import React, { useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import "../login/Login_Style.css";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const UserProfile = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("user");
    toast.success("You have been successfully logged out.");
    setTimeout(() => {
      navigate("/");
    }, 2000);
  };
  return (
    <>
      <ToastContainer />
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <Card sx={{ width: 275, background: "gainsboro" }}>
          <CardContent>
            {" "}
            {/* Center the content */}
            <h2
              gutterBottom
              style={{ textAlign: "center" }}
              sx={{ color: "text.secondary", fontSize: 14 }}
            >
              Profile
            </h2>
            <p variant="h5" component="div"></p>
            <h3 variant="body2">
              {user?.userName}
              <br />
            </h3>
            <h3 variant="body2">
              {user?.email}
              <br />
            </h3>
          </CardContent>
          <CardActions style={{ justifyContent: "center" }}>
            {" "}
            {/* Center the button */}
            <Button
              type="submit"
              style={{ color: "white" }}
              className="add_user_form"
              onClick={handleClickOpen}
            >
              Logout
            </Button>
          </CardActions>
        </Card>
      </div>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Log Out?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Are you sure you want to log out?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleLogout} autoFocus>
            Log Out
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UserProfile;
