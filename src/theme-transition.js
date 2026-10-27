// Keep the final clip in place until the browser removes both snapshots.
// Cancelling sooner restores the full old (light) snapshot for one frame.
export async function finishThemeAnimation(animation, transition) {
  try {
    await animation.finished.catch(() => {});
    await transition.finished.catch(() => {});
  } finally {
    animation.cancel();
  }
}
