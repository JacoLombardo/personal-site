import { useEffect } from "react";

const SESSION_KEY = "visitRecorded";
const API = "/api/visit";

export default function VisitLogger() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(SESSION_KEY)) return;

    const payload = {
      path: window.location.pathname,
      referrer: document.referrer || "",
      language: navigator.language || undefined,
      timezone: Intl.DateTimeFormat().resolvedOptions?.().timeZone || undefined,
      screenWidth: window.screen?.width,
      screenHeight: window.screen?.height,
    };

    fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then(() => sessionStorage.setItem(SESSION_KEY, "1"))
      .catch(() => {});
  }, []);

  return null;
}
