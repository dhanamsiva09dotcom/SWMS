export const DEFAULT_USER_LOCATION = {
  lat: 11.920833365447509,
  lng: 79.61073189487468,
  label: "Dustbin location",
};

export const ADMIN_LOCATION = {
  lat: 11.945832646193399,
  lng: 79.48801908138209,
  label: "Admin location",
};

export function toRadians(value) {
  return (value * Math.PI) / 180;
}

export function calculateDistanceInKm(start, end) {
  if (!start || !end) return Number.POSITIVE_INFINITY;

  const earthRadiusKm = 6371;
  const latitudeDelta = toRadians((end.lat ?? 0) - (start.lat ?? 0));
  const longitudeDelta = toRadians((end.lng ?? 0) - (start.lng ?? 0));

  const startLat = toRadians(start.lat ?? 0);
  const endLat = toRadians(end.lat ?? 0);

  const haversine =
    Math.sin(latitudeDelta / 2) * Math.sin(latitudeDelta / 2) +
    Math.cos(startLat) *
      Math.cos(endLat) *
      Math.sin(longitudeDelta / 2) *
      Math.sin(longitudeDelta / 2);

  const arc = 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));

  return earthRadiusKm * arc;
}

export function getLatestBinSnapshot(bin = {}) {
  const historyEntries = Object.values(bin.history || {}).sort(
    (left, right) => (left.timestamp ?? 0) - (right.timestamp ?? 0)
  );

  const latestEntry = historyEntries.at(-1) || {};
  const latitude = latestEntry.latitude ?? bin.latitude ?? null;
  const longitude = latestEntry.longitude ?? bin.longitude ?? null;

  return {
    ...bin,
    latest: {
      ...latestEntry,
      latitude,
      longitude,
    },
    position:
      latitude != null && longitude != null
        ? { lat: latitude, lng: longitude }
        : null,
  };
}

export function sortBinsByDistance(bins = [], origin) {
  return [...bins]
    .map((bin) => ({
      ...bin,
      distanceKm: calculateDistanceInKm(origin, bin.position),
    }))
    .sort((left, right) => left.distanceKm - right.distanceKm);
}

export function buildGreedyRoute(stops = [], origin) {
  const pendingStops = stops.filter((stop) => stop?.position);
  const orderedStops = [];
  let currentPosition = origin;

  while (pendingStops.length > 0) {
    let nearestIndex = 0;
    let nearestDistance = Number.POSITIVE_INFINITY;

    pendingStops.forEach((stop, index) => {
      const distance = calculateDistanceInKm(currentPosition, stop.position);

      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = index;
      }
    });

    const [nextStop] = pendingStops.splice(nearestIndex, 1);
    orderedStops.push({
      ...nextStop,
      routeDistanceKm: nearestDistance,
    });
    currentPosition = nextStop.position;
  }

  return orderedStops;
}

export function formatDateTime(timestamp) {
  if (!timestamp) return "Not available";

  return new Date(timestamp).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}
