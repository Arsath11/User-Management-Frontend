import React, { useEffect } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

import { Box, Grid } from "@mui/material";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Checkbox from "@mui/material/Checkbox";
import FormGroup from "@mui/material/FormGroup";
import dayjs from "dayjs";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

const RegistrationForm = ({
  userData,
  setUserData,
  setSelectedLanguages,
  setSelectedDate,
  selectedDate,
  selectedLanguages,
}) => {
  const navigate = useNavigate();
  const { id } = useParams();

  const getData = async () => {
    if (id) {
      axios
        .get(
          `${import.meta.env.VITE_USER_API_URI}` + `/api/add-user/` + `${id}`
        )
        .then((response) => {
          setUserData(response.data);

          setSelectedDate(dayjs(response.data.dateofBirth));
          setSelectedLanguages(response.data.languages);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    } else {
      console.log("error");
    }
  };
  useEffect(() => {
    getData();
  }, [id]);
  const handleChange = (event) => {
    const { name, value } = event.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const handleDateValue = (newValue) => {
    if (newValue && dayjs.isDayjs(newValue)) {
      const formattedDate = newValue.format("YYYY-MM-DD");
      setSelectedDate(newValue);
      console.log(formattedDate);
    } else {
      setSelectedDate(null);
    }
  };
  const handleLanguageChange = (event) => {
    const { value, checked } = event.target;
    setSelectedLanguages((prev) => {
      if (checked) {
        return prev.includes(value) ? prev : [...prev, value];
      } else {
        return prev.filter((lang) => lang !== value);
      }
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const addValues = {
      userName: userData?.userName,
      mobileNo: userData?.mobileNo,
      age: userData?.age,
      country: userData?.country,
      gender: userData?.gender,
      address: userData?.address,
      email: userData?.email,
      dateofBirth: selectedDate || "",
      languages: selectedLanguages || [],
    };

    if (id) {
      await axios
        .put(
          `${import.meta.env.VITE_USER_API_URI}` + `/api/add-user/` + `${id}`,
          addValues
        )
        .then(() => {
          toast.success("Successfully updated!");
        });

      setTimeout(() => {
        navigate("/home");
      }, 2000);
    } else {
      await axios
        .post(
          `${import.meta.env.VITE_USER_API_URI}` + `/api/add-user/`,
          addValues
        )
        .then(() => {
          toast.success("Successfully added!");
          setTimeout(() => {
            navigate("/home");
          }, 2000);
          setUserData({
            userName: "",
            mobileNo: "",
            age: "",
            gender: "",
            country: "",
            address: "",
            email: "",
          });
        })

        .catch((err) => {
          console.log(err.message);
        });
    }
  };

  return (
    <div>
      <ToastContainer />
      <Box
        sx={{
          maxWidth: 600,
          borderRadius: 2,
          p: 2,
          m: "auto",

          background: "gainsboro",
          boxShadow: 3,
          mb: 3,
        }}
        noValidate
        autoComplete="off"
      >
        <form onSubmit={handleSubmit}>
          <h2 align="center" gutterBottom>
            Registration Form
          </h2>

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                required
                id="name"
                value={userData?.userName}
                label="Name"
                onChange={handleChange}
                name="userName"
                variant="outlined"
                fullWidth
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Mobile No"
                type="number"
                value={userData?.mobileNo}
                onChange={handleChange}
                name="mobileNo"
                variant="outlined"
                fullWidth
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Email"
                required
                name="email"
                value={userData?.email}
                type="email"
                onChange={handleChange}
                variant="outlined"
                fullWidth
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  required
                  onChange={handleDateValue}
                  label="Date of Birth"
                  value={selectedDate}
                  renderInput={(params) => (
                    <TextField {...params} variant="outlined" fullWidth />
                  )}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12}>
              <FormControl
                style={{ width: "100px" }}
                variant="outlined"
                fullWidth
              >
                <InputLabel id="age-label">Age</InputLabel>

                <Select
                  onChange={handleChange}
                  labelId="age-label"
                  id="age"
                  value={userData?.age}
                  label="Age"
                  name="age"
                >
                  <MenuItem value={21}>21</MenuItem>
                  <MenuItem value={22}>22</MenuItem>
                  <MenuItem value={23}>23</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl
                style={{ width: "100px" }}
                variant="outlined"
                value={userData?.country}
                fullWidth
              >
                <InputLabel id="age-label">Country</InputLabel>

                <Select
                  onChange={handleChange}
                  labelId="age-label"
                  id="country"
                  value={userData?.country}
                  label="Country"
                  name="country"
                >
                  <MenuItem value={"India"}>India</MenuItem>
                  <MenuItem value={"UAE"}>UAE</MenuItem>
                  <MenuItem value={"USA"}>USA</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl
                component="fieldset"
                fullWidth
                onChange={handleLanguageChange}
              >
                <FormLabel component="legend">Select Your Languages</FormLabel>
                <FormGroup row>
                  {["Tamil", "English", "Hindi"].map((language) => (
                    <FormControlLabel
                      key={language}
                      control={
                        <Checkbox
                          value={language}
                          checked={selectedLanguages.includes(language)}
                          onChange={handleLanguageChange}
                        />
                      }
                      label={language}
                    />
                  ))}
                </FormGroup>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl
                name="gender"
                component="fieldset"
                value={userData?.gender}
                required
                fullWidth
                onChange={handleChange}
              >
                <FormLabel component="legend">Gender</FormLabel>
                <RadioGroup row name="gender">
                  <FormControlLabel
                    value="male"
                    checked={userData?.gender === "male" ? true : false}
                    control={<Radio />}
                    label="Male"
                  />
                  <FormControlLabel
                    value="female"
                    checked={userData?.gender === "female" ? true : false}
                    control={<Radio />}
                    label="Female"
                  />
                  <FormControlLabel
                    value="other"
                    control={<Radio />}
                    checked={userData?.gender === "other" ? true : false}
                    label="Other"
                  />
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextareaAutosize
                minRows={3}
                placeholder="Enter Address..."
                name="address"
                value={userData?.address}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  paddingLeft: "12px",
                  paddingTop: "12px",
                  borderRadius: "4px",
                  borderColor: "#ccc",
                  resize: "vertical",
                  outline: "none",
                }}
              />
            </Grid>
          </Grid>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Button
              type="submit"
              variant="contained"
              className="add_user_form"
              color="primary"
            >
              Submit
            </Button>
          </div>
        </form>
      </Box>
    </div>
  );
};

export default RegistrationForm;
