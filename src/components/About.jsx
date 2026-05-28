import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import img1 from "../../assets/images/is_1.png";
import img2 from "../../assets/images/is_2.png";
import img3 from "../../assets/images/is_3.png";
import img4 from "../../assets/images/is_4.png";
import img5 from "../../assets/images/is_5.png";

const images = [img1, img2, img3, img4, img5];

export default function About() {
  const { t } = useTranslation();
  const sectionRef = useRef(null);
  const textContainerRef = useRef(null);
  const imageContainerRef = useRef(null);

  const n = 5;
  const transitions = n - 1;

  useEffect(() => {
    const section = sectionRef.current;
    const textContainer = textContainerRef.current;
    const imageContainer = imageContainerRef.current;
    if (!section || !textContainer || !imageContainer) return;

    const textEls = textContainer.querySelectorAll(".about-text-item");
    const imgEls = imageContainer.querySelectorAll(".about-image-item");
    const dots = section.querySelectorAll(".about-dot");

    const handleScroll = () => {
      const rect = section.getBoundingClientRect();
      const sectionHeight = rect.height;
      const viewHeight = window.innerHeight;
      const scrollRange = sectionHeight - viewHeight;
      const rawProgress = Math.max(0, Math.min(1, (-rect.top) / scrollRange));
      const progress = rawProgress * transitions;

      let bestIndex = 0;
      let bestOpacity = 0;

      textEls.forEach((el, i) => {
        const dist = Math.abs(progress - i);
        let opacity;
        if (dist < 0.1) {
          opacity = 1;
        } else if (dist < 0.45) {
          opacity = 1 - (dist - 0.1) / 0.35;
        } else {
          opacity = 0;
        }
        opacity = Math.max(0, Math.min(1, opacity));

        el.style.opacity = String(opacity);

        if (opacity > bestOpacity) {
          bestOpacity = opacity;
          bestIndex = i;
        }
      });

      imgEls.forEach((el, i) => {
        const dist = Math.abs(progress - i);
        let opacity;
        if (dist < 0.1) {
          opacity = 1;
        } else if (dist < 0.45) {
          opacity = 1 - (dist - 0.1) / 0.35;
        } else {
          opacity = 0;
        }
        opacity = Math.max(0, Math.min(1, opacity));

        el.style.opacity = String(opacity);
        el.style.zIndex = String(Math.round(opacity * 100));
      });

      dots.forEach((dot, i) => {
        if (i === bestIndex) {
          dot.style.backgroundColor = "rgba(77, 224, 130, 0.9)";
          dot.style.transform = "scale(1.4)";
        } else {
          dot.style.backgroundColor = "rgba(197, 199, 193, 0.3)";
          dot.style.transform = "scale(1)";
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative bg-surface"
      style={{ height: "400vh" }}
    >
      <div className="sticky top-24 md:top-32 w-full h-[calc(100vh-6rem)] md:h-[calc(100vh-8rem)] flex items-center px-margin-mobile md:px-margin-desktop">
        <div className="max-w-container-max mx-auto w-full">
          {/* ABOUT US label */}
          <div className="flex items-center gap-2 mb-8">
            <span className="h-px w-8 bg-tertiary" />
            <span className="font-label-caps text-label-caps text-tertiary tracking-widest">
              {t("about.label")}
            </span>
          </div>

          {/* Two-column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
            {/* Left column: text */}
            <div
              ref={textContainerRef}
              className="relative"
              style={{ height: "55vh" }}
            >
              {Array.from({ length: n }, (_, i) => (
                <div
                  key={i}
                  className="about-text-item absolute inset-0 flex flex-col justify-center"
                  style={{ opacity: i === 0 ? 1 : 0 }}
                >
                  <h3 className="clamp-lg font-bold text-on-surface mb-6">
                    {t(`about.slide${i + 1}_heading`)}
                  </h3>
                  <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
                    {t(`about.slide${i + 1}_body`)}
                  </p>
                </div>
              ))}
            </div>

            {/* Right column: image */}
            <div
              ref={imageContainerRef}
              className="relative flex items-center justify-center"
              style={{ height: "55vh" }}
            >
              {Array.from({ length: n }, (_, i) => (
                <div
                  key={i}
                  className="about-image-item absolute inset-0 flex items-center justify-center"
                  style={{ opacity: i === 0 ? 1 : 0, zIndex: i === 0 ? 100 : 0 }}
                >
                  <img
                    src={images[i]}
                    alt={t(`about.slide${i + 1}_heading`)}
                    className="w-full h-full object-contain rounded-xl shadow-2xl"
                    style={{ maxHeight: "55vh" }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Slide indicator dots */}
          <div className="flex justify-center gap-3 mt-8">
            {Array.from({ length: n }, (_, i) => (
              <span
                key={i}
                className="about-dot w-2 h-2 rounded-full transition-all duration-300"
                style={{
                  backgroundColor: i === 0 ? "rgba(77, 224, 130, 0.9)" : "rgba(197, 199, 193, 0.3)",
                  transform: i === 0 ? "scale(1.4)" : "scale(1)",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
