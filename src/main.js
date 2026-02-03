// Main Application Entry Point
import "./style.css";
import { initScene } from "./3d/scene.js";
import { initAnimations } from "./animations/scroll.js";
import { initNavigation } from "./ui/navigation.js";
import { initForm } from "./ui/form.js";
import { initProcessAccordion } from "./ui/process.js";

import { initTypewriter, initScrollTypewriter, initWordTypewriter } from "./ui/typewriter.js";

// Initialize application when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  console.log("🚀 DappStudio - Initializing...");

  // Initialize 3D Scene
  initScene();

  // Initialize scroll animations
  initAnimations();

  // Initialize navigation
  initNavigation();

  // Initialize contact form
  initForm();
  
  // Initialize Process Accordion
  initProcessAccordion();

  // Add smooth scrolling for anchor links
  initSmoothScroll();
  
  // Add custom cursor tracking
  initCursorTracking();
  
  // Initialize typewriter effects
  setTimeout(() => {
    initTypewriter();
    initScrollTypewriter();
    initWordTypewriter();
  }, 500);
  
  // Initialize reveal animations
  initRevealAnimations();
  
  // Initialize stats counter
  initStatsCounter();
  
  // Initialize enhanced preloader
  initPreloader();
  
  console.log("✅ Application initialized successfully");
});

// Smooth scroll for navigation links
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

// Custom cursor tracking for hero section
function initCursorTracking() {
  const heroSection = document.querySelector('.hero-section');
  const cursor = document.getElementById('hero-cursor');
  
  if (heroSection && cursor) {
    heroSection.addEventListener('mousemove', (e) => {
      const rect = heroSection.getBoundingClientRect();
      cursor.style.left = (e.clientX - rect.left - 12) + 'px';
      cursor.style.top = (e.clientY - rect.top - 12) + 'px';
    });
  }
}

// Robust Preloader Hider
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) {
      loader.classList.add('loaded');
      console.log("🎬 Site Loaded - Transitioning...");
    }
  }, 1000); // Wait for animations
});

// Emergency Fallback
setTimeout(() => {
  const loader = document.getElementById('loader');
  if (loader && !loader.classList.contains('loaded')) {
    loader.classList.add('loaded');
  }
}, 5000);

// Enhanced Preloader with percentage
function initPreloader() {
  const percentage = document.querySelector('.loader-percentage');
  if (!percentage) return;
  
  let progress = 0;
  const duration = 2500;
  const startTime = performance.now();
  
  function updateProgress(currentTime) {
    const elapsed = currentTime - startTime;
    progress = Math.min(Math.floor((elapsed / duration) * 100), 100);
    percentage.textContent = `${progress}%`;
    
    if (progress < 100) {
      requestAnimationFrame(updateProgress);
    }
  }
  
  requestAnimationFrame(updateProgress);
}

// Reveal animations on scroll
function initRevealAnimations() {
  const revealElements = document.querySelectorAll('[data-reveal]');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });
  
  revealElements.forEach(el => observer.observe(el));
}

// Animated stats counter
function initStatsCounter() {
  const statNumbers = document.querySelectorAll('.stat-number[data-count]');
  
  if (statNumbers.length === 0) return;
  
  let hasAnimated = false;
  
  function checkAndAnimate() {
    if (hasAnimated) return;
    
    const statsSection = document.querySelector('.stats-section');
    if (!statsSection) return;
    
    const rect = statsSection.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
    
    if (isVisible) {
      hasAnimated = true;
      
      // Animate each counter
      statNumbers.forEach((stat, index) => {
        const target = parseInt(stat.getAttribute('data-count'));
        const delay = index * 200;
        
        setTimeout(() => {
          // Direct animation without separate function
          const duration = 2000;
          const start = performance.now();
          
          const animate = (now) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out exponential
            const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            const current = Math.floor(target * eased);
            
            stat.textContent = current;
            
            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              stat.textContent = target;
            }
          };
          
          requestAnimationFrame(animate);
        }, delay);
      });
      
      window.removeEventListener('scroll', checkAndAnimate);
    }
  }
  
  // Check on load after a delay
  setTimeout(checkAndAnimate, 1500);
  
  // Check on scroll
  window.addEventListener('scroll', checkAndAnimate, { passive: true });
}
