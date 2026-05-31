// 🌸 tuhfa Service Worker for True Push and OS-Level System Notifications 🌸
self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("push", (event) => {
  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = { title: "تنبيه من تحفة 🌸", body: event.data.text() };
    }
  }

  const title = data.title || "تحديث جديد من تحفة! 🚇";
  const options = {
    body: data.body || "لقد تم تحديث حالة طلبك المخصص.",
    icon: "/assets/logo.png",
    badge: "/assets/logo.png",
    dir: "rtl",
    vibrate: [200, 100, 200],
    data: {
      url: data.url || "/"
    }
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: "window" }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === "/" && "focus" in client) {
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow("/");
      }
    })
  );
});
