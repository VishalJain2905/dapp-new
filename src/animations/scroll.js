/**
 * Scroll Animations Module
 * GSAP ScrollTrigger powered animations for all sections
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Initialize all scroll animations
 */
export function initAnimations() {
  // Wait for fonts to load
  document.fonts.ready.then(() => {
    setupHeroAnimations();
    setupSectionAnimations();
    setupServiceCardAnimations();
    setupProcessAnimations();
    setupAboutAnimations();
    setupPortfolioAnimations();
    setupTestimonialAnimations();
    setupContactAnimations();
    setupParallaxEffects();
  });
}

/**
 * Hero Section Animations
 */
function setupHeroAnimations() {
  const heroTimeline = gsap.timeline({
    defaults: { ease: 'power3.out', duration: 1 }
  });

  // Stagger animation for hero elements
  // Only animate elements that exist
  const heroBadge = document.querySelector('.hero-badge');
  const heroTitle = document.querySelector('.hero-title');
  const heroSubtitle = document.querySelector('.hero-subtitle');
  const heroStats = document.querySelectorAll('.hero-stats .stat');
  const scrollIndicator = document.querySelector('.scroll-indicator');

  if (heroBadge) {
    heroTimeline.from(heroBadge, { y: 30, duration: 0.8 });
  }
  if (heroTitle) {
    heroTimeline.from(heroTitle, { y: 50, duration: 1 }, '-=0.5');
  }
  if (heroSubtitle) {
    heroTimeline.from(heroSubtitle, { y: 30 }, '-=0.7');
  }
  if (heroStats.length > 0) {
    heroTimeline.from(heroStats, { y: 20, stagger: 0.15 }, '-=0.3');
  }
  if (scrollIndicator) {
    heroTimeline.from(scrollIndicator, { opacity: 0, y: 20 }, '-=0.2');
  }

  // Parallax effect on hero content as user scrolls
  gsap.to('.hero-content', {
    y: 100,
    opacity: 0,
    ease: 'none',
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 1
    }
  });
}

/**
 * Generic Section Animations
 */
function setupSectionAnimations() {
  const sections = document.querySelectorAll('.section:not(#hero)');
  
  sections.forEach(section => {
    const header = section.querySelector('.section-header');
    
    if (header) {
      gsap.from(header.children, {
        opacity: 0,
        y: 50,
        stagger: 0.2,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: header,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      });
    }
  });
}

/**
 * Service Cards Animations
 */
function setupServiceCardAnimations() {
  const cards = document.querySelectorAll('.service-card');
  
  cards.forEach((card, index) => {
    gsap.from(card, {
      opacity: 0,
      y: 60,
      rotateX: 15,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: card,
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      },
      delay: index * 0.1
    });

    // Hover animation
    card.addEventListener('mouseenter', () => {
      gsap.to(card, {
        scale: 1.02,
        y: -5,
        duration: 0.3,
        ease: 'power2.out'
      });
    });

    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        scale: 1,
        y: 0,
        duration: 0.3,
        ease: 'power2.out'
      });
    });
  });
}

/**
 * Process Section Animations
 */
function setupProcessAnimations() {
  const processSection = document.querySelector('#process');
  if (!processSection) return;

  // Stagger reveal for intro content
  gsap.from('.process-intro > *', {
    y: 30,
    stagger: 0.15,
    duration: 0.8,
    scrollTrigger: {
      trigger: '.process-intro',
      start: 'top 85%',
      toggleActions: 'play none none reverse'
    }
  });

  /* Commented out for debugging visibility
  gsap.from('.accordion-item', {
    stagger: 0.2,
    duration: 0.8,
    scrollTrigger: {
      trigger: '.process-accordion',
      start: 'top 85%',
      toggleActions: 'play none none reverse'
    }
  });
  */

  // Reveal the 3D cube
  gsap.from('.wireframe-cube-container', {
    opacity: 0,
    scale: 0.8,
    rotateX: -20,
    duration: 1.2,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.process-visual-wrapper',
      start: 'top 85%',
      toggleActions: 'play none none reverse'
    }
  });
}

/**
 * About Section Animations
 */
function setupAboutAnimations() {
  const aboutSection = document.querySelector('#about');
  if (!aboutSection) return;

  // Animate about image container
  gsap.from('.about-image-wrapper', {
    opacity: 0,
    scale: 0.8,
    duration: 1,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.about-visual',
      start: 'top 80%',
      toggleActions: 'play none none reverse'
    }
  });

  // Animate floating cards
  const floatingCards = document.querySelectorAll('.about-floating-card');
  floatingCards.forEach((card, index) => {
    gsap.from(card, {
      opacity: 0,
      scale: 0.5,
      x: index % 2 === 0 ? -50 : 50,
      duration: 0.8,
      ease: 'back.out(1.7)',
      scrollTrigger: {
        trigger: '.about-visual',
        start: 'top 70%',
        toggleActions: 'play none none reverse'
      },
      delay: 0.3 + index * 0.2
    });
  });

  // Animate about text
  gsap.from('.about-text .section-tag', {
    opacity: 0,
    x: -30,
    duration: 0.6,
    scrollTrigger: {
      trigger: '.about-text',
      start: 'top 80%',
      toggleActions: 'play none none reverse'
    }
  });

  gsap.from('.about-text .section-title', {
    opacity: 0,
    y: 30,
    duration: 0.8,
    scrollTrigger: {
      trigger: '.about-text',
      start: 'top 75%',
      toggleActions: 'play none none reverse'
    }
  });

  gsap.from('.about-description', {
    opacity: 0,
    y: 20,
    duration: 0.6,
    scrollTrigger: {
      trigger: '.about-text',
      start: 'top 70%',
      toggleActions: 'play none none reverse'
    }
  });

  // Animate features
  const features = document.querySelectorAll('.about-feature');
  features.forEach((feature, index) => {
    gsap.from(feature, {
      opacity: 0,
      x: -40,
      duration: 0.6,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: feature,
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      },
      delay: index * 0.15
    });
  });
}

