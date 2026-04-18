export async function sendPushNotification(token: string, message: string) {
await fetch("https://exp.host/--/api/v2/push/send", {
method: "POST",
headers: {
Accept: "application/json",
"Content-Type": "application/json",
},
body: JSON.stringify({
to: token,
sound: "default",
title: "CityFix",
body: message,
}),
});
}
