import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { onValue, ref, update } from "firebase/database";
import MapView from "../components/MapView";
import { db } from "../firebase/firebaseConfig";
import {
  ADMIN_LOCATION,
  buildGreedyRoute,
  DEFAULT_USER_LOCATION,
  formatDateTime,
} from "../utils/distance";

export default function DriverDashboard() {
  const [assignments, setAssignments] = useState([]);
  const [feedback, setFeedback] = useState({ type: "", message: "" });
  const [showingFallbackAssignments, setShowingFallbackAssignments] = useState(false);
  const [location] = useState({
    ...ADMIN_LOCATION,
    label: "Admin",
  });

  const driverEmail = localStorage.getItem("swmsUserEmail") || "driver1@gmail.com";
  const normalizeEmail = (value) => (value || "").trim().toLowerCase();

  useEffect(() => {
    const complaintsRef = ref(db, "complaints");
    const unsubscribe = onValue(complaintsRef, (snapshot) => {
      const data = snapshot.val();

      if (!data) {
        setAssignments([]);
        setShowingFallbackAssignments(false);
        return;
      }

      const activeAssignments = Object.keys(data)
        .map((key) => ({ id: key, ...data[key] }))
        .filter(
          (complaint) =>
            complaint.assignedDriver && complaint.status !== "completed"
        );

      const matchedAssignments = activeAssignments.filter(
        (complaint) =>
          normalizeEmail(complaint.assignedDriver) === normalizeEmail(driverEmail)
      );

      if (matchedAssignments.length > 0) {
        setAssignments(matchedAssignments);
        setShowingFallbackAssignments(false);
        return;
      }

      setAssignments(activeAssignments);
      setShowingFallbackAssignments(activeAssignments.length > 0);
    });

    return () => unsubscribe();
  }, [driverEmail]);

  const routeAssignments = useMemo(
    () =>
      buildGreedyRoute(
        assignments.map((assignment) => ({
          ...assignment,
          position: {
            lat: DEFAULT_USER_LOCATION.lat,
            lng: DEFAULT_USER_LOCATION.lng,
          },
        })),
        location
      ),
    [assignments, location]
  );

  const completeAssignment = async (assignment) => {
    try {
      await update(ref(db, `complaints/${assignment.id}`), {
        status: "completed",
        maintenanceStatus: "maintenance completed",
        completedBy: driverEmail,
        completedAt: Date.now(),
      });

      setFeedback({
        type: "success",
        message: `Marked ${assignment.binId} as completed and notified admin.`,
      });
    } catch (error) {
      console.error(error);
      setFeedback({
        type: "error",
        message: "Unable to update work completion right now.",
      });
    }
  };

  return (
    <Box sx={pageStyles}>
      <Stack spacing={1.5} sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          Driver Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Follow the shortest route to assigned bins, complete the work, and update admin instantly.
        </Typography>
      </Stack>

      {feedback.message && (
        <Alert severity={feedback.type || "info"} sx={{ mb: 3 }}>
          {feedback.message}
        </Alert>
      )}

      {showingFallbackAssignments && (
        <Alert severity="info" sx={{ mb: 3 }}>
          No assigned work matched the logged-in email {driverEmail} exactly, so all active
          assigned work is being shown.
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 7 }}>
          <Card sx={panelStyles}>
            <CardContent>
              <Stack spacing={2}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Best route to assigned bins
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  The path is ordered by nearest-next stop from the driver location.
                </Typography>

                <MapView
                  title="Driver route"
                  dustbins={[]}
                  userLocation={location}
                  userMarkerLabel="Admin"
                  extraMarkers={[
                    {
                      id: "dustbin-location",
                      position: DEFAULT_USER_LOCATION,
                      label: "Dustbin location",
                    },
                  ]}
                  routePoints={[]}
                  mapHeight="420px"
                  emptyMessage="This map shows the configured admin and dustbin locations."
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
                  Route order
                </Typography>

                {routeAssignments.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    No work has been assigned to this driver yet.
                  </Typography>
                ) : (
                  routeAssignments.map((assignment, index) => (
                    <Box key={assignment.id} sx={routeCardStyles}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                        Stop {index + 1}: {assignment.binId}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {assignment.issueType} • {assignment.routeDistanceKm.toFixed(2)} km from previous stop
                      </Typography>
                    </Box>
                  ))
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={12}>
          <Card sx={panelStyles}>
            <CardContent>
              <Stack spacing={2}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Assigned works
                </Typography>

                {routeAssignments.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    No active works assigned by admin.
                  </Typography>
                ) : (
                  routeAssignments.map((assignment) => (
                    <Box key={assignment.id} sx={workCardStyles}>
                      <Stack
                        direction={{ xs: "column", md: "row" }}
                        justifyContent="space-between"
                        spacing={1.5}
                      >
                        <Box>
                          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                            {assignment.binId} • {assignment.issueType}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {assignment.message}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Assigned on {formatDateTime(assignment.assignedAt)}
                          </Typography>
                        </Box>
                        <Stack direction="row" spacing={1} flexWrap="wrap">
                          <Chip label={assignment.status || "assigned"} color="info" />
                          <Chip label={assignment.maintenanceStatus || "assigned to driver"} variant="outlined" />
                          <Chip label={assignment.assignedDriver || "unassigned"} variant="outlined" />
                        </Stack>
                      </Stack>
                      <Button
                        variant="contained"
                        color="success"
                        onClick={() => completeAssignment(assignment)}
                        sx={{ alignSelf: "flex-start" }}
                      >
                        Complete work
                      </Button>
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
  background: "linear-gradient(180deg, #f3f8ff 0%, #ffffff 100%)",
  minHeight: "100%",
};

const panelStyles = {
  borderRadius: 4,
  border: "1px solid #d5dfee",
  boxShadow: "0 18px 42px rgba(30, 64, 175, 0.08)",
};

const routeCardStyles = {
  border: "1px solid #d5dfee",
  borderRadius: 3,
  p: 2,
  backgroundColor: "#f8fbff",
};

const workCardStyles = {
  display: "flex",
  flexDirection: "column",
  gap: 2,
  border: "1px solid #d5dfee",
  borderRadius: 3,
  p: 2,
  backgroundColor: "#f8fbff",
};

