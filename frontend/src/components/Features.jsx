import React from "react";
import { Headphones, Shield, Truck } from "lucide-react";

const features = [
  {
    icon: <Truck className="w-6 h-6" />,
    title: "Free Shipping",
    desc: "On orders over ₹999",
    iconBg: "rgba(143,185,122,0.15)",
    iconColor: "#4a7c4e",
    accent: "#8fb97a",
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Secure Payment",
    desc: "100% secure transactions",
    iconBg: "rgba(212,165,116,0.15)",
    iconColor: "#7a4f2e",
    accent: "#d4a574",
  },
  {
    icon: <Headphones className="w-6 h-6" />,
    title: "24/7 Support",
    desc: "Dedicated support team",
    iconBg: "rgba(143,185,122,0.1)",
    iconColor: "#2d4a2e",
    accent: "#5c7a4e",
  },
];

const Features = () => {
  return (
    <section className="py-6" style={{ background: "#f5f0e8" }}>
      <div className="max-w-7xl mx-auto px-6">

        <div className="grid md:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <div
              key={i}
              className="flex items-center gap-5 px-6 py-5 rounded-2xl border transition-all duration-200 hover:shadow-md group"
              style={{ background: "#fff", borderColor: "rgba(0,0,0,0.06)" }}
            >
              {/* Icon */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-110"
                style={{ background: f.iconBg, color: f.iconColor }}
              >
                {f.icon}
              </div>

              {/* Text */}
              <div>
                <h3 className="font-semibold text-base" style={{ color: "#2d2d2d" }}>{f.title}</h3>
                <p className="text-sm mt-0.5" style={{ color: "#9a8a7a" }}>{f.desc}</p>
              </div>

              {/* Right accent line */}
              <div className="ml-auto w-1 h-8 rounded-full flex-shrink-0 opacity-40"
                style={{ background: f.accent }} />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Features;
