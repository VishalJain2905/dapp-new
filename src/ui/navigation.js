/**
 * Navigation Module
 * Handles navbar behavior, active link tracking, and mobile menu
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Initialize navigation functionality
 */
export function initNavigation() {
  setupScrolledNavbar();
  setupActiveLinks();
  setupSmoothScrolling();
  setupMobileMenu();
}

/**
 * Add scrolled class to navbar on scroll
 */
function setupScrolledNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  ScrollTrigger.create({
    trigger: 'body',
    start: 'top top',
    end: '+=100',
    onUpdate: (self) => {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }
  });
}

/**
 * Track and update active navigation link
 */
function setupActiveLinks() {
  const sections = document.querySelectorAll('.section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  sections.forEach(section => {
    ScrollTrigger.create({
      trigger: section,
      start: 'top center',
      end: 'bottom center',
      onEnter: () => updateActiveLink(section.id),
      onEnterBack: () => updateActiveLink(section.id)
    });
  });

  function updateActiveLink(sectionId) {
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${sectionId}`) {
        link.classList.add('active');
      }
    });
  }
}

/**
 * Setup smooth scrolling for anchor links
 */
function setupSmoothScrolling() {
  const navLinks = document.querySelectorAll('.nav-link, a[href^="#"]');

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href || !href.startsWith('#')) return;

      e.preventDefault();
      const targetId = href.substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        // Close mobile menu if open
        closeMobileMenu();

        // Scroll to target
        gsap.to(window, {
          duration: 1,
          scrollTo: {
            y: targetElement,
            offsetY: 80
          },
          ease: 'power3.inOut'
        });
      }
    });
  });
}

/**
 * Setup mobile menu toggle
 */
function setupMobileMenu() {
  const toggle = document.querySelector('.mobile-menu-toggle');
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelector('.nav-links');
  const ctaButton = document.querySelector('.cta-button');

  if (!toggle || !navbar) return;

  // Create mobile menu container
  const mobileMenu = document.createElement('div');
  mobileMenu.className = 'mobile-menu';
  mobileMenu.innerHTML = `
    <div class="mobile-menu-content">
      ${navLinks ? navLinks.innerHTML : ''}
      ${ctaButton ? `<button class="cta-button">${ctaButton.textContent}</button>` : ''}
    </div>
  `;
  navbar.appendChild(mobileMenu);

  // Add mobile menu styles dynamically
  addMobileMenuStyles();

  // Toggle menu
  toggle.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.contains('open');
    
    if (isOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  });

  // Handle mobile menu links
  const mobileLinks = mobileMenu.querySelectorAll('a');
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMobileMenu();
    });
  });
}

/**
 * Open mobile menu
 */
function openMobileMenu() {
  const mobileMenu = document.querySelector('.mobile-menu');
  const toggle = document.querySelector('.mobile-menu-toggle');
  
  if (mobileMenu) {
    mobileMenu.classList.add('open');
    document.body.style.overflow = 'hidden';
    
    gsap.from('.mobile-menu-content > *', {
      opacity: 0,
      y: 20,
      stagger: 0.1,
      duration: 0.4,
      ease: 'power3.out'
    });
  }
  
  if (toggle) {
    toggle.classList.add('active');
  }
}

/**
 * Close mobile menu
 */
function closeMobileMenu() {
  const mobileMenu = document.querySelector('.mobile-menu');
  const toggle = document.querySelector('.mobile-menu-toggle');
  
  if (mobileMenu) {
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  }
  
  if (toggle) {
    toggle.classList.remove('active');
  }
}

/**
 * Add mobile menu CSS styles
 */
function addMobileMenuStyles() {
  const styles = `
    .mobile-menu {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(15, 23, 42, 0.98);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      z-index: 99;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
    }
    
    .mobile-menu.open {
      opacity: 1;
      visibility: visible;
    }
    
    .mobile-menu-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2rem;
      text-align: center;
    }
    
    .mobile-menu .nav-link {
      display: block;
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--text-primary);
      padding: 0.5rem 1rem;
      transition: color 0.3s ease;
    }
    
    .mobile-menu .nav-link:hover,
    .mobile-menu .nav-link.active {
      color: var(--primary-400);
    }
    
    .mobile-menu .cta-button {
      margin-top: 1rem;
      padding: 1rem 2rem;
      font-size: 1rem;
    }
    
    .mobile-menu-toggle.active span:nth-child(1) {
      transform: rotate(45deg) translate(5px, 5px);
    }
    
    .mobile-menu-toggle.active span:nth-child(2) {
      opacity: 0;
    }
    
    .mobile-menu-toggle.active span:nth-child(3) {
      transform: rotate(-45deg) translate(5px, -5px);
    }
  `;

  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}
