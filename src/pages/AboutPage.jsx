import { useTranslation } from "react-i18next";
import About from "../components/About.jsx";

export default function AboutPage({ navigate }) {
  const { t } = useTranslation();

  return (
    <>
      <About />

      {/* Footer */}
      <footer className="site-footer w-full glass-section bg-surface-container-lowest border-t border-surface-container-highest">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-16">
          <div className="md:col-span-4 lg:col-span-5">
            <div className="flex items-center gap-2 mb-6">
              <span className="material-symbols-outlined text-tertiary text-2xl">precision_manufacturing</span>
              <span className="font-headline-md text-headline-md text-on-surface uppercase tracking-widest font-bold">
                Iskaro AB
              </span>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-sm">{t("footer.copyright")}</p>
          </div>
          <div className="md:col-span-8 lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h4 className="font-label-caps text-label-caps text-on-surface mb-6">{t("footer.solutions")}</h4>
              <nav className="flex flex-col gap-4">
                <a className="font-body-md text-body-md text-on-surface-variant hover:text-tertiary transition-colors" href="/#services">
                  {t("services.infrastructure.title")}
                </a>
                <a className="font-body-md text-body-md text-on-surface-variant hover:text-tertiary transition-colors" href="/#services">
                  {t("services.silviculture.title")}
                </a>
                <a className="font-body-md text-body-md text-on-surface-variant hover:text-tertiary transition-colors" href="/#services">
                  {t("services.risk.title")}
                </a>
              </nav>
            </div>
            <div>
              <h4 className="font-label-caps text-label-caps text-on-surface mb-6">{t("footer.company")}</h4>
              <nav className="flex flex-col gap-4">
                <a className="font-body-md text-body-md text-on-surface-variant hover:text-tertiary transition-colors" href="/" onClick={(e) => { e.preventDefault(); navigate("/"); }}>
                  {t("nav.home")}
                </a>
                <a className="font-body-md text-body-md text-on-surface-variant hover:text-tertiary transition-colors" href="https://iskaro.net/">
                  Iskaro AB
                </a>
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
    </>
  );
}
