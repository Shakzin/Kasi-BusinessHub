import { Routes, Route } from "react-router";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Businesses from "./pages/Businesses";
import Events from "./pages/Events";
import Subscription from "./pages/Subscription";
import Settings from "./pages/Settings";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import AppLayout from "./components/AppLayout";
import { AIChatWidget } from "./components/AIChatWidget";

export default function App() {
  return (
    <>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Authenticated routes */}
        <Route path="/dashboard" element={<AppLayout><Dashboard /></AppLayout>} />
        <Route path="/businesses" element={<AppLayout><Businesses /></AppLayout>} />
        <Route path="/events" element={<AppLayout><Events /></AppLayout>} />
        <Route path="/subscription" element={<AppLayout><Subscription /></AppLayout>} />
        <Route path="/settings" element={<AppLayout><Settings /></AppLayout>} />
        <Route path="/admin" element={<AppLayout><Admin /></AppLayout>} />

        <Route path="*" element={<NotFound />} />
      </Routes>
      <AIChatWidget />
    </>
  );
}
