
import { useNavigate } from "react-router-dom";
import {
  FaMobileAlt,
  FaLaptop,
  FaTshirt,
  FaCouch,
  FaHeartbeat,
  FaGamepad,
  FaAppleAlt,
  FaBaby,
} from "react-icons/fa";

const categories = [
  { id: 1, name: "Mobiles", icon: <FaMobileAlt size={32} /> },
  { id: 2, name: "Laptops", icon: <FaLaptop size={32} /> },
  { id: 3, name: "Fashion", icon: <FaTshirt size={32} /> },
  { id: 4, name: "Furniture", icon: <FaCouch size={32} /> },
  { id: 5, name: "Health", icon: <FaHeartbeat size={32} /> },
  { id: 6, name: "Gaming", icon: <FaGamepad size={32} /> },
  { id: 7, name: "Groceries", icon: <FaAppleAlt size={32} /> },
  { id: 8, name: "Baby", icon: <FaBaby size={32} /> },
];

const Categories = () => {
  const navigate = useNavigate();

  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold mb-8">Shop by Category</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-5">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() =>
              navigate(`/products?category=${encodeURIComponent(category.name)}`)
            }
            className="bg-white rounded-xl shadow hover:shadow-xl transition-all duration-300 p-6 flex flex-col items-center hover:-translate-y-1"
          >
            <div className="text-primary">{category.icon}</div>
            <h3 className="mt-4 text-sm font-semibold text-center">
              {category.name}
            </h3>
          </button>
        ))}
      </div>
    </section>
  );
};

export default Categories;
