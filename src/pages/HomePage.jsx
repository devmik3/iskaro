import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import heroVideo from "../../assets/hero-org.mp4";
import managerImg from "../../assets/images/manager.jpg";

const serviceCards = [
  { key: "infrastructure", icon: "bolt", mode: "corridor" },
  { key: "silviculture", icon: "forest", mode: "thinning", delay: "delay-100" },
  { key: "risk", icon: "warning", mode: "hazard" },
  { key: "regeneration", icon: "potted_plant", mode: "planting", delay: "delay-100" },
  { key: "clearing", icon: "grass", mode: "thinning" },
  { key: "cutting", icon: "carpenter", mode: "hazard", delay: "delay-100" },
];

const regions = ["Sweden", "Finland", "Estonia"];

function usePageEffects(language) {
  useEffect(() => {
    let removeScrollFade = null;
    let removeReveal = null;
    let removeNavbar = null;
    let fadeTimer = null;

    const init = () => {
      if (window.Splitting) {
        window.Splitting({ target: "[data-splitting]", by: "chars" });
      }

      if (window.gsap && window.ScrollTrigger) {
        window.gsap.registerPlugin(window.ScrollTrigger);
      }

      const heroCard = document.querySelector(".hero-card");
      const syncHeroFade = () => {
        if (!heroCard) return;
        const vh = window.innerHeight;
        const rect = heroCard.getBoundingClientRect();
        const triggerY = vh * 0.15;
        const travelY = rect.height + triggerY;
        const p = Math.min(1, Math.max(0, (triggerY - rect.bottom) / travelY));
        heroCard.style.opacity = String(1 - p);
        heroCard.style.transform = `translateY(${-56 * p}px) scale(${1 - 0.04 * p})`;
        heroCard.style.pointerEvents = p > 0.7 ? "none" : "auto";
      };
      window.addEventListener("scroll", syncHeroFade, { passive: true });
      fadeTimer = window.setTimeout(() => {
        heroCard?.classList.remove("animate-fade-up");
        syncHeroFade();
      }, 1100);
      syncHeroFade();
      removeScrollFade = () => window.removeEventListener("scroll", syncHeroFade);

      const reveals = document.querySelectorAll(".reveal");
      const checkReveal = () => {
        const windowHeight = window.innerHeight;
        reveals.forEach((reveal) => {
          const revealTop = reveal.getBoundingClientRect().top;
          if (revealTop < windowHeight - 80) {
            reveal.classList.add("active");
          }
        });
      };
      window.addEventListener("scroll", checkReveal, { passive: true });
      checkReveal();
      removeReveal = () => window.removeEventListener("scroll", checkReveal);

      const navbar = document.getElementById("navbar");
      const syncNavbar = () => {
        if (!navbar) return;
        if (window.scrollY > 40) {
          navbar.classList.add(
            "bg-surface-container-lowest/90",
            "border-b",
            "border-surface-container-highest",
          );
        } else {
          navbar.classList.remove(
            "bg-surface-container-lowest/90",
            "border-b",
            "border-surface-container-highest",
          );
        }
      };
      window.addEventListener("scroll", syncNavbar, { passive: true });
      syncNavbar();
      removeNavbar = () => window.removeEventListener("scroll", syncNavbar);
    };

    const timer = window.setTimeout(init, 0);

    return () => {
      window.clearTimeout(timer);
      if (fadeTimer) window.clearTimeout(fadeTimer);
      removeScrollFade?.();
      removeReveal?.();
      removeNavbar?.();
    };
  }, [language]);
}

