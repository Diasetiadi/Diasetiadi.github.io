let webPush = require("web-push");
const vapidKeys = {
  publicKey:
    "BKyT0cPPxYUhUch0KYv9vC4sgq7xCwacXiPLODPvIxoibg1Qp-PiWpg1jZX8POxYsGWZ5HyQVhMVcC7rFGWRU3Q",
  privateKey: "_LR8uFUChGuvFZ8Kqis-CcdKxGMEAxQ99rABTkU3hBQ",
};

webPush.setVapidDetails(
  "mailto:setiadi665@gmail.com",
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

let pushSubscription = {
  endpoint:
    "https://fcm.googleapis.com/fcm/send/eEeDaX24zYc:APA91bEwdzDQAOHQr6507o0XER_qQEOsexoJ7H8gjoWeTjy9bTY7iatJOnf2sxd9r13og91HY7unx46qZFA5BXzHRzZBW9fLxdVoQ4IryhLIs16sZ4mHHYM9YKU1uDBQHH631tes4iaB",
  keys: {
    p256dh:
      "BLVuG1/HcKMDfM5Prihkyuq+jBRUyWcBhwtN/8IgWa1jRN3gGXMS7RueB1OVvcC1iUMUFl0Sx/wiIKWuSpBhe0s=",
    auth: "DmgUvgc4TUEcR9e0e+RpCQ==",
  },
};

let payload = "Selamat! Aplikasi Anda sudah dapat menerima push notifikasi!";

let options = {
  gcmAPIKey: "511323286658",
  TTL: 60,
};

webPush.sendNotification(pushSubscription, payload, options);
