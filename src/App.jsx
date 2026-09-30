import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import Home from "../components/home";
import AboutPage from "../pages/about-us";
import Auth from "../components/auth";
import OurWork from "../components/our-work";
import TakeAction from "../components/take-action";

function SiteLayout() {
  return (
    <div style={{ fontSize: '20px' }} className="flex min-h-screen flex-col bg-[#FBF7F0] font-[Montserrat]">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<SiteLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/about/:section" element={<AboutPage />} />
          <Route path="/take-action" element={<TakeAction />} />
          <Route path="/take-action/:section" element={<TakeAction />} />
          <Route path="/our-work" element={<OurWork />} />
          <Route path="/our-work/:section" element={<OurWork />} />
        </Route>

        <Route path="/auth" element={<Auth />} />
        <Route path="/signup" element={<Auth />} />
        <Route path="/signin" element={<Auth />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;