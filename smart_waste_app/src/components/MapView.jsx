import { useState } from "react";
import {
  GoogleMap,
  InfoWindow,
  Marker,
  Polyline,
  useLoadScript,
} from "@react-google-maps/api";
import { Box, Chip, Stack, Typography } from "@mui/material";
import { DEFAULT_USER_LOCATION } from "../utils/distance";

const containerStyle = {
  width: "100%",
  height: "500px",
};

export default function MapView({
  dustbins = [],
  userLocation = DEFAULT_USER_LOCATION,
  userMarkerLabel = "You",
  extraMarkers = [],
  routePoints = [],
  mapHeight = "500px",
  title = "Bin locations",
  emptyMessage = "Map data is not available yet.",
}) {
  const [selected, setSelected] = useState(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const validBins = dustbins.filter((bin) => bin?.position);
  const polylinePath = [
    userLocation,
    ...routePoints.filter((point) => point?.lat != null && point?.lng != null),
  ];

  if (!import.meta.env.VITE_GOOGLE_MAPS_API_KEY) {
    return (
      <Box sx={fallbackStyles}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Add `VITE_GOOGLE_MAPS_API_KEY` to view the live map. The dashboard data below still works without it.
        </Typography>
      </Box>
    );
  }

  if (loadError) {
    return (
      <Box sx={fallbackStyles}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          {title}
        </Typography>
        <Typography variant="body2" color="error.main">
          Error loading the map right now.
        </Typography>
      </Box>
    );
  }

  if (!isLoaded) {
    return (
      <Box sx={fallbackStyles}>
        <Typography variant="body1">Loading map...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ borderRadius: 4, overflow: "hidden", border: "1px solid #d7e5dd" }}>
      <GoogleMap
        mapContainerStyle={{ ...containerStyle, height: mapHeight }}
        center={userLocation}
        zoom={12}
      >
        <Marker position={userLocation} label={userMarkerLabel} />
        {extraMarkers
          .filter((marker) => marker?.position?.lat != null && marker?.position?.lng != null)
          .map((marker) => (
            <Marker
              key={marker.id ?? `${marker.label}-${marker.position.lat}-${marker.position.lng}`}
              position={marker.position}
              label={marker.label}
            />
          ))}

        {validBins.map((bin) => (
          <Marker
            key={bin.id}
            position={bin.position}
            label={`${bin.id}`}
            onClick={() => setSelected(bin)}
          />
        ))}

        {polylinePath.length > 1 && (
          <Polyline
            path={polylinePath}
            options={{
              strokeColor: "#157347",
              strokeOpacity: 0.9,
              strokeWeight: 4,
            }}
          />
        )}

        {selected && (
          <InfoWindow position={selected.position} onCloseClick={() => setSelected(null)}>
            <Stack spacing={1}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                {selected.id}
              </Typography>
              <Chip
                size="small"
                label={`Fill level: ${selected.latest?.fillLevel ?? 0}%`}
                color={(selected.latest?.fillLevel ?? 0) > 80 ? "error" : "success"}
              />
              {selected.issueType && (
                <Typography variant="body2">Issue: {selected.issueType}</Typography>
              )}
            </Stack>
          </InfoWindow>
        )}
      </GoogleMap>

      {validBins.length === 0 && (
        <Box sx={fallbackStyles}>
          <Typography variant="body2" color="text.secondary">
            {emptyMessage}
          </Typography>
        </Box>
      )}
    </Box>
  );
}

const fallbackStyles = {
  minHeight: 160,
  display: "flex",
  flexDirection: "column",
  gap: 1,
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center",
  px: 3,
  py: 4,
  backgroundColor: "#f7fbf8",
};
