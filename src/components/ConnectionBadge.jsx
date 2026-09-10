import React, { useEffect, useState } from "react";

export default function ConnectionBadge() {
  const [online, setOnline] = useState(navigator.onLine);

  useEffect(function () {
    const up = function () { setOnline(true); };
    const down = function () { setOnline(false); };
    window.addEventListener("online", up);
    window.addEventListener("offline", down);
    return function () {
      window.removeEventListener("online", up);
      window.removeEventListener("offline", down);
    };
  }, []);

  return (
    <span className={"connection " + (online ? "online" : "offline")}>
      <span className="dot" />
      {online ? "Online" : "Offline"}
    </span>
  );
}