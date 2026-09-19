"use client";

import { useEffect, useState } from "react";

const timeZone = "America/New_York";

function getClock(date: Date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
    timeZoneName: "short",
  }).formatToParts(date);

  const read = (type: Intl.DateTimeFormatPartTypes) => parts.find((part) => part.type === type)?.value ?? "";

  return {
    hour: read("hour"),
    minute: read("minute"),
    second: read("second"),
    dayPeriod: read("dayPeriod"),
    zone: read("timeZoneName") || "ET",
  };
}

export function LiveClock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  const clock = now ? getClock(now) : null;
  const label = clock
    ? `Local time in New York: ${clock.hour}:${clock.minute}:${clock.second} ${clock.dayPeriod} ${clock.zone}`
    : "New York time";

  return (
    <time className="live-clock" dateTime={now?.toISOString()} aria-label={label}>
      <span className="live-clock__time" aria-hidden="true">
        {clock ? (
          <>
            {clock.hour}
            <span className="live-clock__colon">:</span>
            {clock.minute}
            <span className="live-clock__colon">:</span>
            {clock.second}
          </>
        ) : (
          "--:--:--"
        )}
      </span>
      <span className="live-clock__meta">
        {clock ? `${clock.dayPeriod} ${clock.zone}` : "ET"}
      </span>
    </time>
  );
}
