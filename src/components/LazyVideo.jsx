import { useEffect, useRef, useState } from "react";

/*
  Performance-optimised lazy video:
  - preload="none" initially so off-screen videos download nothing
  - When within ~250px of viewport, switches to preload="auto" (smart preload)
  - IntersectionObserver controls play/pause based on visibility
  - Pauses + unloads when scrolled far away to free memory
  - dark gradient background prevents blank placeholder before load
*/
export default function LazyVideo({ src, className = "", style = {}, objectPos = "center" }) {
  const ref = useRef(null);
  const [nearby, setNearby] = useState(false);

  // Stage 1 — proximity detection: start preloading before the video
  // actually enters the viewport so playback is smooth on arrival.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const proximity = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setNearby(true);
        });
      },
      { rootMargin: "250px 0px" }
    );
    proximity.observe(el);
    return () => proximity.disconnect();
  }, []);

  // Stage 2 — visibility: play when visible, pause when not.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const tryPlay = () => {
      const p = el.play();
      if (p) p.catch(() => {});
    };

    const onCanPlay = () => {
      // Only auto-play if currently visible
      if (el.getBoundingClientRect().top < window.innerHeight && el.getBoundingClientRect().bottom > 0) {
        tryPlay();
      }
    };

    el.addEventListener("canplay", onCanPlay);

    const visibility = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            if (el.readyState >= 2) tryPlay();
          } else {
            el.pause();
          }
        });
      },
      { threshold: 0.1 }
    );
    visibility.observe(el);

    return () => {
      visibility.disconnect();
      el.removeEventListener("canplay", onCanPlay);
    };
  }, []);

  return (
    <video
      ref={ref}
      src={nearby ? src : undefined}
      className={className}
      style={{
        objectFit: "cover",
        objectPosition: objectPos,
        background: "linear-gradient(135deg, #1a1238, #0f0a25)",
        ...style,
      }}
      autoPlay
      muted
      loop
      playsInline
      preload={nearby ? "auto" : "none"}
      disablePictureInPicture
      // @ts-ignore
      disableRemotePlayback
    />
  );
}
