import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaBoxOpen,
  FaTrophy,
  FaBolt,
  FaTruck,
  FaShieldAlt,
  FaHandshake,
  FaLightbulb,
  FaUsers,
  FaHeart,
  FaBalanceScale,
} from "react-icons/fa";

import { searchUnsplashPhotos } from "../services/unsplash.service";
import ImageSlider from "../components/about/ImageSlider";
import HorizontalScroller from "../components/about/HorizontalScroller";

const stats = [
  { label: "100%+ Annual Growth", icon: <FaBolt size={32} /> },
  { label: "200,000 Active Sellers", icon: <FaUsers size={32} /> },
  { label: "1 Million+ Users", icon: <FaHeart size={32} /> },
];

const benefits = [
  { label: "Biggest Variety", icon: <FaBoxOpen size={28} /> },
  { label: "Best Prices", icon: <FaTrophy size={28} /> },
  { label: "Ease & Speed", icon: <FaBolt size={28} /> },
  { label: "Fast Delivery", icon: <FaTruck size={28} /> },
  { label: "100% Protected", icon: <FaShieldAlt size={28} /> },
];

const values = [
  { label: "Ownership", icon: <FaHandshake size={28} /> },
  { label: "Create Change", icon: <FaLightbulb size={28} /> },
  { label: "Teamwork", icon: <FaUsers size={28} /> },
  { label: "Customer Commitment", icon: <FaHeart size={28} /> },
  { label: "Integrity", icon: <FaBalanceScale size={28} /> },
];

// Reveals children with a fade-up animation once they scroll into view
const Reveal = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={visible ? "animate-fadeInUp" : "opacity-0"}>
      {children}
    </div>
  );
};

const FALLBACK_HERO = [
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200",
  "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1200",
  "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200",
];

