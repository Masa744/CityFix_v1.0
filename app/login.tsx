import { useState } from "react";
import {
View,
TextInput,
Pressable,
Text,
Alert,
StyleSheet,
} from "react-native";

import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

import { auth, db } from "../lib/firebase";
import { router } from "expo-router";

export default function Login() {
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");

const handleLogin = async () => {
try {
const userCredential = await signInWithEmailAndPassword(
auth,
email,
password
);

const user = userCredential.user;

// 🔥 GET USER ROLE FROM FIRESTORE
const userDoc = await getDoc(doc(db, "users", user.uid));

if (!userDoc.exists()) {
Alert.alert("Error", "User data not found");
return;
}

const userData = userDoc.data();

// 🚀 REDIRECT BASED ON ROLE
if (userData.role === "admin") {
router.replace("/admin/dashboard");
} else {
router.replace("/home");
}
} catch (error: any) {
Alert.alert("Login Failed", error.message);
}
};

return (
<View style={styles.container}>
<Text style={styles.title}>Login</Text>

<TextInput
placeholder="Email"
value={email}
onChangeText={setEmail}
style={styles.input}
/>

<TextInput
placeholder="Password"
value={password}
onChangeText={setPassword}
secureTextEntry
style={styles.input}
/>

<Pressable style={styles.button} onPress={handleLogin}>
<Text style={styles.buttonText}>Login</Text>
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

button: {
backgroundColor: "#2e86de",
padding: 12,
borderRadius: 10,
alignItems: "center",
},

buttonText: {
color: "white",
fontWeight: "bold",
},
});
