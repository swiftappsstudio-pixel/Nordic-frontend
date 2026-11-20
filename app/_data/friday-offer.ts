// Nordic Friday Offer — homepage popup campaign.
//
// Lists selected Nordic services and links to each one's regular service
// page. It makes no discount or price claims.
//
// Campaign window: through 29 November 2026, UAE time (UTC+4). The cutoff
// is EXCLUSIVE — from 2026-11-30 00:00 Dubai time the popup no longer shows,
// and an open one closes itself, with no redeploy needed. A row can also end
// earlier via its own `visibleUntil`.
//
// Home Nursing is intentionally not listed: the site has no Home Nursing
// service page yet. Add a row here once that page exists.

import { getScheduleStatus } from "@/app/_common/schedule";

export const FRIDAY_OFFER_CUTOFF = new Date("2026-11-30T00:00:00+04:00");

export type FridayOfferService = {
  id: string;
  name: string;
  description: string;
  /** Existing service page to open. */
  href: string;
  /** Portrait (9:16) loop + poster shown in the popup's media panel. */
  video: string;
  poster: string;
  /** Large overlay word and short line shown on the video. */
  word: string;
  tagline: string;
  visibleUntil?: Date;
};

export const FRIDAY_OFFER_SERVICES: FridayOfferService[] = [
  {
    id: "elderly-care",
    name: "Elderly Care",
    description: "Clinically-trained caregivers for your loved ones at home.",
    href: "/elderly-care",
    video: "/videos/friday-offer/elderly-care.mp4",
    poster: "/videos/friday-offer/elderly-care-poster.jpg",
    word: "Caring",
    tagline: "Someone who cares for them, and for you.",
  },
  {
    id: "baby-care",
    name: "Baby Care",
    description: "NICU-trained caregivers for newborn care at home.",
    href: "/mother-and-baby",
    video: "/videos/friday-offer/baby-care.mp4",
    poster: "/videos/friday-offer/baby-care-poster.jpg",
    word: "Devoted",
    tagline: "Gentle, expert care for your newborn.",
  },
];

export const isFridayCampaignLive = (now: number) => now < FRIDAY_OFFER_CUTOFF.getTime();

/** Services that are live right now; empty once the campaign cutoff passes. */
export function getEligibleFridayServices(now: number): FridayOfferService[] {
  if (!isFridayCampaignLive(now)) return [];
  return FRIDAY_OFFER_SERVICES.filter((s) => getScheduleStatus(s, now) === "active");
}

/** Next instant (ms) at which the eligible list can change, for scheduling. */
export function getNextFridayBoundary(now: number): number {
  let next = FRIDAY_OFFER_CUTOFF.getTime();
  for (const s of FRIDAY_OFFER_SERVICES) {
    // getScheduleStatus treats visibleUntil as inclusive, so it ends 1ms after.
    const end = s.visibleUntil ? s.visibleUntil.getTime() + 1 : Infinity;
    if (end > now && end < next) next = end;
  }
  return next;
}

// ─── Once-per-page-load flag ──────────────────────────────────────────────
// Kept in memory only: a hard reload or a fresh visit starts a new page load,
// so the popup shows again on the homepage. Client-side navigation back to
// the homepage within the same page load does not reopen it.
let shownThisPageLoad = false;

export function hasSeenFridayOffer(): boolean {
  return shownThisPageLoad;
}

export function markFridayOfferSeen() {
  shownThisPageLoad = true;
}

/** Whether the popup should open on this page right now. */
export function shouldShowFridayOffer(pathname: string, now: number): boolean {
  if (pathname !== "/") return false;
  if (hasSeenFridayOffer()) return false;
  return getEligibleFridayServices(now).length > 0;
}
