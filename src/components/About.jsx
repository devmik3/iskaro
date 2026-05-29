import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import * as THREE from "three";

import bg0 from "../../assets/images/bg_0.jpg";
import bg1 from "../../assets/images/bg_1.jpg";
import bg2 from "../../assets/images/bg_2.jpg";
import bg3 from "../../assets/images/bg_3.jpg";
import bg4 from "../../assets/images/bg_4.jpg";
import bg5 from "../../assets/images/bg_5.jpg";
import bg6 from "../../assets/images/bg_6.jpg";
import bg7 from "../../assets/images/bg_7.jpg";

import worker1 from "../../assets/images/is_1.jpg";
import worker2 from "../../assets/images/is_2.jpg";
import worker3 from "../../assets/images/is_3.jpg";
import worker4 from "../../assets/images/is_4.jpg";
import worker5 from "../../assets/images/is_5.jpg";
import worker6 from "../../assets/images/is_6.jpg";

const bgImgs = [bg0, bg1, bg2, bg3, bg4, bg5, bg6, bg7];
const workerImgs = [worker1, worker1, worker2, worker3, worker4, worker5, worker6, worker5];
const n = 8;

const slideFX = [
  { zS: 1.0, zE: 1.0, oS: 0, oE: 0, mI: 1.0 },
  { zS: 2.0, zE: 1.0, oS: 0, oE: 0, mI: 1.0 },
  { zS: 1.0, zE: 2.0, oS: 0, oE: 0.3, mI: 1.0 },
  { zS: 2.0, zE: 2.0, oS: 0, oE: 0, mI: 0.5 },
  { zS: 2.0, zE: 0.5, oS: 0, oE: 0, mI: 2.0 },
  { zS: 1.0, zE: 1.0, oS: 0, oE: 0, mI: 1.0 },
  { zS: 1.0, zE: 1.0, oS: 0, oE: 0, mI: 1.0 },
  { zS: 1.0, zE: 1.0, oS: 0, oE: 0, mI: 0.5 },
];

const vertexShader = `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;

const fragmentShader = `
  uniform sampler2D uTexture;
  uniform float uProgress;
  uniform float uTime;
  uniform float uZoom;
  uniform vec2  uOffset;
  uniform float uMovement;
  uniform float uBrightness;
  varying vec2 vUv;
  void main() {
    vec2 uv = vUv;
    vec2 center = vec2(0.5);
    uv = center + (uv - center) / uZoom;
    uv += uOffset;
    vec2 edgeDist = 1.0 - abs(uv - 0.5) * 2.0;
    float edgeFade = smoothstep(0.0, 0.12, min(edgeDist.x, edgeDist.y));
    if (edgeFade < 0.001) discard;
    float breath = sin(uv.y * 8.0 + uTime * 0.4) * 0.004 * uMovement;
    uv.x += breath;
    vec4 color = texture2D(uTexture, uv);
    float grain = fract(sin(dot(uv * uTime, vec2(12.9898, 78.233))) * 43758.5453);
    color.rgb += (grain - 0.5) * 0.04 * uMovement;
    float vig = 1.0 - length(uv - 0.5) * 0.75;
    color.rgb *= vig;
    color.a = 1.0 - uProgress;
    color.a *= edgeFade;
    color.rgb *= uBrightness;
    gl_FragColor = color;
  }
