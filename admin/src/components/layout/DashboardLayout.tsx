import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";

const DashboardLayout = () => {
  const location = useLocation();

  // Chats page needs a full-height, edge-to-edge layout (its own internal
  // scroll panes), so we drop the usual page padding just for that route
  const isChatsPage = location.pathname === "/chats";

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />

      {/* ml-64 offsets the fixed sidebar width so content doesn't sit under it */}
      <main className={`ml-64 min-h-screen ${isChatsPage ? "" : "p-8"}`}>
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;