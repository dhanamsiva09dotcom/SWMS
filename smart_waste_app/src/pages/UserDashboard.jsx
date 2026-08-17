import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { onValue, push, ref, remove } from "firebase/database";
import MapView from "../components/MapView";
import { db } from "../firebase/firebaseConfig";
import {
  ADMIN_LOCATION,
  DEFAULT_USER_LOCATION,
  formatDateTime,
  getLatestBinSnapshot,
  sortBinsByDistance,
} from "../utils/distance";

const issueOptions = [
  "Damaged lid",
  "Broken wheel",
  "Sensor issue",
  "Overflowing bin",
  "Bad smell",
];

const statusColor = {
  pending: "warning",
  assigned: "info",
  completed: "success",
};

export default function UserDashboard() {
  const [message, setMessage] = useState("");
  const [issueType, setIssueType] = useState(issueOptions[0]);
  const [selectedBinId, setSelectedBinId] = useState("");
  const [complaints, setComplaints] = useState([]);
  const [dustbins, setDustbins] = useState([]);
  const [location] = useState(DEFAULT_USER_LOCATION);
  const [feedback, setFeedback] = useState({ type: "", message: "" });
  const [deletingComplaintId, setDeletingComplaintId] = useState("");

  const userEmail = localStorage.getItem("swmsUserEmail") || "user@gmail.com";

  useEffect(() => {
    const complaintsRef = ref(db, "complaints");
    const unsubscribe = onValue(complaintsRef, (snapshot) => {
      const data = snapshot.val();

      if (!data) {
        setComplaints([]);
        return;
      }

      const list = Object.keys(data)
        .map((key) => ({ id: key, ...data[key] }))
        .filter((complaint) => complaint.user === userEmail)
        .sort((left, right) => (right.timestamp ?? 0) - (left.timestamp ?? 0));

      setComplaints(list);
    });

    return () => unsubscribe();
  }, [userEmail]);

  useEffect(() => {
    const dustbinRef = ref(db, "dustbins");
    const unsubscribe = onValue(dustbinRef, (snapshot) => {
      const data = snapshot.val();

      if (!data) {
        setDustbins([]);
        return;
      }

      const binsArray = Object.keys(data).map((key) =>
        (() => {
          const snapshotBin = getLatestBinSnapshot({ id: key, ...data[key] });

          return snapshotBin.position
            ? snapshotBin
            : {
              ...snapshotBin,
              position: {
                lat: DEFAULT_USER_LOCATION.lat,
                lng: DEFAULT_USER_LOCATION.lng,
              },
              latest: {
                ...snapshotBin.latest,
                latitude: DEFAULT_USER_LOCATION.lat,
                longitude: DEFAULT_USER_LOCATION.lng,
              },
            };
        })()
      );

      setDustbins(binsArray);
      setSelectedBinId((current) => current || binsArray[0]?.id || "");
    });

    return () => unsubscribe();
  }, []);

  const sortedBins = useMemo(
    () => sortBinsByDistance(dustbins.filter((bin) => bin.position), location),
    [dustbins, location]
  );

  const nearestBin = sortedBins[0] || null;

  const submitComplaint = async () => {
    if (!selectedBinId) {
      setFeedback({ type: "error", message: "Please choose a dustbin first." });
      return;
    }

    if (!message.trim()) {
      setFeedback({ type: "error", message: "Please describe the complaint." });
      return;
    }

    const selectedBin = dustbins.find((bin) => bin.id === selectedBinId);

    try {
      await push(ref(db, "complaints"), {
        user: userEmail,
        binId: selectedBinId,
        binLabel: selectedBinId,
        issueType,
        message: message.trim(),
        status: "pending",
        maintenanceStatus: "awaiting inspection",
        assignedDriver: "",
        priority:
          issueType === "Overflowing bin" || (selectedBin?.latest?.fillLevel ?? 0) > 80
            ? "high"
            : "medium",
        binLocation: selectedBin?.position || null,
        timestamp: Date.now(),
      });

      setMessage("");
      setIssueType(issueOptions[0]);
      setFeedback({
        type: "success",
        message: "Complaint submitted. Admin will inspect and assign maintenance.",
      });
    } catch (error) {
      console.error(error);
      setFeedback({
        type: "error",
        message: "Unable to submit complaint right now.",
      });
    }
  };

  const deleteComplaint = async (complaint) => {
    const shouldDelete = window.confirm(
      `Delete this complaint for ${complaint.binId}? This will also remove it from Firebase.`
    );

    if (!shouldDelete) {
      return;
    }

    try {
      setDeletingComplaintId(complaint.id);
      await remove(ref(db, `complaints/${complaint.id}`));
      setFeedback({
        type: "success",
        message: `Complaint for ${complaint.binId} was deleted from Firebase.`,
      });
    } catch (error) {
      console.error(error);
      setFeedback({
        type: "error",
        message: "Unable to delete the complaint right now.",
      });
    } finally {
      setDeletingComplaintId("");
    }
  };

  return (
    <Box sx={pageStyles}>
      <Stack spacing={1.5}>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          User Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Find the nearest dustbin, report damaged bins, and track complaint progress.
        </Typography>
      </Stack>

      {feedback.message && <Alert severity={feedback.type || "info"}>{feedback.message}</Alert>}

      <Grid container spacing={3} sx={{ mt: 0.5 }}>
        <Grid size={{ xs: 12, lg: 7 }}>
          <Card sx={panelStyles}>
            <CardContent>
              <Stack spacing={2}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Nearest dustbin
                </Typography>

                {nearestBin ? (
                  <Stack spacing={1.5}>
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                      <Chip
                        label={`${nearestBin.id} • ${nearestBin.distanceKm.toFixed(2)} km away`}
                        color="success"
                      />
                      <Chip
                        label={`Fill level ${nearestBin.latest?.fillLevel ?? 0}%`}
                        color={(nearestBin.latest?.fillLevel ?? 0) > 80 ? "error" : "default"}
                      />
                    </Stack>
                    <Typography variant="body2" color="text.secondary">
                      Users can choose the nearest bin directly when raising a complaint.
                    </Typography>
                  </Stack>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No dustbin location data is available yet.
                  </Typography>
                )}

                <MapView
                  title="Nearest dustbins"
                  dustbins={sortedBins.slice(0, 5)}
                  userLocation={location}
                  userMarkerLabel="Dustbin location"
                  extraMarkers={[
                    {
                      id: "admin-location",
                      position: ADMIN_LOCATION,
                      label: "Admin",
                    },
                  ]}
                  mapHeight="360px"
                  emptyMessage="Nearest bin data will appear here when dustbins are available."
                />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, lg: 5 }}>
          <Card sx={panelStyles}>
            <CardContent>
              <Stack spacing={2}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Raise complaint to admin
                </Typography>

                <TextField
                  select
                  label="Damaged dustbin"
                  value={selectedBinId}
                  onChange={(event) => setSelectedBinId(event.target.value)}
                  fullWidth
                >
                  {sortedBins.map((bin) => (
                    <MenuItem key={bin.id} value={bin.id}>
                      {bin.id} - {bin.distanceKm.toFixed(2)} m away
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  select
                  label="Complaint type"
                  value={issueType}
                  onChange={(event) => setIssueType(event.target.value)}
                  fullWidth
                >
                  {issueOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  label="Complaint details"
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  placeholder="Describe what is damaged and what the admin should know."
                  multiline
                  minRows={4}
                  fullWidth
                />

                <Button variant="contained" color="success" onClick={submitComplaint}>
                  Submit complaint
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={12}>
          <Card sx={panelStyles}>
            <CardContent>
              <Stack spacing={2}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Your complaints
                </Typography>

                {complaints.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    No complaints raised yet.
                  </Typography>
                ) : (
                  complaints.map((complaint) => (
                    <Box key={complaint.id} sx={complaintCardStyles}>
                      <Stack spacing={1.5}>
                        <Stack
                          direction={{ xs: "column", md: "row" }}
                          justifyContent="space-between"
                          spacing={1.5}
                        >
                          <Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                              {complaint.binId} • {complaint.issueType}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {complaint.message}
                            </Typography>
                          </Box>
                          <Stack direction="row" spacing={1} flexWrap="wrap">
                            <Chip
                              label={complaint.status}
                              color={statusColor[complaint.status] || "default"}
                            />
                            <Chip
                              label={complaint.maintenanceStatus || "awaiting inspection"}
                              variant="outlined"
                            />
                          </Stack>
                        </Stack>
                        <Stack
                          direction={{ xs: "column", sm: "row" }}
                          justifyContent="space-between"
                          alignItems={{ xs: "flex-start", sm: "center" }}
                          spacing={1}
                        >
                          <Typography variant="caption" color="text.secondary">
                            Raised on {formatDateTime(complaint.timestamp)}
                          </Typography>
                          <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            onClick={() => deleteComplaint(complaint)}
                            disabled={deletingComplaintId === complaint.id}
                          >
                            {deletingComplaintId === complaint.id ? "Deleting..." : "Delete"}
                          </Button>
                        </Stack>
                      </Stack>
                    </Box>
                  ))
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

const pageStyles = {
  px: { xs: 2, md: 4 },
  py: 4,
  background: "linear-gradient(180deg, #f3fbf5 0%, #ffffff 100%)",
  minHeight: "100%",
};

const panelStyles = {
  borderRadius: 4,
  border: "1px solid #dce9df",
  boxShadow: "0 16px 40px rgba(20, 83, 45, 0.08)",
};

const complaintCardStyles = {
  border: "1px solid #dce9df",
  borderRadius: 3,
  p: 2,
  backgroundColor: "#fbfefb",
};