export default function HomePage() {
  const { t, i18n } = useTranslation();

  usePageEffects(i18n.resolvedLanguage);

  return (
    <>
      <div id="smooth-wrapper" className="relative z-10">
        <div id="smooth-content">
          <section className="min-h-[100svh] relative overflow-hidden flex flex-col justify-end sm:justify-center pt-28 pb-10 sm:pt-32 sm:pb-0" id="hero-section">
            <video
              autoPlay
              aria-hidden="true"
              className="fixed inset-0 w-full h-full object-cover z-0 opacity-100"
              loop
              muted
              playsInline
              preload="metadata"
              src={heroVideo}
            />
            <div className="fixed inset-0 video-overlay z-20" />
            <div id="hero-copy" className="relative z-30 w-full px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto mt-0 sm:mt-16">
              <div className="hero-card max-w-3xl ml-auto space-y-4 sm:space-y-6 p-5 sm:p-7 md:p-12 rounded-xl animate-fade-up">
                <div className="flex items-center gap-2 mb-2">
                  <span className="h-px w-8 bg-tertiary" />
                  <span className="font-label-caps text-label-caps text-tertiary tracking-widest">
                    {t("hero.kicker")}
                  </span>
                </div>
                <h1 className="font-headline-xl text-on-surface leading-tight clamp-xl split-text font-bold" data-splitting>
                  {t("hero.title")}
                </h1>
                <div className="pt-4 flex flex-col sm:flex-row gap-4" />
              </div>
            </div>
          </section>

          <div className="section-transition" aria-hidden="true" />

          <div className="relative z-20 living-page-bg glass-section bg-surface section-edge-fade">
            <section
              id="services"
              className="glass-section pt-32 pb-24 px-margin-mobile md:px-margin-desktop rounded-t-[2rem] shadow-[0_-20px_50px_rgba(0,0,0,0.6)] border-t border-white/5 -mt-8 bg-surface"
            >
              <div className="max-w-container-max mx-auto">
                <div className="mb-16 reveal max-w-3xl">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="font-label-caps text-label-caps text-tertiary tracking-widest">
                      {t("hero.coreCapabilities")}
                    </span>
                    <span className="h-px w-16 bg-surface-container-highest" />
                  </div>
                  <h2 className="clamp-lg font-bold text-on-surface mb-6">{t("services.title")}</h2>
                  <p className="font-body-md text-body-md text-on-surface-variant text-lg leading-relaxed">
                    {t("services.description")}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                  {serviceCards.map((service) => (
                    <div
                      key={service.key}
                      className={`glass-card rounded-lg p-8 hover:border-tertiary/50 transition-all duration-500 group reveal ${service.delay || ""}`}
                      data-mode={service.mode}
                    >
                      <div className="flex justify-between items-start mb-6">
                        <span className="material-symbols-outlined text-4xl text-tertiary transition-transform duration-500 group-hover:scale-110">
                          {service.icon}
                        </span>
                        <span className="font-label-caps text-on-surface-variant">
                          {t(`services.${service.key}.label`)}
                        </span>
                      </div>
                      <h3 className="font-headline-md text-headline-md text-on-surface mb-3 group-hover:text-tertiary transition-colors">
                        {t(`services.${service.key}.title`)}
                      </h3>
                      <div className="font-body-md text-body-md text-on-surface-variant leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: t(`services.${service.key}.body`) }}
                      />
                    </div>
                  ))}
                </div>

                {/* 07 — Ongoing Support (full width) */}
                <div className="glass-card rounded-lg p-0 md:p-0 mt-6 md:mt-8 hover:border-tertiary/50 transition-all duration-500 group reveal flex flex-col md:flex-row overflow-hidden">
                  {/* Image side — fades into card */}
                  <div className="support-card-image w-full md:w-[280px] shrink-0 relative min-h-[180px] sm:min-h-[220px] md:min-h-[280px] opacity-35"
                    style={{
                      backgroundImage: `url(${managerImg})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  />
                  {/* Content */}
                  <div className="flex-1 p-8 md:p-10 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="material-symbols-outlined text-2xl text-amber-400">star</span>
                      <span className="font-label-caps text-label-caps text-on-surface-variant">
                        {t("services.support.label")}
                      </span>
                    </div>
                    <h3 className="font-headline-md text-headline-md text-on-surface mb-3 group-hover:text-tertiary transition-colors">
                      {t("services.support.title")}
                    </h3>
                    <div className="font-body-md text-body-md text-on-surface-variant leading-relaxed mb-3"
                      dangerouslySetInnerHTML={{ __html: t("services.support.body") }}
                    />
                    <div className="font-bold text-tertiary text-sm tracking-wide">
                      {t("services.support.tagline")}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section id="approach" className="glass-section pb-24 px-margin-mobile md:px-margin-desktop">
              <div className="max-w-container-max mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
                <div className="frosted-panel lg:col-span-5 bg-surface-container rounded-xl p-6 sm:p-8 lg:p-10 flex flex-col justify-center border border-surface-container-highest reveal">
                  <span className="material-symbols-outlined text-5xl text-tertiary mb-8">shield_with_heart</span>
                  <h2 className="clamp-lg font-bold text-on-surface mb-6">{t("approach.title")}</h2>
                  <p className="font-body-lg text-body-lg text-on-surface-variant mb-6">{t("approach.body")}</p>
                  <div className="mt-auto pt-8 border-t border-surface-container-highest">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-surface-bright flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary">gavel</span>
                      </div>
                      <div>
                        <div className="font-label-caps text-label-caps text-tertiary">{t("approach.founded")}</div>
                        <div className="font-label-sm text-label-sm text-on-surface-variant">{t("approach.serving")}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-7 grid grid-rows-2 gap-6 md:gap-8">
                  <div className="frosted-panel bg-surface-container rounded-xl p-6 sm:p-8 border border-surface-container-highest reveal delay-100 flex flex-col justify-center">
                    <h3 className="font-headline-md text-headline-md text-on-surface mb-4">{t("approach.subtitle")}</h3>
                    <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                      {t("approach.description")}
                    </p>
                    <div className="mt-6 flex flex-wrap gap-3">
                      {regions.map((region) => (
                        <span key={region} className="px-3 py-1.5 bg-surface-bright rounded text-xs font-semibold text-primary">
                          {region}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
                    <div className="frosted-panel bg-surface-container rounded-xl p-6 sm:p-8 border border-surface-container-highest reveal delay-200">
                      <span className="material-symbols-outlined text-3xl text-tertiary mb-4">analytics</span>
                      <h4 className="font-label-caps text-label-caps text-on-surface mb-2">{t("approach.valueTitle")}</h4>
                      <p className="font-body-md text-body-md text-on-surface-variant">{t("approach.valueBody")}</p>
                    </div>
                    <div className="frosted-panel bg-surface-container rounded-xl p-6 sm:p-8 border border-surface-container-highest reveal delay-300">
                      <span className="material-symbols-outlined text-3xl text-tertiary mb-4">health_and_safety</span>
                      <h4 className="font-label-caps text-label-caps text-on-surface mb-2">{t("approach.riskTitle")}</h4>
                      <p className="font-body-md text-body-md text-on-surface-variant">{t("approach.riskBody")}</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section
              id="contact"
              className="glass-section py-20 md:py-24 px-margin-mobile md:px-margin-desktop overflow-hidden flex items-center justify-center text-center relative"
            >
              <div className="contact-cta glass-card rounded-xl p-6 sm:p-8 md:p-9 max-w-xl w-full relative z-10">
                <div className="relative z-10 max-w-xl mx-auto space-y-6 reveal">
                  <h2 className="clamp-lg font-bold text-on-surface">{t("contact.title")}</h2>
                  <p className="font-body-lg text-body-lg text-on-surface-variant max-w-lg mx-auto">{t("contact.body")}</p>
                  <div className="flex flex-col md:flex-row items-center justify-center gap-4 pt-1">
                    <a
                      href="mailto:info.holtor@gmail.com"
                      className="contact-email-link w-full sm:w-auto bg-[rgba(255,255,255,0.12)] backdrop-blur-xl border border-white/20 text-on-surface px-7 py-3.5 rounded-lg font-label-caps text-label-caps hover:bg-[rgba(77,224,130,0.20)] hover:border-[#4de080]/50 transition-all duration-300"
                    >
                      {t("cta.project")}
                    </a>
                  </div>

                  <div className="contact-people flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-5 md:gap-8 mt-8 pt-8 border-t border-surface-container-highest">
                    <div className="flex items-center gap-3 text-left group cursor-pointer min-w-0">
                      <div className="contact-icon w-10 h-10 rounded bg-surface-container-low flex shrink-0 items-center justify-center border border-surface-container-highest group-hover:border-tertiary transition-colors">
                        <span className="material-symbols-outlined text-tertiary">support_agent</span>
                      </div>
                      <div className="min-w-0">
                        <div className="font-label-caps text-label-caps text-on-surface-variant mb-1">
                          {t("contact.logistics")} (Andrus)
                        </div>
                        <a className="font-body-lg text-body-lg text-on-surface group-hover:text-tertiary transition-colors" href="tel:+37253904998">
                          +372 5390 4998
                        </a>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-left group cursor-pointer min-w-0">
                      <div className="contact-icon w-10 h-10 rounded bg-surface-container-low flex shrink-0 items-center justify-center border border-surface-container-highest group-hover:border-tertiary transition-colors">
                        <span className="material-symbols-outlined text-tertiary">engineering</span>
                      </div>
                      <div className="min-w-0">
                        <div className="font-label-caps text-label-caps text-on-surface-variant mb-1">
                          {t("contact.operations")} (Maksim)
                        </div>
                        <a className="font-body-lg text-body-lg text-on-surface group-hover:text-tertiary transition-colors" href="tel:+3725549366">
                          +372 554 9366
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