`;

export default function About() {
  const { t } = useTranslation();
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const bgRef = useRef(null);
  const textContainerRef = useRef(null);
  const cardsContainerRef = useRef(null);

  useEffect(() => {
    // Scroll to top on mount (prevents browser scroll restoration)
    window.scrollTo(0, 0);

    const section = sectionRef.current;
    const canvas = canvasRef.current;
    const textContainer = textContainerRef.current;
    const cardsContainer = cardsContainerRef.current;
    if (!section || !canvas || !textContainer || !cardsContainer) return;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 5;

    // Pre‑create all 5 planes with a 1px placeholder so they exist from frame 1
    const placeholder = new THREE.DataTexture(new Uint8Array([60, 65, 60]), 1, 1);
    placeholder.needsUpdate = true;
    const planes = [];

    const loader = new THREE.TextureLoader();
    bgImgs.forEach((src, i) => {
      const fx = slideFX[i];
      const u = {
        uTexture: { value: placeholder },
        uProgress: { value: 0 },
        uTime: { value: 0 },
        uZoom: { value: fx.zS },
        uOffset: { value: new THREE.Vector2(fx.oS, 0) },
        uMovement: { value: fx.mI },
        uBrightness: { value: i === 0 ? 1.5 : 1.0 },
      };
      const material = new THREE.ShaderMaterial({
        uniforms: u, vertexShader, fragmentShader,
        transparent: true, depthWrite: false,
      });
      const geometry = new THREE.PlaneGeometry(8.2, 4.6);
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.z = -i * 0.02;
      scene.add(mesh);
      planes.push({ mesh, u, fx });

      // Load real texture async
      loader.load(src, (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        u.uTexture.value = tex;
      });
    });

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    // ── Scroll ──
    const textEls = section.querySelectorAll(".about-text-item");
    const cardEls = cardsContainer.querySelectorAll(".about-worker-card");
    const dots = section.querySelectorAll(".about-dot");

    const updateScroll = () => {
      const rect = section.getBoundingClientRect();
      const sectionHeight = rect.height;
      const viewHeight = window.innerHeight;
      const scrollRange = Math.max(1, sectionHeight - viewHeight);

      // Clamp both ends so slide 7 remains stable at the bottom of the section.
      const clamp01 = (value) => Math.max(0, Math.min(1, value));
      const rawProgress = clamp01((-rect.top) / scrollRange);
      const progress = rawProgress * (n - 1);

      const getSlideOpacity = (i) => {
        if (i === n - 1 && progress >= i) return 1;

        const dist = Math.abs(progress - i);
        if (dist < 0.1) return 1;
        if (dist < 0.55) return 1 - (dist - 0.1) / 0.45;
        return 0;
      };

      let bestIndex = 0, bestOpacity = 0;

      planes.forEach(({ u, fx }, i) => {
        const dist = Math.abs(progress - i);
        let p;

        if (i === n - 1 && progress >= i) p = 0;
        else if (dist < 0.1) p = 0;
        else if (dist < 0.55) p = (dist - 0.1) / 0.45;
        else p = 1;

        p = clamp01(p);
        u.uProgress.value = p;
        u.uZoom.value = fx.zS + (fx.zE - fx.zS) * p;
        u.uOffset.value.set(fx.oS + (fx.oE - fx.oS) * p, 0);

        const opacity = 1 - p;
        if (opacity > bestOpacity) { bestOpacity = opacity; bestIndex = i; }
      });

      textEls.forEach((el, i) => {
        const opacity = clamp01(getSlideOpacity(i));
        el.style.opacity = String(opacity);
        el.style.zIndex = String(Math.round(opacity * 100));
        el.style.pointerEvents = opacity > 0.05 ? "auto" : "none";
      });

      cardEls.forEach((el, i) => {
        const opacity = clamp01(getSlideOpacity(i));
        el.style.opacity = String(opacity);
        el.style.zIndex = String(Math.round(opacity * 100));
      });

      dots.forEach((dot, i) => {
        if (i === bestIndex) {
          dot.style.backgroundColor = "rgba(77, 224, 130, 0.9)";
          dot.style.transform = "scale(1.4)";
        } else {
          dot.style.backgroundColor = "rgba(255, 255, 255, 0.3)";
          dot.style.transform = "scale(1)";
        }
      });
    };

    window.addEventListener("scroll", updateScroll, { passive: true });
    updateScroll();

    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      const time = performance.now() * 0.001;
      planes.forEach(({ u }) => { u.uTime.value = time; });
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.removeEventListener("scroll", updateScroll);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
      planes.forEach(({ mesh }) => { mesh.material.dispose(); mesh.geometry.dispose(); });
      renderer.dispose();
    };
  }, []);

  return (
    <section ref={sectionRef} id="about" className="about-scroll-section relative bg-surface" style={{ height: "800vh", minHeight: "800svh" }}>
      {/* Fixed bg wrapper — fades out when past the section so footer is visible */}
      <div ref={bgRef} className="fixed inset-0 pointer-events-none" style={{ zIndex: 1 }}>
        <canvas ref={canvasRef} className="w-full h-full" />
        <div className="absolute inset-0 about-bg-overlay" />
      </div>

      <div className="about-fixed-stage fixed top-0 w-full h-screen flex flex-col justify-center px-margin-mobile md:px-margin-desktop" style={{ zIndex: 3 }}>
        <div className="about-stage-inner max-w-container-max mx-auto w-full relative">
          {/* Slide 0 — hero intro (full width, centered) */}
          <div className="about-text-item about-hero-slide absolute inset-0 flex flex-col items-center justify-center" style={{ opacity: 1 }}>
            <div className="about-hero-card">
              <h2
                className="clamp-lg font-bold text-white text-center drop-shadow-lg leading-relaxed"
                dangerouslySetInnerHTML={{ __html: t("about.slide0_heading") }}
              />
              <p className="clamp-lg font-bold text-tertiary text-center mt-4 drop-shadow-lg">{t("about.promise_subtitle")}</p>
            </div>
          </div>

          <div className="about-layout">
            <div ref={textContainerRef} className="about-copy-column relative">
              {[1,2,3,4,5,6].map((i) => (
                <div key={i} className="about-text-item about-slide-copy-wrap absolute inset-0 flex flex-col justify-center" style={{ opacity: 0 }}>
                  <div className="about-copy-card">
                    <h3 className="clamp-lg font-bold text-white mb-4 md:mb-6 drop-shadow-lg">{t(`about.slide${i}_heading`)}</h3>
                    <p className="font-body-lg text-body-lg text-white/85 leading-relaxed drop-shadow-md">{t(`about.slide${i}_body`)}</p>
                  </div>
                </div>
              ))}

              {/* Slide 7 — closing glass card */}
              <div className="about-text-item about-final-slide absolute inset-0 flex items-center justify-center" style={{ opacity: 0 }}>
                <div className="about-final-card">
                  <p
                    className="clamp-lg font-bold text-white text-center drop-shadow-lg leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: t("about.slide7_text") }}
                  />
                </div>
              </div>
            </div>

            <div ref={cardsContainerRef} className="about-media-column relative flex items-center justify-center">
              {/* Slide 0 — no image card */}
              <div className="about-worker-card about-slide-media-wrap absolute inset-0 flex items-center justify-center" style={{ opacity: 1, zIndex: 1 }}>
                <div />
              </div>

              {[1,2,3,4,5,6].map((i) => (
                <div key={i} className="about-worker-card about-slide-media-wrap absolute inset-0 flex items-center justify-center" style={{ opacity: 0, zIndex: 0 }}>
                  <div className="about-image-card glass-card rounded-2xl overflow-hidden shadow-2xl w-full">
                    <img src={workerImgs[i]} alt={t(`about.slide${i}_heading`)} className="about-worker-img w-full object-cover" />
                  </div>
                </div>
              ))}

              {/* Slide 7 — no image card */}
              <div className="about-worker-card about-slide-media-wrap absolute inset-0 flex items-center justify-center" style={{ opacity: 0, zIndex: 0 }}>
                <div />
              </div>
            </div>
          </div>

          <div className="about-dots flex justify-center gap-3">
            {Array.from({ length: n }, (_, i) => (
              <span key={i} className="about-dot w-2.5 h-2.5 rounded-full transition-all duration-300" style={{ backgroundColor: i === 0 ? "rgba(77, 224, 130, 0.9)" : "rgba(255, 255, 255, 0.3)", transform: i === 0 ? "scale(1.4)" : "scale(1)" }} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
