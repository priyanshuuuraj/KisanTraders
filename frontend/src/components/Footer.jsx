import React from "react";
import { FaFacebook, FaInstagram, FaTwitterSquare, FaPinterest } from "react-icons/fa";
import { Wrench, MapPin, Phone, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer style={{ background: "#1a2e1a" }}>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid md:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-xl" style={{ background: "rgba(143,185,122,0.15)" }}>
                <Wrench className="w-4 h-4" style={{ color: "#8fb97a" }} />
              </div>
              <h2 className="text-lg font-bold" style={{ color: "#f5f0e8" }}>Kisan Traders</h2>
            </div>
            <p className="text-sm leading-relaxed mb-5" style={{ color: "rgba(245,240,232,0.45)" }}>
              Your trusted hardware destination since 1995. Quality tools, affordable prices, and expert service.
            </p>
            <div className="space-y-2">
              {[
                { icon: <MapPin className="w-3.5 h-3.5 flex-shrink-0" />, text: "Imamganj, Arwal, Bihar, India" },
                { icon: <Phone className="w-3.5 h-3.5 flex-shrink-0" />, text: "+91 7277450687" },
                { icon: <Mail className="w-3.5 h-3.5 flex-shrink-0" />, text: "hello@kisantraders.in" },
              ].map(item => (
                <div key={item.text} className="flex items-center gap-2 text-xs" style={{ color: "rgba(245,240,232,0.4)" }}>
                  <span style={{ color: "#8fb97a" }}>{item.icon}</span>
                  {item.text}
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest mb-5" style={{ color: "#d4a574" }}>
              Quick Links
            </h3>
            <ul className="space-y-3">
              {["Home", "Shop", "About", "Contact"].map(link => (
                <li key={link}>
                  <a href="#" className="text-sm transition-colors duration-150 hover:text-white"
                    style={{ color: "rgba(245,240,232,0.5)" }}>
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest mb-5" style={{ color: "#d4a574" }}>
              Customer Service
            </h3>
            <ul className="space-y-3 mb-7">
              {["FAQs", "Order Tracking", "Returns & Refunds", "Shipping Info"].map(link => (
                <li key={link}>
                  <a href="#" className="text-sm transition-colors duration-150 hover:text-white"
                    style={{ color: "rgba(245,240,232,0.5)" }}>
                    {link}
                  </a>
                </li>
              ))}
            </ul>

            {/* Social */}
            <h3 className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: "#d4a574" }}>
              Follow Us
            </h3>
            <div className="flex gap-3">
              {[FaFacebook, FaInstagram, FaTwitterSquare, FaPinterest].map((Icon, i) => (
                <a key={i} href="#"
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-150 hover:scale-110"
                  style={{ background: "rgba(143,185,122,0.1)", color: "rgba(245,240,232,0.5)" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(143,185,122,0.25)"; e.currentTarget.style.color = "#8fb97a" }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(143,185,122,0.1)"; e.currentTarget.style.color = "rgba(245,240,232,0.5)" }}
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: "#d4a574" }}>
              Stay in the Loop
            </h3>
            <p className="text-sm mb-5" style={{ color: "rgba(245,240,232,0.45)" }}>
              Subscribe for offers, new arrivals, and more.
            </p>
            <form className="flex flex-col gap-2" onSubmit={e => e.preventDefault()}>
              <input
                type="email"
                placeholder="your@email.com"
                className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(143,185,122,0.2)",
                  color: "#f5f0e8",
                }}
              />
              <button
                type="submit"
                className="w-full py-3 rounded-xl text-sm font-semibold transition-all duration-150 active:scale-[0.98]"
                style={{ background: "#8fb97a", color: "#1a2e1a" }}
                onMouseEnter={e => e.target.style.background = "#7aa868"}
                onMouseLeave={e => e.target.style.background = "#8fb97a"}
              >
                Subscribe →
              </button>
            </form>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row justify-between items-center gap-2">
          <p className="text-xs" style={{ color: "rgba(245,240,232,0.3)" }}>
            © {new Date().getFullYear()} Kisan Traders. All rights reserved.
          </p>
          <p className="text-xs" style={{ color: "rgba(245,240,232,0.2)" }}>
            Quality Hardware · Trusted Since 1995
          </p>
        </div>
      </div>

    </footer>
  );
};

export default Footer;
