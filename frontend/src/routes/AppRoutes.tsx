import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Products from "../pages/Products";
import ProductDetails from "../pages/ProductDetails";
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";
import Payment from "../pages/Payment";
import Wishlist from "../pages/Wishlist";
import Orders from "../pages/Orders";
import OrderDetails from "../pages/OrderDetails";
import OrderSuccess from "../pages/OrderSuccess";
import Profile from "../pages/Profile";
import MessagesPage from "../pages/MessagesPage";
import ChatsPage from "../pages/ChatsPage";
import ActivitiesPage from "../pages/ActivitiesPage";
import CampaignPage from "../pages/CampaignPage";
import Login from "../pages/Login";
import Register from "../pages/Register";
import NotFound from "../pages/NotFound";
import PromosPage from "../pages/PromosPage";


import AboutUs from "../pages/AboutUs";
import HelpCenter from "../pages/HelpCenter";
import HowToBuy from "../pages/HowToBuy";
import Returns from "../pages/Returns";
import Terms from "../pages/Terms";
import PrivacyPolicy from "../pages/PrivacyPolicy";
import Contact from "../pages/Contact";
import ShippingInfo from "../pages/ShippingInfo";
import WarrantyPolicy from "../pages/WarrantyPolicy";
import Careers from "../pages/Careers";
import PressCenter from "../pages/PressCenter";
import SiteMap from "../pages/SiteMap";
import Affiliate from "../pages/Affiliate";
import ComingSoon from "../pages/ComingSoon";
import PickupPoints from "../pages/PickupPoints";
import Reviews from "../pages/Reviews";
import PaymentOptions from "../pages/PaymentOptions";
import FreeDeliveryPage from "../pages/campaigns/FreeDeliveryPage";
import LowPricePage from "../pages/campaigns/LowPricePage";

import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import BottomNav from "../components/layout/BottomNav";
import Account from "../pages/Account";
import ChannelsPage from "../pages/ChannelsPage";
import Channels from "../pages/Channels";
import OfficialMobilePage from "../pages/campaigns/OfficialMobilePage";
// ...your other page imports

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/pickup-points" element={<PickupPoints />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/payment-options" element={<PaymentOptions />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/orders/:id" element={<OrderDetails />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/messages" element={<MessagesPage />} />
        <Route path="/messages/chats" element={<ChatsPage />} />
        <Route path="/messages/chats/:id" element={<ChatsPage />} />
        <Route path="/messages/activities" element={<ActivitiesPage />} />
        <Route path="/messages/promos" element={<PromosPage />} />
        <Route path="/campaign/free-delivery" element={<FreeDeliveryPage />} />
        <Route path="/campaign/low-price" element={<LowPricePage />} />
            <Route path="/campaign/mobiles" element={<OfficialMobilePage />} />
        <Route path="/channelsPage" element={<ChannelsPage />} />
        <Route path="/channels" element={<Channels />} />

        <Route path="/about" element={<AboutUs />} />
        <Route path="/help" element={<HelpCenter />} />
        <Route path="/how-to-buy" element={<HowToBuy />} />
        <Route path="/returns" element={<Returns />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/shipping" element={<ShippingInfo />} />
        <Route path="/warranty" element={<WarrantyPolicy />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/press" element={<PressCenter />} />
        <Route path="/siteMap" element={<SiteMap />} />
        <Route path="/affiliate" element={<Affiliate />} />
        <Route path="/seller/register" element={<ComingSoon />} />
        <Route path="/seller/dashboard" element={<ComingSoon />} />
        <Route path="/seller/guide" element={<ComingSoon />} />
        <Route path="/account" element={<Account />} />

        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />
      <BottomNav trendingImages={["/images/p1.jpg", "/images/p2.jpg", "/images/p3.jpg"]} messageCount={4} />
    </BrowserRouter>
  );
};

export default AppRoutes;