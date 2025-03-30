import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import "../login/Login_Style.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import bcrypt from "bcryptjs";
import { toast, ToastContainer } from "react-toastify";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const Signup = () => {
  const navigate = useNavigate();
  const [active, setActive] = useState(false);
  const [confirmPasswordActive, setConfirmPasswordActive] = useState(false);
  const [passwordText, setPasswordText] = useState("password");
  const [confirmPasswordText, setConfirmPasswordText] = useState("password");
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [usersList, setUserList] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_USER_API_URI}` + `/api/users/`
      );
      const user = response?.data;
      setUserList(user);
    };
    getData();
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
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData?.password, salt);
      const addValues = {
        userName: userData?.name,
        email: userData?.email,
        password: hashedPassword,
      };

      if (userData?.password !== userData?.confirmPassword) {
        return toast.error("Confirm password and Password must be the same.");
      }

      if (userData?.password.length < 6) {
        return toast.error("Password should be at least 6 characters");
      }

      const duplicateEmail = usersList?.find(
        (data) => data?.email === userData?.email
      );
      if (duplicateEmail) {
        return toast.error(
          "Email already exists. Please use a different email."
        );
      }
      await axios
        .post((`${import.meta.env.VITE_USER_API_URI}`+`/api/users/`), addValues)
        .then(() => {
          toast.success("Account created successfully!");
          setUserData({
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
          });
          setTimeout(() => {
            navigate("/");
          }, 2000);
        })
        .catch((err) => {
          toast.error("Failed to create account. Please retry");
        });
    } catch (error) {
      toast.error(`Error ${error.message}`);
    }
  };
  return (
    <div>
      <ToastContainer />
      <div className="cards">
        <form className="form" onSubmit={handleSubmit}>
          <div>
            <h3 className="heading_text">SIGN UP</h3>

            <TextField
              name="name"
              label="Name"
              variant="standard"
              fullWidth
              value={userData.name}
              onChange={handleChange}
              required
            />
            <TextField
              name="email"
              label="Email"
              variant="standard"
              value={userData.email}
              fullWidth
              onChange={handleChange}
              required
            />
          </div>
          <div style={{ position: "relative", display: "inline-block" }}>
            <TextField
              name="password"
              label="Password"
              onChange={handleChange}
              type={passwordText}
              value={userData.password}
              variant="standard"
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
                  right: "10px",
                  bottom: "25px",
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
          <div style={{ position: "relative", display: "inline-block" }}>
            <TextField
              name="confirmPassword"
              label="Confirm Password"
              type={confirmPasswordText}
              variant="standard"
              value={userData.confirmPassword}
              onChange={handleChange}
              fullWidth
              onFocus={() => setConfirmPasswordActive(true)}
              onBlur={(e) => {
                if (
                  !e.relatedTarget ||
                  e.relatedTarget.className !== "password_show"
                ) {
                  setConfirmPasswordActive(false);
                }
              }}
              required
            />

            {userData.confirmPassword && confirmPasswordActive && (
              <p
                className="password_show"
                tabIndex={0}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "24px",
                  cursor: "pointer",
                  userSelect: "none",
                }}
                onMouseDown={(e) => {
                  e.preventDefault();
                  setConfirmPasswordText(
                    confirmPasswordText === "password" ? "text" : "password"
                  );
                }}
              >
                {confirmPasswordText === "password" ? (
                  <AiOutlineEye size={20} />
                ) : (
                  <AiOutlineEyeInvisible size={20} />
                )}
              </p>
            )}
          </div>

          <div style={{ textAlign: "end" }}>
            <p>
              Already have an account?{" "}
              <span
                style={{
                  textAlign: "end",
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
                onClick={() => navigate("/")}
              >
                Login
              </span>{" "}
            </p>
          </div>
          <Button type="submit" color="primary" className="form__custom-button">
            Submit
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
