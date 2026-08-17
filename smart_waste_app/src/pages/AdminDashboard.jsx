import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { onValue, ref, update } from "firebase/database";
import MapView from "../components/MapView";
import { db } from "../firebase/firebaseConfig";
import {
  ADMIN_LOCATION,
  DEFAULT_USER_LOCATION,
  formatDateTime,
  getLatestBinSnapshot,
} from "../utils/distance";

const driverOptions = [
  "driver1@gmail.com",
  "driver2@gmail.com",
  "driver3@gmail.com",
];

const statusColor = {
  pending: "warning",
  assigned: "info",
  completed: "success",
};

function getBinStatus(fillLevel = 0) {
  if (fillLevel >= 90) {
    return { label: "Critical", color: "error" };
  }

  if (fillLevel >= 70) {
    return { label: "Nearly full", color: "warning" };
  }

  if (fillLevel >= 40) {
    return { label: "Moderate", color: "info" };
  }

  return { label: "Available", color: "success" };
}

function formatMinutesToFull(minutes) {
  if (minutes == null) return "Prediction unavailable";
  if (minutes <= 0) return "Already full / not increasing";

  const rounded = Math.round(minutes);

  if (rounded < 60) {
    return `${rounded} min`;
  }

  const hours = Math.floor(rounded / 60);
  const remainingMinutes = rounded % 60;

  if (remainingMinutes === 0) {
    return `${hours} hr`;
  }

  return `${hours} hr ${remainingMinutes} min`;
}

