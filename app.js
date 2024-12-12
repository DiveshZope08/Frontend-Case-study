// npm install react-router-dom @mui/material @emotion/react @emotion/styled axios leaflet react-leaflet

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Box, Card, CardContent, Typography, Button, TextField, CircularProgress } from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';

const API_URL = "https://jsonplaceholder.typicode.com/users";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ProfileList />} />
        <Route path="/profile/:id" element={<ProfileDetail />} />
      </Routes>
    </Router>
  );
};

const ProfileList = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios.get(API_URL)
      .then((response) => {
        setProfiles(response.data);
        setLoading(false);
      })
      .catch((error) => console.error(error));
  }, []);

  const filteredProfiles = profiles.filter(profile =>
    profile.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box p={2}>
      <Typography variant="h4" gutterBottom>Profile List</Typography>
      <TextField
        fullWidth
        label="Search Profiles"
        variant="outlined"
        margin="normal"
        onChange={(e) => setSearch(e.target.value)}
      />
      {loading ? (
        <CircularProgress />
      ) : (
        <Box display="flex" flexWrap="wrap" gap={2}>
          {filteredProfiles.map(profile => (
            <Card key={profile.id} style={{ width: 300 }}>
              <CardContent>
                <Typography variant="h6">{profile.name}</Typography>
                <Typography variant="body2" color="textSecondary">{profile.email}</Typography>
                <Button variant="contained" color="primary" style={{ marginTop: 10 }}>
                  <Link to={`/profile/${profile.id}`} style={{ color: 'white', textDecoration: 'none' }}>View Details</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
};

const ProfileDetail = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mapCenter, setMapCenter] = useState({ lat: 0, lng: 0 });

  const profileId = window.location.pathname.split("/").pop();

  useEffect(() => {
    axios.get(`${API_URL}/${profileId}`)
      .then((response) => {
        setProfile(response.data);
        setMapCenter({
          lat: parseFloat(response.data.address.geo.lat),
          lng: parseFloat(response.data.address.geo.lng),
        });
        setLoading(false);
      })
      .catch((error) => console.error(error));
  }, [profileId]);

  if (loading) return <CircularProgress />;

  return (
    <Box p={2}>
      <Typography variant="h4" gutterBottom>{profile.name}</Typography>
      <Typography variant="body1">{profile.email}</Typography>
      <Typography variant="body1">{profile.phone}</Typography>
      <Typography variant="body1">{profile.website}</Typography>
      <Typography variant="body1">Address: {profile.address.street}, {profile.address.city}</Typography>

      <Box mt={3} style={{ height: "400px" }}>
        <MapContainer center={mapCenter} zoom={13} style={{ height: "100%", width: "100%" }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={mapCenter}>
            <Popup>{profile.name}'s Location</Popup>
          </Marker>
        </MapContainer>
      </Box>
    </Box>
  );
};

export default App;
