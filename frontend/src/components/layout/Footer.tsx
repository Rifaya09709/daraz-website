
import { Link } from "react-router-dom";
import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaLinkedin,
  FaCcVisa,
  FaCcMastercard,
  FaCcPaypal,
  FaGooglePlay,
  FaApple,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
} from "react-icons/fa";
import { SiRazorpay } from "react-icons/si";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-16">
      {/* Newsletter */}
      <div className="bg-primary/10 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold">Subscribe to our Newsletter</h3>
            <p className="text-gray-400 text-sm mt-1">
              Get exclusive deals, offers and updates straight to your inbox.
            </p>
          </div>

          <form className="flex w-full md:w-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-4 py-3 rounded-l-lg text-gray-900 outline-none w-full md:w-72"
            />
            <button
              type="submit"
              className="bg-primary hover:bg-orange-600 px-6 py-3 rounded-r-lg font-semibold whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
        <div className="col-span-2 lg:col-span-1">
          <h2 className="text-2xl font-bold text-primary">Daraz Clone</h2>
          <p className="mt-4 text-gray-400 text-sm leading-6">
            Shop electronics, fashion, groceries, beauty, home appliances and
            much more — all in one place.
          </p>

          <div className="mt-5 space-y-2 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-primary shrink-0" />
              <span>Chennai, Tamil Nadu, India</span>
            </div>
            <div className="flex items-center gap-2">
              <FaPhoneAlt className="text-primary shrink-0" />
              <span>+91 98765 43210</span>
            </div>
            <div className="flex items-center gap-2">
              <FaEnvelope className="text-primary shrink-0" />
              <span>support@darazclone.com</span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-4">Customer Care</h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li><Link to="/help">Help Center</Link></li>
            <li><Link to="/how-to-buy">How to Buy</Link></li>
            <li><Link to="/returns">Returns & Refunds</Link></li>
            <li><Link to="/shipping">Shipping Info</Link></li>
            <li><Link to="/warranty">Warranty Policy</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-4">Company</h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/careers">Careers</Link></li>
            <li><Link to="/press">Press Center</Link></li>
            <li><Link to="/privacy">Privacy Policy</Link></li>
            <li><Link to="/terms">Terms & Conditions</Link></li>
            <li><Link to="/sitemap">Sitemap</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-4">Sell With Us</h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li><Link to="/seller/register">Become a Seller</Link></li>
            <li><Link to="/seller/dashboard">Seller Center</Link></li>
            <li><Link to="/seller/guide">Selling Guide</Link></li>
            <li><Link to="/affiliate">Affiliate Program</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-4">Popular Categories</h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li><Link to="/products?category=Mobiles">Mobiles</Link></li>
            <li><Link to="/products?category=Fashion">Fashion</Link></li>
            <li><Link to="/products?category=Electronics">Electronics</Link></li>
            <li><Link to="/products?category=Home">Home & Living</Link></li>
            <li><Link to="/products?category=Beauty">Beauty</Link></li>
          </ul>
        </div>
      </div>

      {/* App Download + Payment */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h4 className="font-semibold mb-3">Download Our App</h4>
            <div className="flex gap-3">
              <a
                href="#"
                className="flex items-center gap-2 border border-gray-700 rounded-lg px-4 py-2 hover:bg-gray-800"
              >
                <FaGooglePlay size={20} />
                <span className="text-sm">Google Play</span>
              </a>
              <a
                href="#"
                className="flex items-center gap-2 border border-gray-700 rounded-lg px-4 py-2 hover:bg-gray-800"
              >
                <FaApple size={20} />
                <span className="text-sm">App Store</span>
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-center md:text-right">
              We Accept
            </h4>
            <div className="flex gap-4 text-3xl text-gray-400">
              <FaCcVisa />
              <FaCcMastercard />
              <FaCcPaypal />
              <SiRazorpay size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 py-5">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © 2026 Daraz Clone. All Rights Reserved.
          </p>

          <div className="flex gap-5 text-xl text-gray-400">
            <a href="#" aria-label="Facebook" className="hover:text-primary">
              <FaFacebook />
            </a>
            <a href="#" aria-label="Instagram" className="hover:text-primary">
              <FaInstagram />
            </a>
            <a href="#" aria-label="Twitter" className="hover:text-primary">
              <FaTwitter />
            </a>
            <a href="#" aria-label="YouTube" className="hover:text-primary">
              <FaYoutube />
            </a>
            <a href="#" aria-label="LinkedIn" className="hover:text-primary">
              <FaLinkedin />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
