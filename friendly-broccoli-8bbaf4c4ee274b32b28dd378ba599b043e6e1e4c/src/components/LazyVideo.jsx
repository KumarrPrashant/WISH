import { useEffect, useRef } from "react";

/*
  Video that plays smoothly and reliably:
  - autoPlay + muted + playsInline for browser autoplay policy compliance
  - preload="auto" to buffer the full video upfront (prevents blank frames)
  - IntersectionObserver pauses when off-screen for performance
  - dark gradient background prevents black/blank placeholder before load
  - retry logic handles transient play() failures
*/
export default function LazyVideo({ src, className = "", style = {}, objectPos = "center" }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const tryPlay = () => {
      if (el.readyState >= 2) {
        el.play().catch(() => {
          // retry once after a short delay if the video wasn't ready
          setTimeout(() => el.play().catch(() => {}), 300);
        });
      }
    };

    // attempt immediate play
    tryPlay();

    // also play when metadata/canplay events fire
    const onCanPlay = () => tryPlay();
    el.addEventListener("canplay", onCanPlay);

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            tryPlay();
          } else {
            el.pause();
          }
        });
      },
      { threshold: 0.15 }
    );
    io.observe(el);

    return () => {
      io.disconnect();
      el.removeEventListener("canplay", onCanPlay);
    };
  }, []);

  return (
    <video
      ref={ref}
      src={src}
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
      preload="auto"
      disablePictureInPicture
      // @ts-ignore
      disableRemotePlayback
    />
  );
}
