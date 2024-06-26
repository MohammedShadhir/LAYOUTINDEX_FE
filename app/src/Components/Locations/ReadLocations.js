import React, { useState, useEffect } from "react";
import axios from "axios";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Link } from "react-router-dom";
import { Box } from "@mui/material";
import { useAuth0 } from "@auth0/auth0-react";

function ReadLocations() {
  const [locations, setLocations] = useState([]);
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    fetchLocations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchLocations = async () => {
    try {
      const token = await getAccessTokenSilently();
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/locations`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setLocations(response.data);
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };

  const deleteLocation = async (locationId) => {
    const token = await getAccessTokenSilently();
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/locations/${locationId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setLocations(locations.filter((location) => location._id !== locationId));
    } catch (error) {
      console.error("Error deleting location:", error);
    }
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "50px",
          color: "#2196f3",
        }}
      >
        <h1>LOCATIONS</h1>
        <Link
          to="/addlocation"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <h1>ADD</h1>
        </Link>
      </Box>

      <Box>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Devices</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {locations.map((location) => (
                <TableRow key={location._id}>
                  <TableCell>{location.name}</TableCell>
                  <TableCell>{location.address}</TableCell>
                  <TableCell>{location.phone}</TableCell>
                  <TableCell>
                    {location.devices.map((device, index) => (
                      <div key={index}>{device.serialNumber}</div>
                    ))}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      component={Link}
                      to={`/editlocation/${location._id}`}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => deleteLocation(location._id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}

export default ReadLocations;
