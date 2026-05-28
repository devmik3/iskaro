import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./components/LanguageSwitcher.jsx";
import HomePage from "./pages/HomePage.jsx";
import AboutPage from "./pages/AboutPage.jsx";

function getRoute() {
  const hash = window.location.hash.replace("#", "") || "/";
  return hash;
}

function Navbar({ route, navigate }) {
  const { t } = useTranslation();
  const isHome = route === "/";
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const navbar = document.getElementById("navbar");
    const syncNavbar = () => {
      if (!navbar) return;
      if (window.scrollY > 40) {
        navbar.classList.add("bg-surface-container-lowest/90", "border-b", "border-surface-container-highest");
      } else {
        navbar.classList.remove("bg-surface-container-lowest/90", "border-b", "border-surface-container-highest");
      }
    };
    window.addEventListener("scroll", syncNavbar, { passive: true });
    syncNavbar();
    return () => window.removeEventListener("scroll", syncNavbar);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  // Toggle body class for page blur behind hamburger
  useEffect(() => {
    if (menuOpen) {
      document.body.classList.add("mobile-menu-open");
    } else {
      document.body.classList.remove("mobile-menu-open");
    }
    return () => document.body.classList.remove("mobile-menu-open");
  }, [menuOpen]);

  const scrollToSection = (id) => {
    navigate("/");
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 50);
    closeMenu();
  };

  return (
    <header className="fixed top-0 w-full z-50 glass-panel transition-all duration-300" id="navbar">
      <div className="flex justify-between items-center max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-5">
        <a href="#" onClick={(e) => { e.preventDefault(); navigate("/"); }} className="flex items-center gap-3">
          <span className="material-symbols-outlined text-tertiary text-2xl animate-pulse">radar</span>
          <span className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface uppercase tracking-widest font-bold">Iskaro AB</span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-7 font-label-caps text-label-caps text-on-surface-variant">
          {isHome && (
            <>
              <a className="hover:text-tertiary transition-colors" href="#services">{t("nav.services")}</a>
              <a className="hover:text-tertiary transition-colors" href="#approach">{t("nav.approach")}</a>
            </>
          )}
          <a className="hover:text-tertiary transition-colors" href="#/about" onClick={(e) => { e.preventDefault(); navigate("/about"); }}>{t("nav.about")}</a>
          {isHome && (
            <a className="hover:text-tertiary transition-colors" href="#contact">{t("nav.contact")}</a>
          )}
        </nav>

        <div className="flex items-center gap-4">
          <div className="hidden lg:block">
            <LanguageSwitcher />
          </div>
          <a href="mailto:info.holtor@gmail.com"
             className="top-quote-link hidden sm:inline-flex md:w-auto bg-[rgba(255,255,255,0.12)] backdrop-blur-xl border border-white/20 text-on-surface px-5 md:px-10 py-3 md:py-4 rounded-lg md:rounded-xl font-label-caps text-label-caps whitespace-nowrap hover:bg-[rgba(77,224,130,0.20)] hover:border-[#4de080]/50 transition-all duration-300"
          >{t("cta.quote")}</a>
        </div>

        {/* Hamburger button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg text-on-surface hover:bg-surface-container transition-colors -mr-2"
          aria-label="Toggle menu"
        >
          <span className="material-symbols-outlined text-2xl">
            {menuOpen ? "close" : "menu"}
          </span>
        </button>
      </div>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div className="lg:hidden fixed inset-0 top-[72px] z-40 flex items-start justify-center pt-8 px-4" style={{ backdropFilter: "blur(22px)", WebkitBackdropFilter: "blur(22px)" }}>
          <div className="mobile-menu-panel">
            <nav className="flex flex-col items-center gap-5 font-label-caps text-label-caps">
              {isHome && (
                <>
                  <a className="hover:text-tertiary transition-colors text-lg" href="#services" onClick={(e) => { e.preventDefault(); scrollToSection("services"); }}>{t("nav.services")}</a>
                  <a className="hover:text-tertiary transition-colors text-lg" href="#approach" onClick={(e) => { e.preventDefault(); scrollToSection("approach"); }}>{t("nav.approach")}</a>
                </>
              )}
              {!isHome && (
                <a className="hover:text-tertiary transition-colors text-lg" href="/" onClick={(e) => { e.preventDefault(); navigate("/"); closeMenu(); }}>{t("nav.home")}</a>
              )}
              <a className="hover:text-tertiary transition-colors text-lg" href="#/about" onClick={(e) => { e.preventDefault(); navigate("/about"); closeMenu(); }}>{t("nav.about")}</a>
              {(isHome) && (
                <a className="hover:text-tertiary transition-colors text-lg" href="#contact" onClick={(e) => { e.preventDefault(); scrollToSection("contact"); }}>{t("nav.contact")}</a>
              )}
              <div className="pt-5 border-t border-white/10 w-full flex justify-center">
                <LanguageSwitcher />
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}

function Footer({ navigate }) {
  const { t } = useTranslation();

  return (
    <footer className="site-footer w-full glass-section bg-surface-container-lowest border-t border-surface-container-highest">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-16">
        <div className="md:col-span-4 lg:col-span-5">
          <div className="flex items-center gap-2 mb-6">
            <span className="material-symbols-outlined text-tertiary text-2xl">precision_manufacturing</span>
            <span className="font-headline-md text-headline-md text-on-surface uppercase tracking-widest font-bold">Iskaro AB</span>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-sm">{t("footer.copyright")}</p>
        </div>
        <div className="md:col-span-8 lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-8">
          <div>
            <h4 className="font-label-caps text-label-caps text-on-surface mb-6">{t("footer.solutions")}</h4>
            <nav className="flex flex-col gap-4">
              <a className="font-body-md text-body-md text-on-surface-variant hover:text-tertiary transition-colors" href="/#services">{t("services.infrastructure.title")}</a>
              <a className="font-body-md text-body-md text-on-surface-variant hover:text-tertiary transition-colors" href="/#services">{t("services.silviculture.title")}</a>
              <a className="font-body-md text-body-md text-on-surface-variant hover:text-tertiary transition-colors" href="/#services">{t("services.risk.title")}</a>
            </nav>
          </div>
          <div>
            <h4 className="font-label-caps text-label-caps text-on-surface mb-6">{t("footer.company")}</h4>
            <nav className="flex flex-col gap-4">
              <a className="font-body-md text-body-md text-on-surface-variant hover:text-tertiary transition-colors" href="/" onClick={(e) => { e.preventDefault(); navigate("/"); }}>{t("nav.home")}</a>
              <a className="font-body-md text-body-md text-on-surface-variant hover:text-tertiary transition-colors" href="#/about" onClick={(e) => { e.preventDefault(); navigate("/about"); }}>{t("nav.about")}</a>
              <a className="font-body-md text-body-md text-on-surface-variant hover:text-tertiary transition-colors" href="https://iskaro.net/">Iskaro AB</a>
            </nav>
          </div>
          <div className="col-span-2 md:col-span-1">
            <h4 className="font-label-caps text-label-caps text-on-surface mb-6">Status</h4>
            <div className="flex items-center gap-2 bg-surface-container px-4 py-2 rounded border border-surface-container-highest inline-flex">
              <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse" />
              <span className="font-label-sm text-label-sm text-on-surface-variant">{t("footer.status")}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  const [route, setRoute] = useState(() => getRoute());

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(getRoute());
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const navigate = (path) => {
    window.location.hash = path;
  };

  const isHome = route === "/";

  return (
    <>
      <Navbar route={route} navigate={navigate} />
      {isHome ? <HomePage /> : <AboutPage navigate={navigate} />}
      {isHome && <Footer route={route} navigate={navigate} />}
    </>
  );
}
