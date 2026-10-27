// A position-based animation with gentle acceleration and a soft landing.
export function createSectionScroller(view, preference) {
  let frame = null;
  let destination = 0;
  let complete;
  function cancel() {
    if (frame !== null) view.cancelAnimationFrame(frame);
    frame = null;
    complete = undefined;
  }
  function finish() {
    const callback = complete;
    cancel();
    view.scrollTo({ top: destination, behavior: 'instant' });
    callback?.();
  }
  preference.addEventListener('change', () => {
    if (preference.matches && frame !== null) finish();
  });
  return {
    cancel,
    get running() { return frame !== null; },
    to(top, callback) {
      cancel();
      destination = top;
      complete = callback;
      const start = view.scrollY;
      const distance = destination - start;
      if (preference.matches || Math.abs(distance) < 1) { finish(); return; }
      const duration = Math.min(850, 600 + Math.sqrt(Math.abs(distance)) * 4);
      let began;
      function tick(time) {
        began ??= time;
        const progress = Math.min(1, (time - began) / duration);
        // Smootherstep: velocity and acceleration both settle to zero at each end.
        const eased = progress ** 3 * (progress * (progress * 6 - 15) + 10);
        if (progress === 1) { finish(); return; }
        view.scrollTo({ top: start + distance * eased, behavior: 'instant' });
        frame = view.requestAnimationFrame(tick);
      }
      frame = view.requestAnimationFrame(tick);
    },
  };
}