/**
 * Portfolio Section Animations
 */
function setupPortfolioAnimations() {
  const portfolioItems = document.querySelectorAll('.portfolio-project-card');
  
  portfolioItems.forEach((item, index) => {
    gsap.from(item, {
      opacity: 0,
      y: 80,
      scale: 0.9,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: item,
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      },
      delay: index * 0.1
    });
  });
}

/**
 * Testimonials Section Animations
 */
function setupTestimonialAnimations() {
  // Check if testimonials section exists before animating
  const testimonialCard = document.querySelector('.testimonial-card');
  const quoteIcon = document.querySelector('.quote-icon');
  const clientsLogoBar = document.querySelector('.clients-logo-bar');
  
  if (testimonialCard) {
    gsap.from(testimonialCard, {
      opacity: 0,
      y: 60,
      scale: 0.95,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: testimonialCard,
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      }
    });
  }

  // Animate quote icon only if it exists
  if (quoteIcon && testimonialCard) {
    gsap.from(quoteIcon, {
      opacity: 0,
      scale: 0,
      duration: 0.6,
      ease: 'back.out(1.7)',
      scrollTrigger: {
        trigger: testimonialCard,
        start: 'top 75%',
        toggleActions: 'play none none reverse'
      }
    });
  }

  // Animate clients logo bar only if it exists
  if (clientsLogoBar) {
    gsap.from(clientsLogoBar, {
      opacity: 0,
      y: 40,
      duration: 0.8,
      scrollTrigger: {
        trigger: clientsLogoBar,
        start: 'top 90%',
        toggleActions: 'play none none reverse'
      }
    });

    // Duplicate logo track for seamless loop
    const logoTrack = clientsLogoBar.querySelector('.logo-track');
    if (logoTrack) {
      const clone = logoTrack.cloneNode(true);
      logoTrack.parentNode.appendChild(clone);
    }
  }
}

/**
 * Contact Section Animations
 */
function setupContactAnimations() {
  // Contact info animations
  gsap.from('.contact-info .section-tag', {
    opacity: 0,
    x: -30,
    duration: 0.6,
    scrollTrigger: {
      trigger: '.contact-info',
      start: 'top 80%',
      toggleActions: 'play none none reverse'
    }
  });

  gsap.from('.contact-info .section-title', {
    opacity: 0,
    y: 30,
    duration: 0.8,
    scrollTrigger: {
      trigger: '.contact-info',
      start: 'top 75%',
      toggleActions: 'play none none reverse'
    }
  });

  // Contact methods
  const methods = document.querySelectorAll('.contact-method');
  methods.forEach((method, index) => {
    gsap.from(method, {
      opacity: 0,
      x: -40,
      duration: 0.6,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: method,
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      },
      delay: index * 0.15
    });
  });

  // Contact form
  gsap.from('.contact-form-wrapper', {
    opacity: 0,
    x: 60,
    duration: 0.8,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.contact-form-wrapper',
      start: 'top 80%',
      toggleActions: 'play none none reverse'
    }
  });

  // Form fields stagger
  const formGroups = document.querySelectorAll('.form-group');
  formGroups.forEach((group, index) => {
    gsap.from(group, {
      opacity: 0,
      y: 20,
      duration: 0.5,
      scrollTrigger: {
        trigger: '.contact-form',
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      },
      delay: index * 0.1
    });
  });

  gsap.from('.submit-btn', {
    opacity: 0,
    y: 20,
    duration: 0.5,
    scrollTrigger: {
      trigger: '.submit-btn',
      start: 'top 95%',
      toggleActions: 'play none none none'
    }
  });
}

/**
 * Innovation Section Animations
 */
function setupInnovationAnimations() {
  const innovationSection = document.querySelector('#innovation');
  if (!innovationSection) return;

  const items = innovationSection.querySelectorAll('.glance-item');
  items.forEach((item, index) => {
    gsap.from(item, {
      opacity: 0,
      scale: 0.9,
      y: 30,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: item,
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      },
      delay: index * 0.2
    });
  });
}

/**
 * Vision Section Animations
 */
function setupVisionAnimations() {
  const visionSection = document.querySelector('#vision');
  if (!visionSection) return;

  const cards = visionSection.querySelectorAll('.vision-card');
  cards.forEach((card, index) => {
    gsap.from(card, {
      opacity: 0,
      x: index % 2 === 0 ? -60 : 60,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: card,
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      }
    });
  });
}

/**
 * General Parallax Effects
 */
function setupParallaxEffects() {
  // Floating elements parallax
  const floatingElements = document.querySelectorAll('.about-floating-card');
  
  floatingElements.forEach((el, index) => {
    const section = el.closest('.section');
    if (section) {
      gsap.to(el, {
        y: index % 2 === 0 ? -20 : 20,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 2
        }
      });
    }
  });

  // Stats counter animation is handled in main.js initStatsCounter()
}
