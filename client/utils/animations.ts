import gsap from 'gsap';
import confetti from 'canvas-confetti';

/**
 * Fires authentic retro ember & gold sparks using canvas-confetti
 */
export function triggerEmberBurst(originX = 0.5, originY = 0.5) {
  try {
    confetti({
      particleCount: 45,
      spread: 70,
      origin: { x: originX, y: originY },
      colors: ['#F0C75E', '#D5A441', '#E0522D', '#B84025', '#FFFFFF'],
      shapes: ['square'],
      scalar: 0.9,
      ticks: 120,
      gravity: 0.8,
      decay: 0.92,
      startVelocity: 25,
      disableForReducedMotion: true,
    });
  } catch {
    // fallback if canvas-confetti fails
  }
}

/**
 * Massive triumphant golden firework burst for level ups
 */
export function triggerTriumphantBurst() {
  try {
    const end = Date.now() + 1200;
    const colors = ['#F0C75E', '#D5A441', '#E0522D', '#B84025', '#72C7F0'];

    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors,
        shapes: ['square'],
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors,
        shapes: ['square'],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  } catch {}
}

/**
 * GSAP screen entry animation with retro stepped ease
 */
export function animateScreenEnter(target: HTMLElement | null) {
  if (!target) return;
  gsap.fromTo(
    target,
    { opacity: 0, y: 12 },
    {
      opacity: 1,
      y: 0,
      duration: 0.35,
      ease: 'power2.out',
      clearProps: 'transform',
    }
  );
}

/**
 * GSAP numerical roll-up for XP or Gold counters
 */
export function animateCounter(
  element: HTMLElement | null,
  startVal: number,
  endVal: number,
  prefix = '',
  suffix = '',
  duration = 0.6
) {
  if (!element) return;
  const obj = { val: startVal };

  gsap.to(obj, {
    val: endVal,
    duration,
    ease: 'power2.out',
    onUpdate: () => {
      element.textContent = `${prefix}${Math.round(obj.val).toLocaleString()}${suffix}`;
    },
  });
}

/**
 * GSAP slash impact for quest completion
 */
export function animateQuestSlash(element: HTMLElement | null, onFinish?: () => void) {
  if (!element) {
    onFinish?.();
    return;
  }

  const tl = gsap.timeline({ onComplete: onFinish });

  tl.to(element, {
    x: 4,
    duration: 0.05,
    repeat: 3,
    yoyo: true,
    ease: 'none',
  })
    .to(element, {
      scale: 1.02,
      duration: 0.1,
      borderColor: '#F0C75E',
    })
    .to(element, {
      scale: 1,
      duration: 0.15,
      borderColor: '#173A28',
      clearProps: 'transform',
    });
}
