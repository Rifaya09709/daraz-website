import { useEffect, useState } from "react";

interface SlideInPageProps {
  children: React.ReactNode;
}

/**
 * Wraps a page's content so it slides in from the right and fades in on
 * mount — gives route changes a native-app "push" feel without pulling in
 * a full animation library. Mount in true first, then flip to false on
 * the next tick so the browser registers the starting position before
 * transitioning.
 */
const SlideInPage = ({ children }: SlideInPageProps) => {
  const [entering, setEntering] = useState(true);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setEntering(false));
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      className={`transition-all duration-300 ease-out ${
        entering ? "translate-x-6 opacity-0" : "translate-x-0 opacity-100"
      }`}
    >
      {children}
    </div>
  );
};

export default SlideInPage;