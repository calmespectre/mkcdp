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

const ROUTE_TITLES = {
  "/about": "About",
  "/take-action": "Take action",
  "/news-and-stories": "News & stories",
  "/publications": "Publications",
  "/account": "My account",
  "/our-work": "Our work",
  "/program-impact": "Program impact",
  "/auth": "Sign in",
  "/signup": "Sign up",
  "/signin": "Sign in",
};

const SECTION_TITLES = {
  about: {
    "who-we-are": "Who we are",
    "strategic-plan": "Our strategic plan",
    accountability: "Accountability",
    safeguarding: "Safeguarding",
    leadership: "Our leadership",
    partners: "Our development partners",
  },
  "take-action": {
    "donate": "Donate",
    "sponsor-a-child": "Sponsor a child",
    "send-a-gift": "Send a gift",
    "send-a-gift-cart": "My basket",
    "volunteer": "Volunteer",
    "partnerships": "Partnerships",
    "report-safeguarding": "Report a safeguarding concern",
  },
  "our-work": {
    "where-we-work": "Wher we work",
    "how-we-work": "How we work",
  },
  "program-impact": {
    "our-reach": "Our reach",
    "featured-projects": "Featured projects",
  },
  "news-and-stories": {
    "stories-of-impact": "Stories of impact",
    "media-center": "Media center",
  },
};

function deriveTitle(pathname) {
  if (!pathname) return "MKCDP";
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) return "Mt. Kilimanjaro Child Programme | MKCDP";

  const rootPath = `/${segments[0]}`;
  const rootLabel = ROUTE_TITLES[rootPath] || segments[0];
  const second = segments[1];
  const third = segments[2];

  if (second && SECTION_TITLES[segments[0]] && SECTION_TITLES[segments[0]][second]) {
    return `${SECTION_TITLES[segments[0]][second]} | ${rootLabel} — MKCDP`;
  }

  if (third) {
    return `${rootLabel} | Mt. Kilimanjaro Child Programme`;
  }

  return `${rootLabel} | Mt. Kilimanjaro Child Programme`;
}

function GlobalStyles() {
  return (
    <style>{`
      *, *::before, *::after { box-sizing: border-box; }
      html { -webkit-text-size-adjust: 100%; text-size-adjust: 100%; scroll-behavior: smooth; }
      html, body, #root { width: 100%; max-width: 100%; min-height: 100%; }
      body { margin: 0; overflow-x: hidden; }
      #root { overflow-x: hidden; display: flex; flex-direction: column; }
      img, picture, video, canvas, svg, iframe, embed, object { max-width: 100%; }
      table { width: 100%; max-width: 100%; }
      pre, code { white-space: pre-wrap; word-break: break-word; }
      textarea, input, select { max-width: 100%; }
      .app-scale {
        width: 100%;
        max-width: 100%;
        min-height: 100dvh;
        font-size: clamp(0.875rem, 0.75rem + 0.5556vw, 1.25rem);
        line-height: 1.5;
        overflow-x: clip;
      }
      @supports not (overflow-x: clip) {
        .app-scale { overflow-x: hidden; }
      }
      @media (max-width: 480px) {
        .app-scale { font-size: clamp(0.875rem, 3.6vw, 1rem); }
      }
    `}</style>
  );
}

function DocumentTitle() {
  const { pathname } = useLocation();
  useEffect(() => {
    document.title = deriveTitle(pathname);
  }, [pathname]);
  return null;
}

function RequireAuth({ children }) {
  const location = useLocation();
  const { isAuthenticated, booting } = useAuth();

  if (booting) {
    return (
      <div className="flex min-h-[60vh] w-full items-center justify-center bg-[#FBF7F0]">
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
    <div className="flex min-h-[100dvh] w-full max-w-full flex-1 flex-col bg-[#FBF7F0] font-[Montserrat]">
      <Navbar />
      <main className="w-full max-w-full min-w-0 flex-1">
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
            <GlobalStyles />
            <ScrollToTop />
            <DocumentTitle />
            <div className="app-scale flex w-full max-w-full flex-1 flex-col">
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
            </div>
          </BrowserRouter>
        </EditorProvider>
      </GiftCartProvider>
    </AuthProvider>
  );
}

export default App;