// Single source of truth for the Exclusive Offers rotation — the header
// dropdown and the site-wide promo alert both read from this file, so the
// two are guaranteed to switch on/off together with no manual updates.
//
// Schedule (Dubai time, UTC+4):
//   World Physiotherapy Day   — visible now, hides after 9 Sep 2026
//   World First Aid Day       — shows 9 Sep 2026, hides after 13 Sep 2026
//   World Patient Safety Day  — shows 13 Sep 2026, hides after 18 Sep 2026
// Each cutover day is a shared boundary in the nav (e.g. both Physiotherapy
// Day and First Aid Day are listed on 9 Sep itself) — see getActiveOffer()
// below for how the alert picks a single winner on those days.

export type OfferStatus = "active" | "locked" | "hidden";

export type ExclusiveOffer = {
  id: string;
  navLabel: string;
  navBadge: string;
  href: string;
  visibleFrom?: Date;
  visibleUntil?: Date;
  alertTitle: string;
  alertDate: string;
  alertBadge: string;
  alertDescription: string;
  alertVideo: string;
};

const PHYSIO_VISIBLE_UNTIL = new Date("2026-09-09T23:59:59+04:00");
const FIRST_AID_VISIBLE_FROM = new Date("2026-09-09T00:00:00+04:00");
const FIRST_AID_VISIBLE_UNTIL = new Date("2026-09-13T23:59:59+04:00");
const SAFETY_VISIBLE_FROM = new Date("2026-09-13T00:00:00+04:00");
const SAFETY_VISIBLE_UNTIL = new Date("2026-09-18T23:59:59+04:00");

export const EXCLUSIVE_OFFERS: ExclusiveOffer[] = [
  {
    id: "physiotherapy",
    navLabel: "World Physiotherapy Day",
    navBadge: "50% OFF",
    href: "/world-physiotherapy-day",
    visibleUntil: PHYSIO_VISIBLE_UNTIL,
    alertTitle: "World Physiotherapy Day",
    alertDate: "8 September 2026",
    alertBadge: "50% Off Physiotherapy",
    alertDescription: "A gift from your physio — celebrate World Physiotherapy Day with 50% off your session, delivered at home.",
    alertVideo: "/videos/world-physiotherapy-day/session.mp4",
  },
  {
    id: "first-aid",
    navLabel: "World First Aid Day",
    navBadge: "50% OFF",
    href: "/world-first-aid-day",
    visibleFrom: FIRST_AID_VISIBLE_FROM,
    visibleUntil: FIRST_AID_VISIBLE_UNTIL,
    alertTitle: "World First Aid Day",
    alertDate: "12 September 2026",
    alertBadge: "50% Off Blood Tests",
    alertDescription: "50% off Blood Test Services and 40% off other eligible services this World First Aid Day.",
    alertVideo: "/video/mother.mp4",
  },
  {
    id: "patient-safety",
    navLabel: "World Patient Safety Day",
    navBadge: "50% OFF",
    href: "/world-patient-safety-day",
    visibleFrom: SAFETY_VISIBLE_FROM,
    visibleUntil: SAFETY_VISIBLE_UNTIL,
    alertTitle: "World Patient Safety Day",
    alertDate: "7 September",
    alertBadge: "50% Off Elderly & Baby Care",
    alertDescription: "50% off Elderly & Baby Care and 40% off IV Therapy — safe, gentle care right at home.",
    alertVideo: "/images/older1.mp4",
  },
];

export function getOfferStatus(offer: { visibleFrom?: Date; visibleUntil?: Date }, now: number | null): OfferStatus {
  if (!offer.visibleFrom && !offer.visibleUntil) return "active";
  if (now === null) {
    // Safe default before the client clock is known: treat an upcoming
    // offer as locked rather than assume it's active, or hide one that
    // might actually be live.
    return offer.visibleFrom ? "locked" : "active";
  }
  if (offer.visibleUntil && now > offer.visibleUntil.getTime()) return "hidden";
  if (offer.visibleFrom && now < offer.visibleFrom.getTime()) return "locked";
  return "active";
}

// The single "currently active" offer for the promo alert. Later-launching
// campaigns win on a shared cutover day (e.g. First Aid Day over
// Physiotherapy Day on 9 Sep) so only one alert ever shows, even though the
// Exclusive Offers dropdown can list two items on that same boundary day.
export function getActiveOffer(now: number | null): ExclusiveOffer | null {
  if (now === null) return null;
  for (let i = EXCLUSIVE_OFFERS.length - 1; i >= 0; i--) {
    const offer = EXCLUSIVE_OFFERS[i];
    if (getOfferStatus(offer, now) === "active") return offer;
  }
  return null;
}
