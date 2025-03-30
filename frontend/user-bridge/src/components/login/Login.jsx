import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import "./Login_Style.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import bcrypt from "bcryptjs";
import { ToastContainer, toast } from "react-toastify";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const Login = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });
  const [active, setActive] = useState(false);
  const [passwordText, setPasswordText] = useState("password");

  const [userList, setUserList] = useState([]);
  useEffect(() => {
    const getDatas = async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_USER_API_URI}` + `/api/users/`
      );
      const user = response?.data;
      setUserList(user);
    };
    getDatas();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const user = userList.find((data) => data.email === userData?.email);

    if (!user) {
      return toast.error("User not found. Sign up now.");
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(userData?.password, user.password);

    if (isMatch) {
      toast.success(`Login successful, ${user?.userName}`);
      localStorage.setItem("loggedIn", true);
      localStorage.setItem("user", JSON.stringify(user));
      setUserData({
        email: "",
        password: "",
      });
      setTimeout(() => {
        navigate("/home");
      }, 2000);
    } else {
      toast.error(`Authentication failed. Please check your login details`);
    }
  };

  return (
    <div>
      <ToastContainer />
      <div className="cards">
        <form className="form" onSubmit={handleSubmit}>
          <div>
            <h3 className="heading_text">LOGIN</h3>
            <TextField
              label="Email"
              name="email"
              value={userData?.email}
              variant="standard"
              fullWidth
              onChange={handleChange}
              required
            />
          </div>
          <div style={{ position: "relative", display: "inline-block" }}>
            <TextField
              label="Password"
              variant="standard"
              name="password"
              type={passwordText}
              onChange={handleChange}
              value={userData?.password}
              fullWidth
              required
              onFocus={() => setActive(true)}
              onBlur={(e) => {
                if (
                  !e.relatedTarget ||
                  e.relatedTarget.className !== "password_show"
                ) {
                  setActive(false);
                }
              }}
            />

            {userData?.password && active && (
              <p
                className="password_show"
                tabIndex={0}
                style={{
                  position: "absolute",
                  bottom: "20px",
                  left: "265px",
                  cursor: "pointer",
                  userSelect: "none",
                }}
                onMouseDown={(e) => {
                  e.preventDefault();
                  setPasswordText(
                    passwordText === "password" ? "text" : "password"
                  );
                }}
              >
                {passwordText === "password" ? (
                  <AiOutlineEye size={20} />
                ) : (
                  <AiOutlineEyeInvisible size={20} />
                )}
              </p>
            )}
          </div>

          <div style={{ textAlign: "end" }}>
            <span>New user?</span>{" "}
            <span
              onClick={() => navigate("/signup")}
              style={{
                textAlign: "end",
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              Sign Up
            </span>
          </div>

          <Button type="submit" color="primary" className="form__custom-button">
            Submit
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
