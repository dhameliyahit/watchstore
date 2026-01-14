import { ArrowRight, Facebook, Instagram, Twitter } from "lucide-react";
import { Link } from "react-router-dom"; // Internal routing

const Footer = () => {
  const currentYear = new Date().getFullYear();

  // Navigation Data for cleaner code
  const shopLinks = [
    { name: "New Arrivals", path: "/" },
    { name: "Best Sellers", path: "/" },
    { name: "Brands", path: "/" },
    { name: "Sale", path: "/" },
  ];

  const supportLinks = [
    { name: "Shipping & Returns", path: "/" },
    { name: "Contact Us", path: "/" },
    { name: "FAQ", path: "/" },
    { name: "Size Guide", path: "/" },
  ];

  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Column 1: Brand & Newsletter */}
          <div className="md:col-span-1">
            <Link
              to="/"
              className="text-2xl font-black tracking-tighter text-black"
            >
              EQUAL.
            </Link>
            <p className="mt-4 text-gray-500 text-xs leading-relaxed tracking-wide">
              Subscribe to receive updates, access to exclusive deals, and more.
            </p>
            <form className="mt-6 flex items-center border-b border-black py-2">
              <input
                type="email"
                placeholder="ENTER YOUR EMAIL"
                className="appearance-none bg-transparent border-none w-full text-gray-900 mr-3 py-1 px-2 leading-tight focus:outline-none text-[10px] font-bold tracking-widest"
                required
              />
              <button
                type="submit"
                className="shrink-0 text-black hover:translate-x-1 transition-transform"
              >
                <ArrowRight size={18} />
              </button>
            </form>
          </div>

          {/* Column 2: Shop Links */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-black mb-6">
              Shop
            </h4>
            <ul className="space-y-4">
              {shopLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-[11px] font-medium uppercase tracking-widest text-gray-500 hover:text-black transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Support Links */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-black mb-6">
              Support
            </h4>
            <ul className="space-y-4">
              {supportLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-[11px] font-medium uppercase tracking-widest text-gray-500 hover:text-black transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Socials (External Links) */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-black mb-6">
              Follow Us
            </h4>
            <div className="flex space-x-5 text-gray-500">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-black transition-colors"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-black transition-colors"
              >
                <Twitter size={20} />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-black transition-colors"
              >
                <Facebook size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
            © {currentYear} EQUAL. STUDIO. ALL RIGHTS RESERVED.
          </p>
          <div className="flex space-x-6">
            <Link
              to="/privacy"
              className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
