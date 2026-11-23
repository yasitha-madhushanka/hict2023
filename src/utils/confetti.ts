import confetti from 'canvas-confetti';

export function fireCelebrationConfetti() {
  const duration = 2.5 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1000 };

  const interval: ReturnType<typeof setInterval> = setInterval(() => {
    const timeLeft = animationEnd - Date.now();
    if (timeLeft <= 0) {
      return clearInterval(interval);
    }
    const particleCount = 50 * (timeLeft / duration);
    // Since particles fall down, start a bit higher than random
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      colors: ['#f59e0b', '#ec4899', '#8b5cf6', '#3b82f6', '#10b981'],
    });
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      colors: ['#f59e0b', '#ec4899', '#8b5cf6', '#3b82f6', '#10b981'],
    });
  }, 250);
}

export function fireMiniBurst(x = 0.5, y = 0.5) {
  confetti({
    particleCount: 60,
    spread: 70,
    origin: { x, y },
    colors: ['#f59e0b', '#ef4444', '#ec4899', '#8b5cf6', '#3b82f6', '#10b981'],
  });
}

function randomInRange(min: number, max: number) {
  return Math.random() * (max - min) + min;
}
