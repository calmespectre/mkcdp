import { useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  Navigate,
  useLocation,
} from "react-router-dom";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import Home from "../components/home";
import AboutPage from "../pages/about-us";
import Auth from "../components/auth";
import OurWork from "../components/our-work";
import ProgramImpact from "../components/program";
import NewsAndStories from "../components/newsandstories";
import TakeAction from "../components/take-action";
import AccountDashboard from "../components/account-dashboard";
import Publications from "../components/publications";
import { GiftCartProvider } from "../components/giftCart";
import { EditorProvider, EditorToolbar } from "../components/editorContext";
import { AuthProvider, useAuth } from "../components/AuthContext";

function RequireAuth({ children }) {
  const location = useLocation();
  const { isAuthenticated, booting } = useAuth();

  if (booting) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#FBF7F0]">
        <div className="flex items-center gap-3">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-green-700/20 border-t-green-700" />
          <p className="text-[0.9rem] text-[#4A4A42]">Loading…</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/auth"
        replace
        state={{ from: location.pathname + location.search }}
      />
    );
  }

  return children;
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname]);
  return null;
}

function SiteLayout() {
  return (
    <div
      style={{ fontSize: "20px" }}
      className="flex min-h-screen flex-col bg-[#FBF7F0] font-[Montserrat]"
    >
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <EditorToolbar />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <GiftCartProvider>
        <EditorProvider>
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              <Route element={<SiteLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/about/:section" element={<AboutPage />} />
                <Route path="/take-action" element={<TakeAction />} />
                <Route path="/take-action/:section" element={<TakeAction />} />
                <Route path="/news-and-stories" element={<NewsAndStories />} />
                <Route path="/news-and-stories/:section" element={<NewsAndStories />} />
                <Route
                  path="/news-and-stories/:section/:slug"
                  element={<NewsAndStories />}
                />
                <Route path="/publications" element={<Publications />} />
                <Route
                  path="/account"
                  element={
                    <RequireAuth>
                      <AccountDashboard />
                    </RequireAuth>
                  }
                />
                <Route path="/our-work" element={<OurWork />} />
                <Route path="/our-work/:section" element={<OurWork />} />
                <Route path="/program-impact" element={<ProgramImpact />} />
                <Route path="/program-impact/:section" element={<ProgramImpact />} />
              </Route>

              <Route path="/auth" element={<Auth />} />
              <Route path="/signup" element={<Auth />} />
              <Route path="/signin" element={<Auth />} />
            </Routes>
          </BrowserRouter>
        </EditorProvider>
      </GiftCartProvider>
    </AuthProvider>
  );
}

export default App;