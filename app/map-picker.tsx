import { View, Pressable, Text } from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { WebView } from "react-native-webview";

export default function MapPicker() {
const [coords, setCoords] = useState({
latitude: 40.73,
longitude: -74.17,
});

const html = `
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link
rel="stylesheet"
href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
/>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<style>
body { margin: 0; }
#map { height: 100vh; }
</style>
</head>
<body>
<div id="map"></div>

<script>
const map = L.map('map').setView([40.73, -74.17], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
maxZoom: 19
}).addTo(map);

let marker = L.marker([40.73, -74.17]).addTo(map);

map.on('click', function(e) {
marker.setLatLng(e.latlng);

window.ReactNativeWebView.postMessage(JSON.stringify({
lat: e.latlng.lat,
lng: e.latlng.lng
}));
});
</script>
</body>
</html>
`;

const handleMessage = (event: any) => {
try {
const data = JSON.parse(event.nativeEvent.data);

setCoords({
latitude: data.lat,
longitude: data.lng,
});
} catch (err) {
console.log("Map error:", err);
}
};

// =====================
// 🔥 FIXED REVERSE GEOCODING
// =====================
const confirmLocation = async () => {
try {
const res = await fetch(
`https://nominatim.openstreetmap.org/reverse?lat=${coords.latitude}&lon=${coords.longitude}&format=json`,
{
headers: {
"User-Agent": "CityFixApp/1.0 (support@cityfix.app)",
"Accept": "application/json",
},
}
);

const data = await res.json();
const addr = data?.address || {};

// 🧠 Build safe readable address
const street =
addr.road ||
addr.pedestrian ||
addr.footway ||
addr.path ||
"";

const area =
addr.suburb ||
addr.neighbourhood ||
addr.village ||
addr.hamlet ||
"";

const city =
addr.city ||
addr.town ||
addr.municipality ||
addr.village ||
"";

const county =
addr.county ||
addr.state ||
"";

const readableAddress =
[street, area, city, county]
.filter((v) => v && v.trim().length > 0)
.join(", ");

router.replace({
pathname: "/create-post",
params: {
latitude: String(coords.latitude),
longitude: String(coords.longitude),

street: readableAddress || "Pinned Location",
area,
city,
county,
},
});

} catch (err) {
console.log("Geocode error:", err);

router.replace({
pathname: "/create-post",
params: {
latitude: String(coords.latitude),
longitude: String(coords.longitude),
street: "Pinned Location",
area: "",
city: "",
county: "",
},
});
}
};

return (
<View style={{ flex: 1 }}>
<WebView
originWhitelist={["*"]}
source={{ html }}
onMessage={handleMessage}
/>

<Pressable
onPress={confirmLocation}
style={{
position: "absolute",
bottom: 40,
left: 20,
right: 20,
backgroundColor: "#2e86de",
padding: 15,
borderRadius: 10,
}}
>
<Text style={{ color: "white", textAlign: "center" }}>
Confirm Location
</Text>
</Pressable>
</View>
);
}


