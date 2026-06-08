"use client";

import { usePathname } from "next/navigation";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTiktok } from "react-icons/fa";

const SOCIAL_LINKS = [
  {
    href: "https://www.facebook.com/nordichomehealthcare",
    icon: FaFacebookF,
    label: "Facebook",
  },
  {
    href: "https://www.instagram.com/nordichomehealthcare?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
    icon: FaInstagram,
    label: "Instagram",
  },
  {
    href: "https://www.tiktok.com/@nordichomehealthcare",
    icon: FaTiktok,
    label: "TikTok",
  },
  {
    href: "https://www.facebook.com/nordichomehealthcare",
    icon: FaLinkedinIn,
    label: "LinkedIn",
  },
];

export const SocialSidebar = () => {
  const pathname = usePathname();

  if (pathname !== "/") return null;

  return (
    <aside className="hidden xl:block fixed right-4 top-1/2 -translate-y-1/2 z-40">
      <div className="flex flex-col gap-3 bg-white border border-gray-200 rounded-2xl shadow-md py-4 px-2">
        {SOCIAL_LINKS.map(({ href, icon: Icon, label }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="w-8 h-8 flex items-center justify-center rounded-full text-white bg-[#543826] hover:bg-[#3e2a1c] hover:scale-110 transition-all duration-300 no-underline"
          >
            <Icon className="text-xs" />
          </a>
        ))}
      </div>
    </aside>
  );
};