export default function AdminDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [dustbins, setDustbins] = useState([]);
  const [feedback, setFeedback] = useState({ type: "", message: "" });

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
        .sort((left, right) => (right.timestamp ?? 0) - (left.timestamp ?? 0));

      setComplaints(list);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const dustbinsRef = ref(db, "dustbins");
    const unsubscribe = onValue(dustbinsRef, (snapshot) => {
      const data = snapshot.val();

      if (!data) {
        setDustbins([]);
        return;
      }

      const bins = Object.keys(data)
        .map((key) => ({ id: key, ...data[key] }))
        .map((bin) => getLatestBinSnapshot(bin))
        .sort((left, right) => (right.latest?.fillLevel ?? 0) - (left.latest?.fillLevel ?? 0));

      setDustbins(bins);
    });

    return () => unsubscribe();
  }, []);

  const complaintMetrics = useMemo(
    () => ({
      total: complaints.length,
      pending: complaints.filter((complaint) => complaint.status === "pending").length,
      assigned: complaints.filter((complaint) => complaint.status === "assigned").length,
      completed: complaints.filter((complaint) => complaint.status === "completed").length,
    }),
    [complaints]
  );

  const binMetrics = useMemo(
    () => ({
      total: dustbins.length,
      critical: dustbins.filter((bin) => (bin.latest?.fillLevel ?? 0) >= 90).length,
      predictedOverflowSoon: dustbins.filter(
        (bin) => (bin.prediction?.timeToFull_minutes ?? Number.POSITIVE_INFINITY) <= 180
      ).length,
      averageFill:
        dustbins.length === 0
          ? 0
          : Math.round(
              dustbins.reduce((sum, bin) => sum + (bin.latest?.fillLevel ?? 0), 0) /
                dustbins.length
            ),
    }),
    [dustbins]
  );

  const assignDriver = async (complaint, driverEmail) => {
    if (!driverEmail) {
      setFeedback({ type: "error", message: "Select a driver before assigning work." });
      return;
    }

    try {
      await update(ref(db, `complaints/${complaint.id}`), {
        assignedDriver: driverEmail,
        status: "assigned",
        maintenanceStatus: "assigned to driver",
        assignedAt: Date.now(),
      });

      setFeedback({
        type: "success",
        message: `Work assigned to ${driverEmail} for ${complaint.binId}.`,
      });
    } catch (error) {
      console.error(error);
      setFeedback({ type: "error", message: "Unable to assign the driver right now." });
    }
  };

  const updateMaintenance = async (complaint, maintenanceStatus) => {
    try {
      const nextStatus =
        maintenanceStatus === "maintenance completed" ? "completed" : complaint.status || "pending";

      await update(ref(db, `complaints/${complaint.id}`), {
        maintenanceStatus,
        status: nextStatus,
        completedAt:
          maintenanceStatus === "maintenance completed"
            ? Date.now()
            : complaint.completedAt || null,
      });

      setFeedback({
        type: "success",
        message: `Maintenance updated for ${complaint.binId}.`,
      });
    } catch (error) {
      console.error(error);
      setFeedback({ type: "error", message: "Unable to update maintenance status." });
    }
  };

  return (
    <Box sx={pageStyles}>
      <Stack spacing={1.5} sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          Admin Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Review user complaints, track live bin status, and monitor ML overflow predictions.
        </Typography>
      </Stack>

      {feedback.message && (
        <Alert severity={feedback.type || "info"} sx={{ mb: 3 }}>
          {feedback.message}
        </Alert>
      )}

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: "Total complaints", value: complaintMetrics.total, color: "#1d4d2f" },
          { label: "Pending inspection", value: complaintMetrics.pending, color: "#9b6616" },
          { label: "Assigned to drivers", value: complaintMetrics.assigned, color: "#155e75" },
          { label: "Completed", value: complaintMetrics.completed, color: "#166534" },
        ].map((metric) => (
          <Grid key={metric.label} size={{ xs: 12, sm: 6, lg: 3 }}>
            <Card sx={metricCardStyles}>
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  {metric.label}
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, color: metric.color }}>
                  {metric.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {[
          { label: "Total bins tracked", value: binMetrics.total, color: "#1d4d2f" },
          { label: "Critical fill bins", value: binMetrics.critical, color: "#b42318" },
          { label: "Likely full within 3 hrs", value: binMetrics.predictedOverflowSoon, color: "#a15c07" },
          { label: "Average fill level", value: `${binMetrics.averageFill}%`, color: "#155e75" },
        ].map((metric) => (
          <Grid key={metric.label} size={{ xs: 12, sm: 6, lg: 3 }}>
            <Card sx={binMetricCardStyles}>
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  {metric.label}
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, color: metric.color }}>
                  {metric.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Card sx={{ ...panelStyles, mb: 3 }}>
        <CardContent>
          <Stack spacing={2}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Real-time bin map
              </Typography>
              <Typography variant="body2" color="text.secondary">
                This map reads live dustbin latitude, longitude, and fill levels from Firebase
                Realtime Database and centers the view on your configured default location.
              </Typography>
            </Box>

            <MapView
              title="Admin live bin map"
              dustbins={[]}
              userLocation={ADMIN_LOCATION}
              userMarkerLabel="Admin"
              extraMarkers={[
                {
                  id: "dustbin-location",
                  position: DEFAULT_USER_LOCATION,
                  label: "Dustbin location",
                },
              ]}
              mapHeight="420px"
              emptyMessage="This map shows the configured admin and dustbin locations."
            />
          </Stack>
        </CardContent>
      </Card>

      <Card sx={{ ...panelStyles, mb: 3 }}>
        <CardContent>
          <Stack spacing={2}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Bin status and ML prediction
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Live fill levels come from <code>dustbins/{`<binId>`}/history</code>, and
                predictions come from <code>dustbins/{`<binId>`}/prediction</code> in Firebase
                Realtime Database.
              </Typography>
            </Box>

            {dustbins.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No dustbin data found in Firebase yet.
              </Typography>
            ) : (
              <Grid container spacing={2}>
                {dustbins.map((bin) => {
                  const fillLevel = Number(bin.latest?.fillLevel ?? 0);
                  const futureFill = bin.prediction?.futureFill;
                  const timeToFull = bin.prediction?.timeToFull_minutes;
                  const status = getBinStatus(fillLevel);

                  return (
                    <Grid key={bin.id} size={{ xs: 12, md: 6, xl: 4 }}>
                      <Box sx={binCardStyles}>
                        <Stack
                          direction={{ xs: "column", sm: "row" }}
                          justifyContent="space-between"
                          spacing={1.5}
                        >
                          <Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                              {bin.id}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Last sensor update {formatDateTime(bin.latest?.timestamp)}
                            </Typography>
                          </Box>
                          <Stack direction="row" spacing={1} flexWrap="wrap">
                            <Chip label={status.label} color={status.color} />
                            <Chip label={`Now ${fillLevel.toFixed(1)}%`} variant="outlined" />
                          </Stack>
                        </Stack>

                        <Grid container spacing={1.5}>
                          <Grid size={{ xs: 12, sm: 6 }}>
                            <Box sx={binDetailBoxStyles}>
                              <Typography variant="caption" color="text.secondary">
                                Current fill level
                              </Typography>
                              <Typography variant="h5" sx={{ fontWeight: 800 }}>
                                {fillLevel.toFixed(1)}%
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid size={{ xs: 12, sm: 6 }}>
                            <Box sx={binDetailBoxStyles}>
                              <Typography variant="caption" color="text.secondary">
                                Predicted fill after 1 hour
                              </Typography>
                              <Typography variant="h5" sx={{ fontWeight: 800 }}>
                                {futureFill != null ? `${Number(futureFill).toFixed(1)}%` : "--"}
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid size={{ xs: 12, sm: 6 }}>
                            <Box sx={binDetailBoxStyles}>
                              <Typography variant="caption" color="text.secondary">
                                Time to full
                              </Typography>
                              <Typography variant="body1" sx={{ fontWeight: 700 }}>
                                {formatMinutesToFull(timeToFull)}
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid size={{ xs: 12, sm: 6 }}>
                            <Box sx={binDetailBoxStyles}>
                              <Typography variant="caption" color="text.secondary">
                                Prediction updated
                              </Typography>
                              <Typography variant="body1" sx={{ fontWeight: 700 }}>
                                {formatDateTime(
                                  bin.prediction?.timestamp ? bin.prediction.timestamp * 1000 : null
                                )}
                              </Typography>
                            </Box>
                          </Grid>
                        </Grid>
                      </Box>
                    </Grid>
                  );
                })}
              </Grid>
            )}
          </Stack>
        </CardContent>
      </Card>

      <Stack spacing={2.5}>
        {complaints.length === 0 ? (
          <Card sx={panelStyles}>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                No user complaints yet.
              </Typography>
            </CardContent>
          </Card>
        ) : (
          complaints.map((complaint) => (
            <Card key={complaint.id} sx={panelStyles}>
              <CardContent>
                <Stack spacing={2}>
                  <Stack
                    direction={{ xs: "column", lg: "row" }}
                    justifyContent="space-between"
                    spacing={1.5}
                  >
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        {complaint.binId || "Dustbin"} - {complaint.issueType || "Complaint"}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Raised by {complaint.user || "Unknown user"} on{" "}
                        {formatDateTime(complaint.timestamp)}
                      </Typography>
                    </Box>

                    <Stack direction="row" spacing={1} flexWrap="wrap">
                      <Chip
                        label={complaint.priority || "medium priority"}
                        color={complaint.priority === "high" ? "error" : "warning"}
                      />
                      <Chip
                        label={complaint.status || "pending"}
                        color={statusColor[complaint.status] || "default"}
                      />
                      <Chip
                        label={complaint.maintenanceStatus || "awaiting inspection"}
                        variant="outlined"
                      />
                    </Stack>
                  </Stack>

                  <Typography variant="body1">{complaint.message}</Typography>

                  <Divider />

                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Stack spacing={1.5}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                          Assign work to driver
                        </Typography>
                        <TextField
                          select
                          label="Assigned driver"
                          value={complaint.assignedDriver || ""}
                          onChange={(event) => assignDriver(complaint, event.target.value)}
                          fullWidth
                        >
                          <MenuItem value="">Select driver</MenuItem>
                          {driverOptions.map((driver) => (
                            <MenuItem key={driver} value={driver}>
                              {driver}
                            </MenuItem>
                          ))}
                        </TextField>
                        {complaint.assignedAt && (
                          <Typography variant="caption" color="text.secondary">
                            Assigned on {formatDateTime(complaint.assignedAt)}
                          </Typography>
                        )}
                      </Stack>
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                      <Stack spacing={1.5}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                          Maintain dustbin status
                        </Typography>
                        <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                          <Button
                            variant="outlined"
                            onClick={() => updateMaintenance(complaint, "inspection in progress")}
                          >
                            Inspection
                          </Button>
                          <Button
                            variant="outlined"
                            onClick={() => updateMaintenance(complaint, "repair in progress")}
                          >
                            Repairing
                          </Button>
                          <Button
                            variant="contained"
                            color="success"
                            onClick={() => updateMaintenance(complaint, "maintenance completed")}
                          >
                            Mark completed
                          </Button>
                        </Stack>
                        {complaint.completedAt && (
                          <Typography variant="caption" color="text.secondary">
                            Completed on {formatDateTime(complaint.completedAt)}
                          </Typography>
                        )}
                      </Stack>
                    </Grid>
                  </Grid>
                </Stack>
              </CardContent>
            </Card>
          ))
        )}
      </Stack>
    </Box>
  );
}

const pageStyles = {
  px: { xs: 2, md: 4 },
  py: 4,
  background: "linear-gradient(180deg, #fffaf2 0%, #ffffff 100%)",
  minHeight: "100%",
};

const panelStyles = {
  borderRadius: 4,
  border: "1px solid #eddcc8",
  boxShadow: "0 18px 40px rgba(120, 53, 15, 0.08)",
};

const metricCardStyles = {
  ...panelStyles,
  background: "#fffdf9",
};

const binMetricCardStyles = {
  ...panelStyles,
  background: "#f8fcff",
  border: "1px solid #d8e8f5",
};

const binCardStyles = {
  display: "flex",
  flexDirection: "column",
  gap: 2,
  height: "100%",
  border: "1px solid #d8e8f5",
  borderRadius: 3,
  p: 2,
  backgroundColor: "#fbfdff",
};

const binDetailBoxStyles = {
  height: "100%",
  border: "1px solid #e4eef6",
  borderRadius: 3,
  p: 1.5,
  backgroundColor: "#ffffff",
};
