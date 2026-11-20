// Date-window helper for time-limited UI (e.g. nav items, campaign popups).
// Dates are absolute instants; write them with an explicit UTC offset
// (Dubai is +04:00).

export type ScheduleStatus = "active" | "locked" | "hidden";

export function getScheduleStatus(item: { visibleFrom?: Date; visibleUntil?: Date }, now: number | null): ScheduleStatus {
  if (!item.visibleFrom && !item.visibleUntil) return "active";
  if (now === null) {
    // Before the client clock is known: treat an upcoming item as locked
    // rather than assume it's active.
    return item.visibleFrom ? "locked" : "active";
  }
  if (item.visibleUntil && now > item.visibleUntil.getTime()) return "hidden";
  if (item.visibleFrom && now < item.visibleFrom.getTime()) return "locked";
  return "active";
}
