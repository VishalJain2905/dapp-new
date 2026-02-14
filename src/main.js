// Main Application Entry Point
import "./style.css";
import logoImg from "./assets/dapp.svg";
import { initNavigation } from "./ui/navigation.js";
import { initForm } from "./ui/form.js";
import { initProcessAccordion } from "./ui/process.js";
import { initInteractions, initFormEffects } from "./ui/interactions.js";
import { initAnimations } from "./animations/scroll.js";
import { initParallaxScroll } from "./animations/parallaxScroll.js";

import { initTypewriter, initScrollTypewriter, initWordTypewriter } from "./ui/typewriter.js";

// Initialize application when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  console.log("🚀 DappStudio - Initializing...");

  // Set logo image in header and footer
  document.querySelectorAll(".logo-img").forEach((img) => {
    img.src = logoImg;
  });

  initParallaxScroll();

  initNavigation();

  initForm();
  initProcessAccordion();

  initSmoothScroll();
  initCursorTracking();
  initInteractions();
  initFormEffects();
  initAnimations();
  initTypewriter();
  initScrollTypewriter();
  initWordTypewriter();
  initRevealAnimations();

  initStatsCounter();
  initScrollProgress();

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

// Reveal all sections/cards on load in one go (no scroll-based delay)
function initRevealAnimations() {
  const revealElements = document.querySelectorAll('[data-reveal]');
  revealElements.forEach((el) => el.classList.add('revealed'));
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
      statNumbers.forEach((stat) => {
        const target = parseInt(stat.getAttribute('data-count'));
        const delay = 0;
        
        setTimeout(() => {
          const duration = 1200;
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
  
  // Check on load immediately and on scroll
  checkAndAnimate();
  window.addEventListener('scroll', checkAndAnimate, { passive: true });
}

// Smooth scroll progress indicator
function initScrollProgress() {
  const progressBar = document.getElementById('scroll-progress');
  if (!progressBar) return;
  
  function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / docHeight) * 100;
    progressBar.style.width = `${progress}%`;
  }
  
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();
}
