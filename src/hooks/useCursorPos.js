import { useRef, useCallback } from "react";

/*
  Tracks the cursor position for typewriter sparkle effects without
  calling getBoundingClientRect on every keystroke.

  - Caches the wrapper + cursor rects on first read.
  - Recomputes only when the cursor element's offsetParent changes
    (i.e. new text line wraps), detected via a ResizeObserver.
  - Returns a function that gives {x, y} relative to the wrapper,
    or null if the cursor isn't ready yet.
*/
export function useCursorPos(wrapRef, cursorRef) {
  const cache = useRef(null);

  const recompute = useCallback(() => {
    const wrap = wrapRef.current;
    const cur = cursorRef.current;
    if (!wrap || !cur) return;
    const wr = wrap.getBoundingClientRect();
    const cr = cur.getBoundingClientRect();
    cache.current = {
      x: cr.left - wr.left + cr.width / 2,
      y: cr.top - wr.top + cr.height / 2,
    };
  }, [wrapRef, cursorRef]);

  // Recompute on resize / line-wrap changes
  const observe = useCallback(() => {
    const cur = cursorRef.current;
    if (!cur || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => {
      cache.current = null; // invalidate, will recompute lazily
    });
    ro.observe(cur);
    return () => ro.disconnect();
  }, [cursorRef]);

  const getPos = useCallback(() => {
    if (cache.current) return cache.current;
    const wrap = wrapRef.current;
    const cur = cursorRef.current;
    if (!wrap || !cur) return null;
    const wr = wrap.getBoundingClientRect();
    const cr = cur.getBoundingClientRect();
    cache.current = {
      x: cr.left - wr.left + cr.width / 2,
      y: cr.top - wr.top + cr.height / 2,
    };
    return cache.current;
  }, [wrapRef, cursorRef]);

  return { getPos, recompute, observe };
}
