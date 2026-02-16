"use client";

import type { LucideIcon } from "lucide-react";
import {
  Zap,
  Wrench,
  Hammer,
  Wind,
  Sparkles,
  Bug,
  Users,
  Package,
  Drill,
  Paintbrush2,
  Phone,
  Mail,
  CheckCircle2,
  Shield,
  Clock,
} from "lucide-react";

/* -------------------- DATA -------------------- */

interface Service {
  icon: LucideIcon;
  name: string;
  description: string;
}

interface Standard {
  icon: LucideIcon;
  title: string;
  description: string;
}

const services: Service[] = [
  { icon: Zap, name: "Electrician", description: "Professional electrical services" },
  { icon: Wrench, name: "Plumber", description: "Expert plumbing solutions" },
  { icon: Hammer, name: "Handyman", description: "General maintenance services" },
  { icon: Paintbrush2, name: "Painter", description: "Professional painting services" },
  { icon: Wind, name: "AC Services", description: "Air conditioning maintenance" },
  { icon: Sparkles, name: "Cleaning", description: "Professional cleaning services" },
  { icon: Bug, name: "Pest Control", description: "Safe pest management" },
  { icon: Users, name: "Maid Services", description: "Household help" },
  { icon: Package, name: "Packers & Movers", description: "Moving solutions" },
  { icon: Drill, name: "Electronics Repair", description: "Device repair services" },
  { icon: Paintbrush2, name: "Home Appliances", description: "Appliance repairs" },
  { icon: Hammer, name: "Interior Renovation", description: "Home renovation services" },
];

const emirates = [
  "Dubai",
  "Abu Dhabi",
  "Sharjah",
  "Coming Soon: Other Emirates",
];

const standards: Standard[] = [
  {
    icon: Shield,
    title: "Professional Background Verification",
    description:
      "All our service professionals are carefully selected and verified to ensure safety, reliability, and quality service.",
  },
  {
    icon: CheckCircle2,
    title: "Complete Customer Satisfaction",
    description:
      "With timely service, flexible pricing, and guaranteed quality, customer satisfaction is always our priority.",
  },
  {
    icon: Clock,
    title: "24/7 Availability",
    description:
      "Book services anytime with our round-the-clock availability, day or night.",
  },
  {
    icon: Zap,
    title: "Secure & Cost-Effective",
    description:
      "Our secure technology platform ensures safe payments and competitive pricing.",
  },
];

/* -------------------- PAGE -------------------- */

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background text-black">
      {/* Header */}
      <header className="bg-secondary text-white py-16 md:py-24 mt-24">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Your Home Services, Reimagined
          </h1>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl">
            A technology platform bringing home maintenance and lifestyle services closer to you, 24/7.
          </p>
        </div>
      </header>

      {/* Mission */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Mission</h2>
            <p className="text-lg text-gray-600 mb-6">
              We focus on understanding customer needs and integrating modern technology to deliver a seamless experience.
            </p>
            <p className="text-lg text-gray-600">
              Our mission is to be your one-stop solution for reliable, affordable, and secure home services.
            </p>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-primary/10 rounded-lg -rotate-3" />
            <div className="relative bg-white rounded-lg p-8 shadow-lg">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-3xl font-bold text-primary">24/7</div>
                  <p className="text-sm text-gray-500">Available</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">∞</div>
                  <p className="text-sm text-gray-500">Services</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">✓</div>
                  <p className="text-sm text-gray-500">Guaranteed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 md:py-24 bg-secondary/5">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-10">Our Services</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map(({ icon: Icon, name, description }) => (
              <div
                key={name}
                className="bg-white rounded-lg p-6 border border-primary/10 hover:shadow-lg transition"
              >
                <Icon className="w-8 h-8 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">{name}</h3>
                <p className="text-gray-600">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16 md:py-24 bg-background">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 px-4">
          <div className="bg-white p-8 rounded-lg border">
            <div className="flex items-center gap-3 mb-3">
              <Phone className="text-primary" />
              <h3 className="font-semibold text-primary">Customer Care</h3>
            </div>
            <p className="text-2xl font-bold">600 576 365</p>
            <p className="text-sm text-gray-500">Available 24/7</p>
          </div>

          <div className="bg-white p-8 rounded-lg border">
            <div className="flex items-center gap-3 mb-3">
              <Mail className="text-primary" />
              <h3 className="font-semibold text-primary">Email</h3>
            </div>
            <a
              href="mailto:info@zushh.com"
              className="text-xl font-semibold text-secondary"
            >
              info@zushh.com
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
