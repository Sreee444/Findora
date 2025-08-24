// Utility/helper functions
export function formatDate(date) {
  return new Date(date).toLocaleDateString();
}

// Google Maps utilities
export function openInGoogleMaps(lat, lng) {
  const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;
  window.open(googleMapsUrl, '_blank');
}

export function searchAddressInGoogleMaps(address) {
  const googleMapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(address)}`;
  window.open(googleMapsUrl, '_blank');
}

export function getGoogleMapsUrl(lat, lng) {
  return `https://www.google.com/maps?q=${lat},${lng}`;
}

export function getGoogleMapsSearchUrl(address) {
  return `https://www.google.com/maps/search/${encodeURIComponent(address)}`;
}
