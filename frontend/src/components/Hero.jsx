import React from "react";
import { ShieldCheck, Truck, Wrench } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden"
      style={{ background: "linear-gradient(135deg, #1a2e1a 0%, #2d4a2e 45%, #3b2a1a 100%)" }}>

      {/* Background texture blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-80px] left-[-80px] w-96 h-96 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #4a7c4e, transparent)" }} />
        <div className="absolute bottom-[-100px] right-[-60px] w-[500px] h-[500px] rounded-full opacity-15"
          style={{ background: "radial-gradient(circle, #8b5e3c, transparent)" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full opacity-5"
          style={{ background: "radial-gradient(circle, #d4a574, transparent)" }} />
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")", backgroundRepeat: "repeat", backgroundSize: "128px" }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-24 pt-28 w-full">
        <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">

          {/* LEFT CONTENT */}
          <div className="text-center md:text-left">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 mb-6 md:mb-8 px-4 py-2 rounded-full border text-sm font-medium"
              style={{ borderColor: "rgba(212,165,116,0.3)", background: "rgba(212,165,116,0.08)", color: "#d4a574" }}>
              <ShieldCheck className="w-4 h-4" />
              Since 1995 · Trusted by Families
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.1] mb-5 md:mb-6" style={{ color: "#f5f0e8" }}>
              भरोसेमंद<br />
              <span style={{ color: "#8fb97a" }}>हार्डवेयर</span> की<br />
              सही जगह
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg mb-8 md:mb-10 leading-relaxed max-w-md mx-auto md:mx-0" style={{ color: "rgba(245,240,232,0.65)" }}>
              <span className="font-semibold" style={{ color: "#d4a574" }}>Kisan Traders</span> —
              घर की छोटी मरम्मत से लेकर बड़े काम तक,
              हर ज़रूरत का भरोसेमंद समाधान।
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mb-10 md:mb-14 justify-center md:justify-start">
              <button
                className="px-8 py-4 rounded-xl font-semibold text-base transition-all duration-200 active:scale-[0.97] shadow-lg"
                style={{ background: "#8fb97a", color: "#1a2e1a" }}
                onMouseEnter={e => e.target.style.background = "#7aa868"}
                onMouseLeave={e => e.target.style.background = "#8fb97a"}
              >
                Shop Now →
              </button>
              <button className="px-8 py-4 rounded-xl font-semibold text-base transition-all duration-200 active:scale-[0.97] border-2"
                style={{ borderColor: "rgba(212,165,116,0.4)", color: "#d4a574", background: "transparent" }}
                onMouseEnter={e => { e.target.style.background = "rgba(212,165,116,0.1)" }}
                onMouseLeave={e => { e.target.style.background = "transparent" }}>
                View Deals
              </button>
            </div>

            {/* Trust Strips */}
            <div className="flex flex-wrap gap-4 md:gap-6 justify-center md:justify-start">
              {[
                { icon: <ShieldCheck className="w-4 h-4" />, text: "Quality Assured" },
                { icon: <Truck className="w-4 h-4" />, text: "Fast Delivery" },
                { icon: <Wrench className="w-4 h-4" />, text: "500+ Products" },
              ].map(item => (
                <div key={item.text} className="flex items-center gap-2 text-sm" style={{ color: "rgba(245,240,232,0.5)" }}>
                  <span style={{ color: "#8fb97a" }}>{item.icon}</span>
                  {item.text}
                </div>
              ))}
            </div>

          </div>

          {/* RIGHT IMAGE */}
          <div className="relative flex justify-center md:justify-end mt-8 md:mt-0">
            <div className="absolute inset-0 rounded-3xl opacity-20 blur-xl"
              style={{ background: "radial-gradient(ellipse, #8fb97a, transparent 70%)" }} />

            <div className="relative w-full max-w-[420px] md:max-w-[520px]">
              <img
                src="/shop.jpg"
                alt="Kisan Traders Shop"
                className="w-full rounded-3xl shadow-2xl object-cover"
                style={{ border: "1px solid rgba(255,255,255,0.08)" }}
              />
              <div className="absolute bottom-0 left-0 right-0 h-1/3 rounded-b-3xl"
                style={{ background: "linear-gradient(to top, rgba(26,46,26,0.6), transparent)" }} />

              {/* Floating cards — hidden on very small screens */}
              <div className="absolute -bottom-4 -left-4 sm:-bottom-5 sm:-left-5 px-4 sm:px-5 py-3 sm:py-4 rounded-2xl shadow-xl hidden sm:block"
                style={{ background: "#f5f0e8", border: "1px solid rgba(0,0,0,0.06)" }}>
                <p className="font-bold text-sm" style={{ color: "#2d4a2e" }}>Quality Products</p>
                <p className="text-xs mt-0.5" style={{ color: "#7a6a5a" }}>Affordable Retail Prices</p>
              </div>

              <div className="absolute -top-4 -right-4 sm:-top-5 sm:-right-5 px-3 sm:px-4 py-2.5 sm:py-3 rounded-2xl shadow-xl hidden sm:flex items-center gap-2"
                style={{ background: "#2d4a2e", border: "1px solid rgba(143,185,122,0.2)" }}>
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center" style={{ background: "rgba(143,185,122,0.2)" }}>
                  <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" style={{ color: "#8fb97a" }} />
                </div>
                <div>
                  <p className="text-xs font-semibold" style={{ color: "#f5f0e8" }}>30 Years</p>
                  <p className="text-xs" style={{ color: "rgba(245,240,232,0.5)" }}>of Trust</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;