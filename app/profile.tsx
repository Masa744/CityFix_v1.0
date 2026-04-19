import { useEffect, useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { auth } from "../lib/firebase";
import { router } from "expo-router";

export default function Profile() {
const [user, setUser] = useState<any>(null);

const [area, setArea] = useState("");
const [city, setCity] = useState("");
const [county, setCounty] = useState("");

// 🔥 WAIT FOR AUTH PROPERLY
useEffect(() => {
const currentUser = auth.currentUser;

if (currentUser) {
currentUser.reload().then(() => {
setUser(currentUser);
});
}
}, []);

if (!user) {
return (
<View style={styles.container}>
<Text>No user logged in</Text>

<Pressable onPress={() => router.replace("/login")}>
<Text style={{ color: "blue", marginTop: 10 }}>
Go to Login
</Text>
</Pressable>
</View>
);
}

return (
<View style={styles.container}>
<Text style={styles.title}>Profile</Text>

<Text style={styles.label}>Name:</Text>
<Text>{user.displayName || user.email}</Text>

<Text style={styles.label}>Area</Text>
<TextInput
value={area}
onChangeText={setArea}
placeholder="Enter area"
style={styles.input}
/>

<Text style={styles.label}>City</Text>
<TextInput
value={city}
onChangeText={setCity}
placeholder="Enter city"
style={styles.input}
/>

<Text style={styles.label}>County</Text>
<TextInput
value={county}
onChangeText={setCounty}
placeholder="Enter county"
style={styles.input}
/>

<Pressable
style={styles.button}
onPress={() => {
alert("Profile saved (we can connect Firebase next)");
}}
>
<Text style={styles.buttonText}>Save Profile</Text>
</Pressable>
</View>
);
}

const styles = StyleSheet.create({
container: {
flex: 1,
padding: 20,
justifyContent: "center",
},
title: {
fontSize: 22,
fontWeight: "bold",
marginBottom: 20,
},
label: {
marginTop: 10,
fontWeight: "bold",
},
input: {
borderWidth: 1,
padding: 10,
borderRadius: 8,
marginTop: 5,
},
button: {
backgroundColor: "#2e86de",
padding: 12,
marginTop: 20,
borderRadius: 10,
alignItems: "center",
},
buttonText: {
color: "white",
fontWeight: "bold",
},
});

