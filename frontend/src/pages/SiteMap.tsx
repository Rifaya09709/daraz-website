import { Link } from "react-router-dom";

const sections = [
  {
    title: "Shop",
    links: [
      { label: "All Products", to: "/products" },
      { label: "Mobiles", to: "/products?category=Mobiles" },
      { label: "Fashion", to: "/products?category=Fashion" },
      { label: "Electronics", to: "/products?category=Electronics" },
      { label: "Beauty", to: "/products?category=Beauty" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Login", to: "/login" },
      { label: "Register", to: "/register" },
      { label: "My Orders", to: "/orders" },
      { label: "Wishlist", to: "/wishlist" },
      { label: "Cart", to: "/cart" },
    ],
  },
  {
    title: "Customer Care",
    links: [
      { label: "Help Center", to: "/help" },
      { label: "How to Buy", to: "/how-to-buy" },
      { label: "Returns & Refunds", to: "/returns" },
      { label: "Shipping Info", to: "/shipping" },
      { label: "Warranty Policy", to: "/warranty" },
      { label: "Contact Us", to: "/contact" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", to: "/about" },
      { label: "Careers", to: "/careers" },
      { label: "Press Center", to: "/press" },
      { label: "Privacy Policy", to: "/privacy" },
      { label: "Terms & Conditions", to: "/terms" },
    ],
  },
];

const Sitemap = () => {
  return (
    <div className="max-w-5xl mx-auto px-5 py-14">
      <h1 className="text-3xl md:text-4xl font-bold mb-12">Sitemap</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {sections.map((section) => (
          <div key={section.title}>
            <h2 className="font-semibold mb-4">{section.title}</h2>
            <ul className="space-y-2 text-sm">
              {section.links.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-gray-600 hover:text-primary">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sitemap;