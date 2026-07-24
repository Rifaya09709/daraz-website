import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

import { channels } from "../types/channels.data";
import { getRandomUnsplashPhoto } from "../services/unsplash.service";
import SlideInPage from "../components/shared/SlideInPage";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900";

const themeClasses: Record<string, { bg: string; text: string; btn: string }> = {
  pink: { bg: "bg-pink-500", text: "text-pink-600", btn: "bg-pink-500" },
  red: { bg: "bg-red-500", text: "text-red-600", btn: "bg-red-500" },
  orange: { bg: "bg-orange-500", text: "text-orange-600", btn: "bg-orange-500" },
  amber: { bg: "bg-amber-500", text: "text-amber-600", btn: "bg-amber-500" },
  emerald: { bg: "bg-emerald-500", text: "text-emerald-600", btn: "bg-emerald-500" },
  lime: { bg: "bg-lime-500", text: "text-lime-600", btn: "bg-lime-500" },
};

const ChannelPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const config = slug ? channels[slug] : undefined;

  const [bannerUrl, setBannerUrl] = useState(FALLBACK_IMAGE);

  useEffect(() => {
    if (!config) return;
    getRandomUnsplashPhoto(config.unsplashKeyword)
      .then((res) => {
        const photo = res.photos?.[0];
        if (photo) setBannerUrl(photo.url);
      })
      .catch(() => {
        // Silently keep the fallback image
      });
  }, [config]);

  if (!config) {
    return (
      <div className="p-8 text-center text-gray-500">
        <p>This page isn't set up yet.</p>
        <Link to="/" className="text-primary font-medium">Go back home</Link>
      </div>
    );
  }

  const t = themeClasses[config.themeColor] ?? themeClasses.orange;

  return (
    <SlideInPage>
      <div className="min-h-screen bg-gray-50 pb-16">
        <div className="flex items-center gap-3 px-4 py-3 bg-white sticky top-0 z-10 border-b">
          <button onClick={() => navigate(-1)} className="text-gray-700">
            <FaArrowLeft size={18} />
          </button>
          <h1 className="text-lg font-bold text-gray-900">{config.title}</h1>
        </div>

        <div className="relative h-52 overflow-hidden">
          <img
            src={bannerUrl}
            alt={config.title}
            className="w-full h-full object-cover"
          />
          <div className={`absolute inset-0 ${t.bg} opacity-30`} />
        </div>

        <div className="max-w-lg mx-auto px-5 -mt-8 relative">
          <div className="bg-white rounded-2xl shadow p-5">
            <h2 className={`text-xl font-extrabold mb-1 ${t.text}`}>{config.title}</h2>
            <p className="text-sm text-gray-500 mb-4">{config.tagline}</p>
            <p className="text-sm text-gray-600 leading-relaxed mb-6">
              {config.description}
            </p>
            <Link
              to={config.ctaLink}
              className={`block text-center text-white font-semibold py-3 rounded-full ${t.btn}`}
            >
              {config.ctaLabel}
            </Link>
          </div>
        </div>
      </div>
    </SlideInPage>
  );
};

export default ChannelPage;