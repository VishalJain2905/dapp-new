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
      background: linear-gradient(
        135deg,
        rgba(2, 6, 23, 0.98) 0%,
        rgba(15, 23, 42, 0.98) 50%,
        rgba(2, 6, 23, 0.98) 100%
      );
      backdrop-filter: blur(30px) saturate(180%);
      -webkit-backdrop-filter: blur(30px) saturate(180%);
      z-index: 99;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      visibility: hidden;
      transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
      overflow: hidden;
    }
    
    /* Animated background orbs */
    .mobile-menu::before,
    .mobile-menu::after {
      content: '';
      position: absolute;
      border-radius: 50%;
      filter: blur(80px);
      pointer-events: none;
    }
    
    .mobile-menu::before {
      width: 400px;
      height: 400px;
      background: radial-gradient(circle, rgba(96, 239, 255, 0.15) 0%, transparent 70%);
      top: -100px;
      right: -100px;
      animation: floatOrb 8s ease-in-out infinite;
    }
    
    .mobile-menu::after {
      width: 300px;
      height: 300px;
      background: radial-gradient(circle, rgba(0, 97, 255, 0.15) 0%, transparent 70%);
      bottom: -50px;
      left: -50px;
      animation: floatOrb 10s ease-in-out infinite reverse;
    }
    
    @keyframes floatOrb {
      0%, 100% { transform: translate(0, 0) scale(1); }
      50% { transform: translate(30px, -30px) scale(1.1); }
    }
    
    .mobile-menu.open {
      opacity: 1;
      visibility: visible;
    }
    
    .mobile-menu-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.5rem;
      text-align: center;
      position: relative;
      z-index: 1;
    }
    
    .mobile-menu .nav-link {
      display: block;
      font-family: var(--font-display);
      font-size: clamp(1.5rem, 5vw, 2.5rem);
      font-weight: 300;
      letter-spacing: 0.05em;
      color: rgba(255, 255, 255, 0.6);
      padding: 0.75rem 1.5rem;
      transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
      position: relative;
    }
    
    .mobile-menu .nav-link::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 0;
      height: 2px;
      background: linear-gradient(90deg, #60efff, transparent);
      transition: width 0.4s ease;
    }
    
    .mobile-menu .nav-link:hover,
    .mobile-menu .nav-link.active {
      color: #ffffff;
      transform: translateX(20px);
    }
    
    .mobile-menu .nav-link:hover::before,
    .mobile-menu .nav-link.active::before {
      width: 30px;
    }
    
    .mobile-menu .nav-link.active {
      color: #60efff;
      text-shadow: 0 0 30px rgba(96, 239, 255, 0.5);
    }
    
    .mobile-menu .cta-button {
      margin-top: 2rem;
      padding: 1.25rem 2.5rem;
      font-size: 1rem;
      font-weight: 500;
      letter-spacing: 0.05em;
      color: #000000;
      background: linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%);
      border: none;
      border-radius: 50px;
      cursor: pointer;
      transition: all 0.4s ease;
    }
    
    .mobile-menu .cta-button:hover {
      transform: scale(1.05);
      box-shadow: 0 20px 40px rgba(255, 255, 255, 0.2);
    }
    
    .mobile-menu-toggle.active span:nth-child(1) {
      transform: rotate(45deg) translate(5px, 5px);
      background: #60efff;
    }
    
    .mobile-menu-toggle.active span:nth-child(2) {
      opacity: 0;
      transform: translateX(20px);
    }
    
    .mobile-menu-toggle.active span:nth-child(3) {
      transform: rotate(-45deg) translate(5px, -5px);
      background: #60efff;
    }
    
    /* Social links in mobile menu */
    .mobile-menu-social {
      display: flex;
      gap: 1.5rem;
      margin-top: 3rem;
      padding-top: 2rem;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .mobile-menu-social a {
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 12px;
      color: rgba(255, 255, 255, 0.6);
      transition: all 0.3s ease;
    }
    
    .mobile-menu-social a:hover {
      border-color: #60efff;
      color: #60efff;
      background: rgba(96, 239, 255, 0.1);
    }
  `;

  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}
