import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import Upload from "./pages/Upload";
import Documents from "./pages/Documents";
import SharedView from "./pages/SharedView";
import PublicPortfolio from "./pages/PublicPortfolio";
import TrashBin from "./pages/TrashBin";
import Profile from "./pages/Profile";
import DocuBot from "./components/DocuBot";
import { getRouteName, identifyUserFromToken, initAnalytics, trackPageView } from "./services/analyticsService";

function AnalyticsRouteTracker() {
  const location = useLocation();

  useEffect(() => {
    initAnalytics();
  }, []);

  useEffect(() => {
    identifyUserFromToken(localStorage.getItem("token"));
    trackPageView(getRouteName(location.pathname));
  }, [location.pathname]);

  return null;
}

function App() {
  return (
    <BrowserRouter>
      <AnalyticsRouteTracker />
      <DocuBot />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/u/:userId" element={<PublicPortfolio />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/documents" element={<Documents />} />
        <Route path="/doc/:id" element={<SharedView />} />
        <Route path="/trash" element={<TrashBin />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
