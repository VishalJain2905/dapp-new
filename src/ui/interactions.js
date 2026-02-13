/**
 * Advanced Interactions Module
 * Magnetic cursor, 3D card tilts, and micro-interactions
 */

import { gsap } from 'gsap';

// Magnetic cursor state
let cursor = null;
let cursorDot = null;
let cursorTrail = [];
let mousePosition = { x: 0, y: 0 };
let currentPosition = { x: 0, y: 0 };

/**
 * Initialize all advanced interactions
 */
export function initInteractions() {
  createMagneticCursor();
  initCardTiltEffects();
  initButtonMagnetic();
  initTextRevealEffects();
  initParallaxElements();
}

/**
 * Create magnetic cursor with trail effect
 */
function createMagneticCursor() {
  // Only on desktop
  if (window.innerWidth < 1024) return;
  
  // Create cursor elements
  cursor = document.createElement('div');
  cursor.className = 'magnetic-cursor';
  cursor.innerHTML = `
    <div class="cursor-ring"></div>
    <div class="cursor-dot"></div>
  `;
  document.body.appendChild(cursor);
  
  cursorDot = cursor.querySelector('.cursor-dot');
  
  // Create trail particles
  for (let i = 0; i < 5; i++) {
    const trail = document.createElement('div');
    trail.className = 'cursor-trail';
    trail.style.opacity = 1 - (i * 0.2);
    trail.style.transform = `scale(${1 - i * 0.15})`;
    document.body.appendChild(trail);
    cursorTrail.push(trail);
  }
  
  // Track mouse movement
  document.addEventListener('mousemove', (e) => {
    mousePosition.x = e.clientX;
    mousePosition.y = e.clientY;
  });
  
  // Animate cursor
  animateCursor();
  
  // Add cursor states
  setupCursorStates();
  
  // Inject cursor styles
  injectCursorStyles();
}

function animateCursor() {
  // Smooth follow
  currentPosition.x += (mousePosition.x - currentPosition.x) * 0.15;
  currentPosition.y += (mousePosition.y - currentPosition.y) * 0.15;
  
  if (cursor) {
    cursor.style.transform = `translate(${currentPosition.x}px, ${currentPosition.y}px)`;
  }
  
  // Animate trail with delay
  cursorTrail.forEach((trail, i) => {
    gsap.to(trail, {
      x: mousePosition.x,
      y: mousePosition.y,
      duration: 0.3 + i * 0.08,
      ease: 'power2.out'
    });
  });
  
  requestAnimationFrame(animateCursor);
}

function setupCursorStates() {
  // Hover on interactive elements
  const interactiveElements = document.querySelectorAll(
    'a, button, .portfolio-project-card, .nav-link, .accordion-header, input, textarea, select'
  );
  
  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor?.classList.add('cursor-hover');
    });
    
    el.addEventListener('mouseleave', () => {
      cursor?.classList.remove('cursor-hover');
    });
  });
  
  // Text elements get different cursor
  const textElements = document.querySelectorAll('p, h1, h2, h3, h4, span:not(.logo-icon)');
  textElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor?.classList.add('cursor-text');
    });
    
    el.addEventListener('mouseleave', () => {
      cursor?.classList.remove('cursor-text');
    });
  });
}

