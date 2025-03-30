import React from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Login from "./components/login/Login";
import Signup from "./components/signup/Signup";
import Home from "./components/home-table/Home";
import AddUser from "./components/add-userform/AddUser";
import PersistentDrawerLeft from "./components/sidebar/Layout";
import ErrorPage from "./components/pagenotfound/ErrorPage";
import ProductedRoutes from "./components/utils/ProductedRoutes";
import UserProfile from "./components/profile/UserProfile";

function App() {
  return (
    <Router>
      {" "}
      <AppLayout />
    </Router>
  );
}

function AppLayout() {
  const location = useLocation();

  // Hide sidebar on login and signup pages
  const hideSidebar =
    location.pathname === "/" || location.pathname === "/signup";

  const isLoggedIn = localStorage.getItem("loggedIn");
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div>
      {!hideSidebar && <PersistentDrawerLeft />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Route */}
        <Route element={<ProductedRoutes />}>
          <Route path="/home" element={<Home />} />
          <Route path="/add-user" element={<AddUser />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/add-user/:id" element={<AddUser />} />
        </Route>

        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </div>
  );
}

export default App;
