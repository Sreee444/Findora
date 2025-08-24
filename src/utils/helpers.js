// Utility/helper functions
export function formatDate(date) {
  return new Date(date).toLocaleDateString();
}

// Format date and time in IST with 24-hour format
export function formatDateTimeIST(date) {
  if (!date) return 'N/A';
  
  const dateObj = new Date(date);
  
  // Format options for IST (Indian Standard Time) in 24-hour format
  const options = {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: '2-digit', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false // 24-hour format
  };
  
  const formatter = new Intl.DateTimeFormat('en-GB', options);
  const parts = formatter.formatToParts(dateObj);
  
  // Extract parts and format as DD/MM/YYYY, HH:MM:SS
  const day = parts.find(part => part.type === 'day').value;
  const month = parts.find(part => part.type === 'month').value;
  const year = parts.find(part => part.type === 'year').value;
  const hour = parts.find(part => part.type === 'hour').value;
  const minute = parts.find(part => part.type === 'minute').value;
  const second = parts.find(part => part.type === 'second').value;
  
  return `Date: ${day}/${month}/${year}, ${hour}:${minute}:${second}`;
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
