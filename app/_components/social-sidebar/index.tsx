"use client";

import { usePathname } from "next/navigation";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTiktok, FaWhatsapp } from "react-icons/fa";

const SOCIAL_LINKS = [
  {
    href: "https://www.facebook.com/nordichomehealthcare",
    icon: FaFacebookF,
    label: "Facebook",
    color: "#1877F2",
  },
  {
    href: "https://www.instagram.com/nordichomehealthcare?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
    icon: FaInstagram,
    label: "Instagram",
    color: "#E4405F",
  },
  {
    href: "https://www.tiktok.com/@nordichomehealthcare",
    icon: FaTiktok,
    label: "TikTok",
    color: "#000000",
  },
  {
    href: "https://www.facebook.com/nordichomehealthcare",
    icon: FaLinkedinIn,
    label: "LinkedIn",
    color: "#0A66C2",
  },
];

const WHATSAPP_NUMBER = "971555828945";
const WHATSAPP_MESSAGE = "Hello! I'm interested in booking a service. Can you help?";

export const SocialSidebar = () => {
  const pathname = usePathname();

  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) return null;

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

  return (
    <>
      {/* Social icons sidebar — desktop only */}
      <aside className="hidden xl:block fixed right-4 top-1/2 -translate-y-1/2 z-40">
        <div className="flex flex-col gap-3 bg-white border border-gray-200 rounded-2xl shadow-md py-4 px-2">
          {SOCIAL_LINKS.map(({ href, icon: Icon, label, color }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="w-9 h-9 flex items-center justify-center rounded-full text-white transition-all duration-300 hover:scale-110 hover:shadow-lg no-underline"
              style={{ backgroundColor: color }}
            >
              <Icon className="text-sm" />
            </a>
          ))}
        </div>
      </aside>

      {/* WhatsApp floating button — all screen sizes */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 flex items-center justify-center rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 no-underline"
        style={{ backgroundColor: "#25D366" }}
      >
        <FaWhatsapp className="text-white text-2xl" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse" />
      </a>
    </>
  );
};
