import { Link } from "react-router-dom";

interface Category {
  name: string;
  image: string;
  slug: string;
}

// Category list — keyword-matched images via LoremFlickr (free, no API key, keyword-relevant)
const categories: Category[] = [
  { name: "Makeup & Beauty", image: "https://loremflickr.com/300/300/makeup,cosmetics", slug: "Beauty & Makeup" },
  { name: "Personal Care", image: "https://loremflickr.com/300/300/soap,skincare", slug: "Personal Care" },
  { name: "Kitchen Vessels", image: "https://loremflickr.com/300/300/cookware,kitchen", slug: "Home & Kitchen" },
  { name: "Groceries", image: "https://loremflickr.com/300/300/vegetables,grocery", slug: "Groceries" },
  { name: "Snacks & Chocolate", image: "https://loremflickr.com/300/300/chocolate,snacks", slug: "Groceries" },
  { name: "Home Essentials", image: "https://loremflickr.com/300/300/homedecor,cleaning", slug: "Home Essentials" },
  { name: "Fashion", image: "https://loremflickr.com/300/300/fashion,clothing", slug: "Fashion" },
  { name: "Electronics", image: "https://loremflickr.com/300/300/electronics,gadget", slug: "Electronics" },
  { name: "Mobiles", image: "https://loremflickr.com/300/300/smartphone,mobile", slug: "Mobiles" },
  { name: "Laptops", image: "https://loremflickr.com/300/300/laptop,computer", slug: "Laptops" },
  { name: "Furniture", image: "https://loremflickr.com/300/300/furniture,sofa", slug: "Furniture" },
  { name: "Baby Products", image: "https://loremflickr.com/300/300/baby,toys", slug: "Baby" },
  { name: "Watches", image: "https://loremflickr.com/300/300/wristwatch", slug: "Electronics" },
  { name: "Bags", image: "https://loremflickr.com/300/300/handbag,backpack", slug: "Fashion" },
  { name: "Toys & Games", image: "https://loremflickr.com/300/300/toys,kids", slug: "Gaming" },
  { name: "Sports", image: "https://loremflickr.com/300/300/sports,fitness", slug: "Health" },
  { name: "Gaming", image: "https://loremflickr.com/300/300/gaming,controller", slug: "Gaming" },
  { name: "Health", image: "https://loremflickr.com/300/300/medicine,health", slug: "Health" },
];

const CategoryGrid = () => {
  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-5 py-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base md:text-lg font-semibold text-gray-800">
            Categories
          </h2>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-x-2 gap-y-5">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={`/products?category=${encodeURIComponent(cat.slug)}`}
              className="flex flex-col items-center gap-1.5 group"
            >
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden bg-gray-50 border border-gray-100 group-hover:shadow-md transition-shadow pointer-events-none">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src =
                      "https://dummyimage.com/300x300/e5e7eb/9ca3af.png&text=" +
                      encodeURIComponent(cat.name);
                  }}
                />
              </div>
              <p className="text-[11px] md:text-xs text-center text-gray-600 group-hover:text-primary leading-tight line-clamp-2 max-w-[80px]">
                {cat.name}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryGrid;