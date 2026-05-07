import { useState } from "react";
import {
View,
Text,
TextInput,
Pressable,
StyleSheet,
} from "react-native";

import { router } from "expo-router";

export default function Filter() {
const [city, setCity] = useState("");
const [area, setArea] = useState("");
const [county, setCounty] = useState("");

// =====================
// APPLY FILTER (FIXED)
// =====================
const applyFilter = () => {
router.push({
pathname: "/home",
params: {
city: city.trim().toLowerCase() || "",
area: area.trim().toLowerCase() || "",
county: county.trim().toLowerCase() || "",
},
});
};

// =====================
// CLEAR FILTER (FIXED)
// =====================
const clearFilter = () => {
setCity("");
setArea("");
setCounty("");

// IMPORTANT: send empty params cleanly
router.push({
pathname: "/home",
params: {},
});
};

return (
<View style={styles.container}>

<Pressable onPress={() => router.back()} style={{ marginBottom: 10 }}>
<Text style={{ color: "#2e86de", fontWeight: "bold" }}>
← Go Back
</Text>
</Pressable>

<Text style={styles.title}>Filter Posts</Text>

<TextInput
placeholder="City (e.g. Brooklyn)"
value={city}
onChangeText={setCity}
style={styles.input}
/>

<TextInput
placeholder="Area (e.g. Bushwick)"
value={area}
onChangeText={setArea}
style={styles.input}
/>

<TextInput
placeholder="County"
value={county}
onChangeText={setCounty}
style={styles.input}
/>

<Pressable style={styles.button} onPress={applyFilter}>
<Text style={styles.buttonText}>Apply Filter</Text>
</Pressable>

<Pressable
style={[styles.button, { backgroundColor: "gray" }]}
onPress={clearFilter}
>
<Text style={styles.buttonText}>Clear Filter</Text>
</Pressable>

</View>
);
}

const styles = StyleSheet.create({
container: {
flex: 1,
padding: 20,
backgroundColor: "#fff",
},

title: {
fontSize: 22,
fontWeight: "bold",
marginBottom: 20,
},

input: {
borderWidth: 1,
borderColor: "#ccc",
padding: 10,
borderRadius: 8,
marginBottom: 10,
},

button: {
backgroundColor: "#2e86de",
padding: 12,
borderRadius: 8,
alignItems: "center",
marginTop: 10,
},

buttonText: {
color: "white",
fontWeight: "bold",
},
});


