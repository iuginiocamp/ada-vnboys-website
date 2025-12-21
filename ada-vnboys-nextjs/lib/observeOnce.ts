export function observeOnce(
  element: Element,
  onEnter: () => void,
  options: IntersectionObserverInit = { threshold: 0.2 },
) {
  if (typeof window === "undefined") return () => {};
  if (!("IntersectionObserver" in window)) {
    onEnter();
    return () => {};
  }

  let fired = false;
  const observer = new IntersectionObserver((entries) => {
    if (fired) return;
    if (entries.some((e) => e.isIntersecting)) {
      fired = true;
      observer.disconnect();
      onEnter();
    }
  }, options);

  observer.observe(element);
  return () => observer.disconnect();
}

