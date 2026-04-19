import { useState } from "react";
import { View, TextInput, Pressable, Text, Alert, StyleSheet } from "react-native";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

import { auth, db } from "../lib/firebase";
import { router } from "expo-router";

export default function Signup() {
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [name, setName] = useState("");
const [role, setRole] = useState<"resident" | "admin">("resident");

const handleSignup = async () => {
try {
const userCredential = await createUserWithEmailAndPassword(
auth,
email,
password
);

const user = userCredential.user;

// 👤 Set display name
await updateProfile(user, {
displayName: name,
});

// 📦 SAVE USER IN FIRESTORE (THIS FIXES EVERYTHING)
await setDoc(doc(db, "users", user.uid), {
email: user.email,
name: name,
role: role,
createdAt: new Date(),
});

Alert.alert("Success", "Account created!");

// 🚀 ROUTE BASED ON ROLE
if (role === "admin") {
router.replace("/admin/dashboard");
} else {
router.replace("/home");
}
} catch (error: any) {
Alert.alert("Signup Failed", error.message);
}
};

return (
<View style={styles.container}>
<Text style={styles.title}>Signup</Text>

<TextInput placeholder="Name" value={name} onChangeText={setName} style={styles.input} />
<TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} />
<TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />

{/* ROLE SELECT */}
<Text style={styles.label}>Select Role:</Text>

<Pressable onPress={() => setRole("resident")} style={styles.roleButton}>
<Text>Resident {role === "resident" ? "✅" : ""}</Text>
</Pressable>

<Pressable onPress={() => setRole("admin")} style={styles.roleButton}>
<Text>Admin {role === "admin" ? "✅" : ""}</Text>
</Pressable>

<Pressable style={styles.button} onPress={handleSignup}>
<Text style={styles.buttonText}>Sign Up</Text>
</Pressable>
</View>
);
}

const styles = StyleSheet.create({
container: { flex: 1, justifyContent: "center", padding: 20 },
title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },

input: {
borderWidth: 1,
borderColor: "#ccc",
padding: 10,
marginBottom: 10,
borderRadius: 8,
},

label: {
fontWeight: "bold",
marginTop: 10,
},

roleButton: {
padding: 10,
backgroundColor: "#eee",
marginTop: 5,
borderRadius: 8,
},

button: {
backgroundColor: "#2e86de",
padding: 12,
marginTop: 15,
borderRadius: 10,
alignItems: "center",
},

buttonText: {
color: "white",
fontWeight: "bold",
},
});
