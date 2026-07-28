import { useEffect, useRef } from "react";

/* Video that only plays while visible (IntersectionObserver) for smooth perf */
export default function LazyVideo({ src, className = "", style = {}, objectPos = "center" }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            el.play().catch(() => {});
          } else {
            el.pause();
          }
        });
      },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <video
      ref={ref}
      src={src}
      className={className}
      style={{ objectFit: "cover", objectPosition: objectPos, ...style }}
      muted
      loop
      playsInline
      preload="metadata"
      disablePictureInPicture
      // @ts-ignore
      disableRemotePlayback
    />
  );
}
