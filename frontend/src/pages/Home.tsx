import Hero from "../components/home/Hero";
import Categories from "../components/home/Categories";
import FlashSale from "../components/home/FlashSale";
import JustForYou from "../components/home/JustForYou";
import CategoryGrid from "../components/home/CategoryGrid";

import HomeSearchBar from "../components/home/HomeSearchBar";
import TrustStrip from "../components/home/TrustStrip";
import QuickIconsScroll from "../components/home/QuickIconsScroll";

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* App-style top section — mobile/tablet only (below lg breakpoint) */}
      <div className="lg:hidden">
        <HomeSearchBar />
        <TrustStrip />
        <QuickIconsScroll />
      </div>

      <Hero />
      <Categories />
      <CategoryGrid />
      <FlashSale />
      <JustForYou />
    </div>
  );
};

export default Home;