import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import Constants from "expo-constants";

Notifications.setNotificationHandler({
handleNotification: async () => ({
shouldShowAlert: true,
shouldPlaySound: true,
shouldSetBadge: false,
}),
});

export async function registerForPushNotificationsAsync() {
const { status: existingStatus } =
await Notifications.getPermissionsAsync();

let finalStatus = existingStatus;

if (existingStatus !== "granted") {
const { status } = await Notifications.requestPermissionsAsync();
finalStatus = status;
}

if (finalStatus !== "granted") {
return null;
}

// ✅ FIX: projectId is REQUIRED
const projectId =
Constants.expoConfig?.extra?.eas?.projectId ??
Constants.easConfig?.projectId;

if (!projectId) {
console.log("❌ Missing projectId in app config");
return null;
}

const token = (
await Notifications.getExpoPushTokenAsync({
projectId,
})
).data;

if (Platform.OS === "android") {
await Notifications.setNotificationChannelAsync("default", {
name: "default",
importance: Notifications.AndroidImportance.MAX,
});
}

return token;
}
