import { View, Text, StyleSheet, Pressable, Image } from "react-native";
import { router } from "expo-router";

export default function Index() {
return (
<View style={styles.container}>

{/* IMAGE */}
<Image
source={require("../../assets/images/neighborhood.jpeg")}
style={styles.image}
resizeMode="cover"
/>

<Text style={styles.title}>Welcome to CityFix</Text>

<Text style={styles.subtitle}>
Report issues and improve your community
</Text>

<Pressable
style={styles.button}
onPress={() => router.push("/signup")}
>
<Text style={styles.buttonText}>Sign Up</Text>
</Pressable>

<Pressable
style={[styles.button, { backgroundColor: "#00b894" }]}
onPress={() => router.push("/login")}
>
<Text style={styles.buttonText}>Login</Text>
</Pressable>

</View>
);
}

const styles = StyleSheet.create({
container: {
flex: 1,
justifyContent: "center",
alignItems: "center",
padding: 20,
backgroundColor: "#f5f5f5",
},

image: {
width: 250,
height: 250,
borderRadius: 20,
marginBottom: 20,
},

title: {
fontSize: 28,
fontWeight: "bold",
marginBottom: 10,
},

subtitle: {
textAlign: "center",
marginBottom: 30,
color: "#666",
},

button: {
backgroundColor: "#2e86de",
padding: 15,
width: "80%",
borderRadius: 10,
marginBottom: 10,
},

buttonText: {
color: "white",
textAlign: "center",
fontWeight: "bold",
},
});
