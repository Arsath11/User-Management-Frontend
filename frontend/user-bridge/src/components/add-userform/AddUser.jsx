import React, { useState } from "react";

import "../login/Login_Style.css";

import RegistrationForm from "./RegistrationForm";

const AddUser = () => {
  const [userData, setUserData] = useState({
    userName: "",
    mobileNo: "",
    age: "",
    gender: "",
    address: "",
    email: "",
    country: "",
  });

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedLanguages, setSelectedLanguages] = useState([]);

  const label = { inputProps: { "aria-label": "Checkbox demo" } };
  return (
    <div style={{ marginLeft: "10px", marginRight: "10px" }}>
      <RegistrationForm
        userData={userData}
        setUserData={setUserData}
        setSelectedDate={setSelectedDate}
        setSelectedLanguages={setSelectedLanguages}
        selectedDate={selectedDate}
        selectedLanguages={selectedLanguages}
      />
    </div>
  );
};

export default AddUser;