function injectCursorStyles() {
  const styles = `
    .magnetic-cursor {
      position: fixed;
      top: 0;
      left: 0;
      width: 40px;
      height: 40px;
      pointer-events: none;
      z-index: 99999;
      mix-blend-mode: difference;
      transform: translate(-50%, -50%);
    }
    
    .cursor-ring {
      width: 100%;
      height: 100%;
      border: 1px solid rgba(255, 255, 255, 0.8);
      border-radius: 50%;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
    
    .cursor-dot {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 6px;
      height: 6px;
      background: #ffffff;
      border-radius: 50%;
      transform: translate(-50%, -50%);
      transition: all 0.2s ease;
    }
    
    .cursor-trail {
      position: fixed;
      width: 8px;
      height: 8px;
      background: rgba(96, 239, 255, 0.5);
      border-radius: 50%;
      pointer-events: none;
      z-index: 99998;
      transform: translate(-50%, -50%);
      mix-blend-mode: screen;
    }
    
    .magnetic-cursor.cursor-hover .cursor-ring {
      width: 60px;
      height: 60px;
      border-color: #60efff;
      background: rgba(96, 239, 255, 0.1);
      margin-left: -10px;
      margin-top: -10px;
    }
    
    .magnetic-cursor.cursor-hover .cursor-dot {
      transform: translate(-50%, -50%) scale(1.5);
      background: #60efff;
    }
    
    .magnetic-cursor.cursor-text .cursor-ring {
      width: 4px;
      height: 30px;
      border-radius: 2px;
      background: rgba(255, 255, 255, 0.8);
      border: none;
    }
    
    .magnetic-cursor.cursor-text .cursor-dot {
      opacity: 0;
    }
    
    @media (max-width: 1024px) {
      .magnetic-cursor,
      .cursor-trail {
        display: none;
      }
    }
  `;
  
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

/**
 * 3D Card Tilt Effects
 */
function initCardTiltEffects() {
  const cards = document.querySelectorAll('.portfolio-project-card');
  
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;
      
      gsap.to(card, {
        rotateX: rotateX,
        rotateY: rotateY,
        transformPerspective: 1000,
        ease: 'power2.out',
        duration: 0.3
      });
      
      // Update glow position
      const glowX = (x / rect.width) * 100;
      const glowY = (y / rect.height) * 100;
      card.style.setProperty('--glow-x', `${glowX}%`);
      card.style.setProperty('--glow-y', `${glowY}%`);
    });
    
    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        ease: 'power2.out',
        duration: 0.5
      });
    });
  });
}

/**
 * Magnetic buttons effect
 */
function initButtonMagnetic() {
  const buttons = document.querySelectorAll('.primary-btn, .outline-btn, .nav-cta-button, .submit-btn');
  
  buttons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      gsap.to(btn, {
        x: x * 0.3,
        y: y * 0.3,
        duration: 0.3,
        ease: 'power2.out'
      });
    });
    
    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: 'elastic.out(1, 0.5)'
      });
    });
  });
}

/**
 * Text reveal effects
 */
function initTextRevealEffects() {
  // Split titles into characters for reveal
  const titles = document.querySelectorAll('.section-title, .portfolio-projects-title, .process-title');
  
  titles.forEach(title => {
    // Create split text wrapper
    const words = title.innerHTML.split('<br');
    
    // Add intersection observer for reveal
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('text-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    
    observer.observe(title);
  });
}

/**
 * Parallax elements on scroll
 */
function initParallaxElements() {
  const parallaxElements = document.querySelectorAll('[data-parallax]');
  
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    
    parallaxElements.forEach(el => {
      const speed = parseFloat(el.dataset.parallax) || 0.1;
      const rect = el.getBoundingClientRect();
      const offset = (rect.top + scrollY) - scrollY;
      
      gsap.to(el, {
        y: offset * speed,
        duration: 0.3,
        ease: 'none'
      });
    });
  }, { passive: true });
}

/**
 * Add floating label effects to form inputs
 */
export function initFormEffects() {
  const inputs = document.querySelectorAll('.form-group input, .form-group textarea, .form-group select');
  
  inputs.forEach(input => {
    // Check initial state
    if (input.value) {
      input.parentElement.classList.add('has-value');
    }
    
    input.addEventListener('focus', () => {
      input.parentElement.classList.add('focused');
    });
    
    input.addEventListener('blur', () => {
      input.parentElement.classList.remove('focused');
      if (input.value) {
        input.parentElement.classList.add('has-value');
      } else {
        input.parentElement.classList.remove('has-value');
      }
    });
  });
}

export default initInteractions;
