import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { CiEdit } from "react-icons/ci";
import { AiOutlineDelete } from "react-icons/ai";
import { toast, ToastContainer } from "react-toastify";
import Slide from "@mui/material/Slide";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const UserTable = () => {
  const [userList, setUserList] = useState([]);
  const [open, setOpen] = useState(false);
  const [rowId, setRowId] = useState("");

  useEffect(() => {
    const getDatas = async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_USER_API_URI}` + `/api/add-user/`
      );
      const user = response?.data;
      setUserList(user);
    };

    getDatas();
  }, []);
  const columns = [
    {
      field: "serialNumber",
      headerName: "S.No",
      width: 100,
      renderCell: (params) => {
        const rowIndex = params.api.getRowIndexRelativeToVisibleRows(params.id);
        return rowIndex != null ? rowIndex + 1 : "";
      },
    },
    { field: "userName", headerName: "User Name", width: 150 },
    { field: "mobileNo", headerName: "Mobile No", width: 150 },
    { field: "email", headerName: "Email", width: 250 },
    { field: "age", headerName: "Age", width: 20 },
    { field: "country", headerName: "Country", width: 150 },

    {
      field: "Action",
      headerName: "Actions",
      type: "number",
      width: 120,
      renderCell: (params) => (
        <div>
          <CiEdit
            size={25}
            onClick={() => handleUpdate(params.row)}
            style={{ cursor: "pointer", position: "relative", right: "10px" }}
          />
          <AiOutlineDelete
            size={25}
            onClick={() => handleDelete(params.row)}
            style={{ cursor: "pointer" }}
          />
        </div>
      ),
    },
  ];
  const paginationModel = { page: 0, pageSize: 5 };
  const navigate = useNavigate();

  const handleUpdate = (row) => {
    navigate(`/add-user/${row?._id}`);
  };
  const handleDelete = async (row) => {
    setOpen(true);
    setRowId(row?._id);
  };

  const deleteConfirmation = async () => {
    const deleteUser = await axios.delete(
      `${import.meta.env.VITE_USER_API_URI}` + `/api/add-user/` + `${rowId}`
    );
    if (deleteUser) {
      toast.success("Successfully deleted!");
    }

    const deleteID = userList?.filter((data) => data?._id !== rowId);
    setUserList(deleteID);
    setOpen(false);
    setRowId(null);
  };
  return (
    <div>
      <ToastContainer />
      <Button
        onClick={() => navigate("/add-user")}
        variant="contained"
        className="add_user_form"
        color="primary"
      >
        Add User
      </Button>

      <DataGrid
        rows={userList}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10]}
        sx={{
          border: 0,
          width: "100%",
          overflowX: "auto", // Enables horizontal scrolling if needed
          "& .MuiDataGrid-root": {
            fontSize: "14px", // Adjust font size for better readability
          },
        }}
        getRowId={(row) => row._id}
      />

      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => setOpen(false)}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Delete?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Are you sure you want to delete?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={deleteConfirmation} autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default UserTable;
