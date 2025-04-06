import React, { useEffect, useState } from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { FaUsers, FaUser } from "react-icons/fa";
import { IoIosLogOut } from "react-icons/io";
import { FiUserPlus } from "react-icons/fi";

import Paper from "@mui/material/Paper";

import UserTable from "./UserTable";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import axios from "axios";

const Home = () => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [searchValues, setSearchValues] = useState("");
  const [userList, setUserList] = useState([]);
  const [filteredArr, setFilteredArr] = useState([]);

  useEffect(() => {
    const getDatas = async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_USER_API_URI}` + `/api/add-user/`
      );
      const user = response?.data;

      setUserList(user);
      // setFilteredArr(user);
    };

    getDatas();
  }, [searchValues]);
  const navigate = useNavigate();
  const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
    ({ theme }) => ({
      flexGrow: 1,
      padding: theme.spacing(3),
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      marginLeft: `-${drawerWidth}px`,
      variants: [
        {
          props: ({ open }) => open,
          style: {
            transition: theme.transitions.create("margin", {
              easing: theme.transitions.easing.easeOut,
              duration: theme.transitions.duration.enteringScreen,
            }),
            marginLeft: 0,
          },
        },
      ],
    })
  );

  const drawerWidth = 240;
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("user");
    setTimeout(() => {
      navigate("/");
    }, 2000);
  };

  const menuItems = [
    { text: "Users Details", icon: <FaUsers />, path: "/home" },
    { text: "Add User", icon: <FiUserPlus />, path: "/add-user" },
    { text: "Profile", icon: <FaUser />, path: "/profile" },
    { text: "Logout", path: "#", icon: <IoIosLogOut />, action: handleLogout },
  ];
  const handleDrawerClose = () => {
    setOpen(false);
  };
  const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: "flex-end",
  }));
  const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== "open",
  })(({ theme }) => ({
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    variants: [
      {
        props: ({ open }) => open,
        style: {
          width: `calc(100% - ${drawerWidth}px)`,
          marginLeft: `${drawerWidth}px`,
          transition: theme.transitions.create(["margin", "width"], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
          }),
        },
      },
    ],
  }));

  const handleSearchValues = (event) => {
    let values = event.target.value;

    setSearchValues(values);

    if (!values.trim()) {
      // If the input is empty, reset to full userList
      setFilteredArr([...userList]);
      return;
    }
    const filteredValues = userList?.filter(
      (data) =>
        data?.userName?.toLowerCase()?.trim() == values?.toLowerCase()?.trim()
    );

    if (filteredValues) {
      return setFilteredArr(filteredValues);
    }
  };

  return (
    <div>
      <Button
        onClick={() => navigate("/add-user")}
        variant="contained"
        style={{ marginBottom: "20px", marginLeft: "20px" }}
        className="add_user_form"
        color="primary"
      >
        Add User
      </Button>
      <span className="input-container">
        <input
          style={{ marginBottom: "20px", marginLeft: "20px" }}
          type="search"
          name=""
          className="input-search"
          value={searchValues}
          placeholder="Search..."
          id=""
          onChange={handleSearchValues}
        />
      </span>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar position="fixed" open={open}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={[
                {
                  mr: 2,
                },
                open && { display: "none" },
              ]}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              User Management
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
          variant="persistent"
          anchor="left"
          open={open}
        >
          <DrawerHeader>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === "ltr" ? (
                <ChevronLeftIcon />
              ) : (
                <ChevronRightIcon />
              )}
            </IconButton>
          </DrawerHeader>
          <Divider />
          <List>
            {menuItems.map(({ text, path, icon, action }) => (
              <ListItem key={text} disablePadding>
                <ListItemButton
                  onClick={() => {
                    if (text === "Logout" && action) {
                      action();
                    } else {
                      navigate(path);
                      setOpen(false);
                    }
                  }}
                >
                  <ListItemIcon>{icon}</ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider />
        </Drawer>

        <Main open={open}>
          <Typography>
            <Paper sx={{ height: 300, width: "100%" }}>
              <UserTable
                userList={userList}
                setUserList={setUserList}
                filteredArr={filteredArr}
                setFilteredArr={setFilteredArr}
                searchValues={searchValues}
              />
            </Paper>
          </Typography>
        </Main>
      </Box>
    </div>
  );
};

export default Home;
