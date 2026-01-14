import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, ShoppingBag, User, X } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const { cart } = useCart();

  // Updated paths to reflect actual routes
  const navLinks = [
    { name: "Shop", href: "/shop" },
    { name: "Drops", href: "/drops" },
    { name: "Wishlist", href: "/wishlist" },
    { name: "Policies", href: "/policies" },
  ];

  // Helper to close menu when clicking a link on mobile
  const closeMenu = () => setIsOpen(false);

  return (
    <header className="bg-white border-b shadow-md border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* LEFT: Logo */}
          <div className="shrink-0 flex items-center">
            <Link 
              to="/" 
              className="text-2xl font-black tracking-tighter text-black"
            >
              EQUAL.
            </Link>
          </div>

          {/* CENTER: Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-600 hover:text-black transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* RIGHT: Actions */}
          <div className="flex items-center space-x-5">
            <Link
              to={user?.isAdmin ? "/admin" : "/account"}
              className="hidden sm:flex items-center space-x-2 text-[11px] font-bold uppercase tracking-widest text-gray-800 hover:text-black"
            >
              <User size={16} strokeWidth={2.5} />
              <span>{user?.isAdmin ? "Admin" : "Account"}</span>
            </Link>

            <Link 
              to="/cart"
              className="flex items-center space-x-2 border border-gray-200 rounded-full px-4 py-2 hover:bg-gray-50 transition-all"
            >
              <span className="text-[11px] font-bold uppercase tracking-widest">
                Cart{cart?.itemCount ? ` (${cart.itemCount})` : ""}
              </span>
              <ShoppingBag size={14} strokeWidth={2.5} />
            </Link>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button onClick={() => setIsOpen(!isOpen)} className="text-black focus:outline-none">
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 pb-6">
          <div className="px-4 pt-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                onClick={closeMenu} // Close menu on click
                className="block text-xs font-bold uppercase tracking-widest text-gray-600 py-2"
              >
                {link.name}
              </Link>
            ))}
            <hr className="border-gray-100 my-4" />
            <Link
              to={user?.isAdmin ? "/admin" : "/account"}
              onClick={closeMenu}
              className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest"
            >
              <User size={16} />
              <span>{user?.isAdmin ? "Admin" : "Account"}</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
