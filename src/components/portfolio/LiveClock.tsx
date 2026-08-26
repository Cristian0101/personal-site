"use client";

import { useEffect, useMemo, useState } from "react";

const timeZone = "America/New_York";

function getClockParts(date: Date) {
  const timeParts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date);

  const detail = new Intl.DateTimeFormat("en-US", {
    timeZone,
    weekday: "short",
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "short",
    hour12: false,
  }).format(date);

  return {
    hour: timeParts.find((part) => part.type === "hour")?.value ?? "--",
    minute: timeParts.find((part) => part.type === "minute")?.value ?? "--",
    detail,
  };
}

export function LiveClock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const update = () => setNow(new Date());
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const clock = useMemo(() => (now ? getClockParts(now) : null), [now]);

  return (
    <div className="live-clock" aria-label={clock ? `Current New York time: ${clock.detail}` : "New York time loading"}>
      <span>New York</span>
      <span className="live-clock__time" aria-hidden="true">
        {clock?.hour ?? "--"}<span className="live-clock__colon">:</span>{clock?.minute ?? "--"}
      </span>
      <span className="live-clock__detail" role="tooltip">
        {clock?.detail ?? "Syncing New York time"}
      </span>
    </div>
  );
}
