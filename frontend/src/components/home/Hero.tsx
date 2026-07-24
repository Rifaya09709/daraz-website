import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getRandomUnsplashPhoto } from "../../services/unsplash.service";
import SearchBar from "./SearchBar";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=700";

const Hero = () => {
  const [bannerUrl, setBannerUrl] = useState(FALLBACK_IMAGE);
  const [photographer, setPhotographer] = useState<{
    name: string;
    url: string;
  } | null>(null);

  useEffect(() => {
    fetchBanner();
  }, []);

  const fetchBanner = async () => {
    try {
      const res = await getRandomUnsplashPhoto("shopping fashion sale");
      const photo = res.photos?.[0];

      if (photo) {
        setBannerUrl(photo.url);
        setPhotographer({ name: photo.photographer, url: photo.photographerUrl });
      }
    } catch {
      // Silently fall back to the static image — a broken hero banner
      // shouldn't block the whole homepage from rendering
    }
  };

  return (
    <section className="bg-gradient-to-r from-orange-500 via-orange-400 to-yellow-400">
      {/* Mobile-only search bar — desktop already has one in the Header */}
      <div className="md:hidden px-4 pt-4">
        <SearchBar />
      </div>

      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between px-6 py-16 md:flex-row">
        {/* Left Content */}
        <div className="max-w-xl text-white">
          <h1 className="text-4xl font-bold leading-tight md:text-6xl">
            Shop Everything You Love
          </h1>

          <p className="mt-5 text-lg text-orange-100">
            Discover the best deals on fashion, electronics, beauty, home
            essentials and much more.
          </p>

          <Link
            to="/products"
            className="mt-8 inline-block rounded-lg bg-white px-8 py-3 font-semibold text-orange-500 transition hover:bg-gray-100"
          >
            Shop Now
          </Link>
        </div>

        {/* Right Image */}
        <div className="mt-10 md:mt-0 relative">
          <img
            src={bannerUrl}
            alt="Shopping hero banner"
            className="w-full max-w-md rounded-xl shadow-2xl"
          />

          {photographer && (
            <a
              href={photographer.url}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-2 right-2 bg-black/40 text-white text-[10px] px-2 py-1 rounded"
            >
              Photo by {photographer.name}
            </a>
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;