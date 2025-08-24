// Google Maps loader utility
export function loadGoogleMaps(apiKey) {
  return new Promise((resolve) => {
    if (window.google) {
      resolve(window.google.maps);
      return;
    }
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.onload = () => resolve(window.google.maps);
    document.body.appendChild(script);
  });
}