/**
 * Parallax scroll effects for dog illustrations
 */

export function initParallax() {
  const vetLeft = document.querySelector<HTMLElement>('.parallax-vet-left');
  const dogRight = document.querySelector<HTMLElement>('.parallax-dog-right');

  if (!vetLeft && !dogRight) return;

  const handleScroll = () => {
    const scrolled = window.pageYOffset;

    // Left vet moves slower (more subtle)
    if (vetLeft) {
      const yPos = scrolled * 0.2;
      vetLeft.style.transform = `translate3d(0, ${yPos}px, 0)`;
    }

    // Right dog moves faster (more dynamic)
    if (dogRight) {
      const yPos = scrolled * 0.35;
      dogRight.style.transform = `translate3d(0, ${yPos}px, 0)`;
    }
  };

  // Throttle scroll events for better performance
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        handleScroll();
        ticking = false;
      });
      ticking = true;
    }
  });

  // Initialize on load
  handleScroll();
}

/**
 * Intersection Observer for fade-in animations
 */
export function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Optionally stop observing after animation
        // observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe sections
  const sections = document.querySelectorAll('.section');
  sections.forEach((section) => {
    observer.observe(section);
  });

  // Observe individual elements
  const animatedElements = document.querySelectorAll('.step, .feature, .condition');
  animatedElements.forEach((el) => {
    observer.observe(el);
  });
}
