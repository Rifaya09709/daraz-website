import { useState } from "react";

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallbackSeed?: string; // optional keyword hint, e.g. "fashion", "smartphone"
}

// Picks 1-2 meaningful words from the alt/seed text to use as a search
// keyword, so the fallback photo is actually relevant (a "Fashion" tile
// gets a clothing photo, not a random unrelated image).
const toKeyword = (text: string) => {
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 2);
  return (words.slice(0, 2).join(",") || "product").trim();
};

/**
 * Drop-in replacement for <img>. If the real image (e.g. "/images/phone.jpg")
 * doesn't exist yet in /public/images, this automatically swaps to a
 * keyword-relevant stock photo instead of a random/unrelated placeholder.
 *
 * Usage: <SafeImage src={p.image} alt={p.name} fallbackSeed="smartphone" className="..." />
 */
const SafeImage = ({ src, alt, fallbackSeed, className, ...rest }: SafeImageProps) => {
  const [errored, setErrored] = useState(false);

  const keyword = toKeyword(fallbackSeed || alt || "product");
  const placeholder = `https://loremflickr.com/400/400/${encodeURIComponent(keyword)}`;

  return (
    <img
      src={errored ? placeholder : src}
      alt={alt}
      onError={() => setErrored(true)}
      className={className}
      {...rest}
    />
  );
};

export default SafeImage;