const AboutUs = () => {
  const [heroImages, setHeroImages] = useState<string[]>(FALLBACK_HERO);
  const [teamImages, setTeamImages] = useState<string[]>([]);
  const [warehouseImages, setWarehouseImages] = useState<string[]>([]);
  const [deliveryImages, setDeliveryImages] = useState<string[]>([]);
  const [scrollerImages, setScrollerImages] = useState<string[]>([]);

  useEffect(() => {
    loadImages("shopping fashion sale", setHeroImages, 3);
    loadImages("office team meeting", setTeamImages, 3);
    loadImages("warehouse logistics", setWarehouseImages, 3);
    loadImages("delivery courier motorbike", setDeliveryImages, 3);
    loadImages("online shopping product", setScrollerImages, 8);
  }, []);

  const loadImages = async (
    query: string,
    setter: (urls: string[]) => void,
    count: number
  ) => {
    try {
      const res = await searchUnsplashPhotos(query);
      const urls = res.photos?.slice(0, count).map((p: any) => p.url);
      if (urls && urls.length > 0) setter(urls);
    } catch {
      // Silently keep fallback/empty — page still works without live images
    }
  };

  return (
    <div className="bg-white overflow-hidden">
      {/* Hero — sliding banner */}
      <section className="relative h-[420px] md:h-[520px]">
        <ImageSlider images={heroImages} className="h-full" />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center px-5">
          <div className="text-center text-white max-w-3xl">
            <h1 className="text-3xl md:text-5xl font-bold leading-tight">
              Daraz Clone is a mall, a marketplace and a community
            </h1>
            <p className="mt-5 text-lg text-orange-100">
              Empowering thousands of sellers to connect with millions of
              customers, every single day.
            </p>
          </div>
        </div>
      </section>

      {/* Who we are */}
      <Reveal>
        <section className="max-w-4xl mx-auto px-5 py-16 text-center">
          <h2 className="text-2xl font-bold text-primary mb-5">Who We Are</h2>
          <p className="text-gray-600 leading-8">
            Daraz Clone is a growing online marketplace built to connect
            sellers with customers across the region. We provide easy access
            to thousands of products across 10+ categories, delivering to
            customers with speed and reliability. We're a mall, a
            marketplace, and a community — helping entrepreneurs grow their
            business online.
          </p>
        </section>
      </Reveal>

      {/* Scrolling product strip */}
      {scrollerImages.length > 0 && (
        <Reveal>
          <section className="py-10 bg-gray-50">
            <HorizontalScroller images={scrollerImages} />
          </section>
        </Reveal>
      )}

      {/* Stats */}
      <Reveal>
        <section className="py-16">
          <div className="max-w-5xl mx-auto px-5 grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center gap-3 hover:-translate-y-1 transition-transform"
              >
                <div className="text-primary">{stat.icon}</div>
                <p className="font-semibold text-gray-700 text-lg">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      {/* Team banner — slider */}
      <Reveal>
        <section className="relative h-[320px] md:h-[400px]">
          <ImageSlider images={teamImages.length > 0 ? teamImages : FALLBACK_HERO} className="h-full" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center px-8 md:px-16">
            <div className="text-white max-w-md">
              <h2 className="text-2xl md:text-3xl font-bold mb-3">
                Built by a Passionate Team
              </h2>
              <p className="text-gray-200 leading-7">
                A diverse team working every day to make online shopping
                simple, fast, and reliable for everyone.
              </p>
            </div>
          </div>
        </section>
      </Reveal>

      {/* Benefits */}
      <Reveal>
        <section className="max-w-5xl mx-auto px-5 py-16">
          <h2 className="text-2xl font-bold text-center mb-12">
            Why Shop With Us
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-center">
            {benefits.map((b) => (
              <div
                key={b.label}
                className="flex flex-col items-center gap-3 hover:-translate-y-1 transition-transform"
              >
                <div className="text-primary bg-secondary w-16 h-16 rounded-full flex items-center justify-center">
                  {b.icon}
                </div>
                <p className="text-sm font-medium text-gray-700">
                  {b.label}
                </p>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      {/* Our Mission — dark section */}
      <Reveal>
        <section className="bg-gray-900 text-white py-20">
          <div className="max-w-4xl mx-auto px-5 text-center">
            <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
            <p className="text-gray-300 leading-8 text-lg md:text-xl">
              Make it easy to do business anywhere in the era of the digital
              economy.
            </p>
          </div>
        </section>
      </Reveal>

      {/* Warehouse banner — slider */}
      <Reveal>
        <section className="relative h-[320px] md:h-[400px]">
          <ImageSlider images={warehouseImages.length > 0 ? warehouseImages : FALLBACK_HERO} className="h-full" />
          <div className="absolute inset-0 bg-gradient-to-l from-black/60 to-transparent flex items-center justify-end px-8 md:px-16">
            <div className="text-white max-w-md text-right">
              <h2 className="text-2xl md:text-3xl font-bold mb-3">
                Modern Fulfilment Centers
              </h2>
              <p className="text-gray-200 leading-7">
                Our warehouses are built for speed — getting your order
                packed and out the door faster than ever.
              </p>
            </div>
          </div>
        </section>
      </Reveal>

      {/* Values */}
      <Reveal>
        <section className="max-w-5xl mx-auto px-5 py-16">
          <h2 className="text-2xl font-bold text-center mb-12">
            Our Values
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-center">
            {values.map((v) => (
              <div
                key={v.label}
                className="flex flex-col items-center gap-3 hover:-translate-y-1 transition-transform"
              >
                <div className="text-primary bg-secondary w-16 h-16 rounded-full flex items-center justify-center">
                  {v.icon}
                </div>
                <p className="text-sm font-medium text-gray-700">
                  {v.label}
                </p>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      {/* University for entrepreneurs */}
      <Reveal>
        <section className="bg-secondary py-16">
          <div className="max-w-4xl mx-auto px-5 text-center">
            <h2 className="text-2xl font-bold text-primary mb-4">
              A University for Entrepreneurs
            </h2>
            <p className="text-gray-600 leading-8">
              We believe anyone with a smartphone can start a business.
              That's why we provide free training and support to help
              sellers succeed on our platform — from onboarding guides to
              ongoing seller education.
            </p>
          </div>
        </section>
      </Reveal>

      {/* Delivery banner — slider */}
      <Reveal>
        <section className="relative h-[320px] md:h-[400px]">
          <ImageSlider images={deliveryImages.length > 0 ? deliveryImages : FALLBACK_HERO} className="h-full" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center px-8 md:px-16">
            <div className="text-white max-w-md">
              <h2 className="text-2xl md:text-3xl font-bold mb-3">
                Fast, Reliable Delivery
              </h2>
              <p className="text-gray-200 leading-7">
                From our doors to yours — tracked, protected, and delivered
                on time, every time.
              </p>
            </div>
          </div>
        </section>
      </Reveal>

      {/* Purchase Protection */}
      <Reveal>
        <section className="max-w-4xl mx-auto px-5 py-16 text-center">
          <h2 className="text-2xl font-bold mb-4">
            Our Purchase Protection
          </h2>
          <p className="text-gray-600 leading-8">
            We work hard to minimise mistakes — but when they do happen, we
            make them right. Every order is covered by our 14-day easy
            return policy and secure payment options, so you can shop with
            confidence.
          </p>
        </section>
      </Reveal>

      {/* CTA */}
      <Reveal>
        <section className="bg-gradient-to-r from-primary to-orange-600 py-16 text-center text-white">
          <h2 className="text-3xl font-bold mb-5">Start Shopping Today</h2>
          <Link
            to="/products"
            className="inline-block bg-white text-primary font-semibold px-10 py-4 rounded-lg hover:bg-gray-100 transition text-lg"
          >
            Browse Products
          </Link>
        </section>
      </Reveal>
    </div>
  );
};

export default AboutUs;