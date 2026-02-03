/**
 * Form Handling Module
 * Contact form validation and submission
 */

import { gsap } from 'gsap';

/**
 * Initialize form functionality
 */
export function initForm() {
  setupContactForm();
  setupInputAnimations();
}

/**
 * Setup contact form handling
 */
function setupContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;

    // Validate form
    if (!validateForm(form)) {
      showNotification('Please fill in all required fields.', 'error');
      return;
    }

    // Show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <span class="loading-spinner"></span>
      <span>Sending...</span>
    `;
    addSpinnerStyles();

    // Simulate form submission (replace with actual API call)
    try {
      await simulateFormSubmission(form);
      
      // Success animation
      gsap.to(submitBtn, {
        scale: 1.05,
        duration: 0.2,
        yoyo: true,
        repeat: 1
      });

      submitBtn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <span>Message Sent!</span>
      `;
      submitBtn.style.background = 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)';

      showNotification('Thank you! We\'ll be in touch soon.', 'success');
      form.reset();

      // Reset button after delay
      setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.style.background = '';
        submitBtn.disabled = false;
      }, 3000);

    } catch (error) {
      console.error('Form submission error:', error);
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
      showNotification('Something went wrong. Please try again.', 'error');
    }
  });
}

/**
 * Validate form fields
 */
function validateForm(form) {
  const requiredFields = form.querySelectorAll('[required]');
  let isValid = true;

  requiredFields.forEach(field => {
    const value = field.value.trim();
    const isFieldValid = value !== '';

    // Email validation
    if (field.type === 'email' && isFieldValid) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        markFieldInvalid(field);
        isValid = false;
        return;
      }
    }

    if (!isFieldValid) {
      markFieldInvalid(field);
      isValid = false;
    } else {
      markFieldValid(field);
    }
  });

  return isValid;
}

/**
 * Mark field as invalid
 */
function markFieldInvalid(field) {
  field.style.borderColor = 'var(--error-500)';
  
  gsap.to(field, {
    x: [-10, 10, -10, 10, 0],
    duration: 0.4,
    ease: 'power2.out'
  });

  field.addEventListener('input', function handleInput() {
    markFieldValid(field);
    field.removeEventListener('input', handleInput);
  }, { once: true });
}

/**
 * Mark field as valid
 */
function markFieldValid(field) {
  field.style.borderColor = 'var(--border-color)';
}

/**
 * Setup input focus animations
 */
function setupInputAnimations() {
  const inputs = document.querySelectorAll('.form-group input, .form-group select, .form-group textarea');

  inputs.forEach(input => {
    const formGroup = input.closest('.form-group');
    const label = formGroup?.querySelector('label');

    // Focus animation
    input.addEventListener('focus', () => {
      if (label) {
        gsap.to(label, {
          color: 'var(--primary-400)',
          duration: 0.2
        });
      }
      
      gsap.to(input, {
        borderColor: 'var(--primary-500)',
        boxShadow: '0 0 0 3px rgba(14, 165, 233, 0.1)',
        duration: 0.2
      });
    });

    // Blur animation
    input.addEventListener('blur', () => {
      if (label) {
        gsap.to(label, {
          color: 'var(--text-secondary)',
          duration: 0.2
        });
      }
      
      gsap.to(input, {
        borderColor: 'var(--border-color)',
        boxShadow: 'none',
        duration: 0.2
      });
    });
  });
}

/**
 * Simulate form submission (replace with actual API call)
 */
async function simulateFormSubmission(form) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());
      console.log('Form submitted:', data);
      resolve(data);
    }, 1500);
  });
}

/**
 * Show notification
 */
function showNotification(message, type = 'success') {
  // Remove existing notification
  const existing = document.querySelector('.notification');
  if (existing) {
    existing.remove();
  }

  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <span class="notification-icon">
        ${type === 'success' 
          ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>'
          : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>'
        }
      </span>
      <span class="notification-message">${message}</span>
      <button class="notification-close" aria-label="Close notification">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>
  `;

  // Add styles if not already present
  addNotificationStyles();

  document.body.appendChild(notification);

  // Animate in
  gsap.from(notification, {
    opacity: 0,
    y: -20,
    duration: 0.3,
    ease: 'power3.out'
  });

  // Close button
  notification.querySelector('.notification-close').addEventListener('click', () => {
    closeNotification(notification);
  });

  // Auto close
  setTimeout(() => {
    closeNotification(notification);
  }, 5000);
}

/**
 * Close notification
 */
function closeNotification(notification) {
  gsap.to(notification, {
    opacity: 0,
    y: -20,
    duration: 0.3,
    ease: 'power3.in',
    onComplete: () => notification.remove()
  });
}

/**
 * Add notification CSS styles
 */
function addNotificationStyles() {
  if (document.querySelector('#notification-styles')) return;

  const styles = `
    .notification {
      position: fixed;
      top: 100px;
      right: var(--container-padding);
      z-index: 1000;
      max-width: 400px;
    }
    
    .notification-content {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem 1.25rem;
      background: var(--bg-secondary);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid var(--border-color);
      border-radius: 12px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
    }
    
    .notification-success .notification-content {
      border-color: rgba(34, 197, 94, 0.3);
    }
    
    .notification-error .notification-content {
      border-color: rgba(239, 68, 68, 0.3);
    }
    
    .notification-icon {
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .notification-success .notification-icon svg {
      stroke: var(--success-500);
    }
    
    .notification-error .notification-icon svg {
      stroke: var(--error-500);
    }
    
    .notification-message {
      flex: 1;
      font-size: 0.9rem;
      color: var(--text-primary);
    }
    
    .notification-close {
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0.25rem;
      border-radius: 4px;
      transition: background 0.2s ease;
    }
    
    .notification-close:hover {
      background: var(--bg-glass);
    }
    
    .notification-close svg {
      stroke: var(--text-muted);
    }
  `;

  const styleSheet = document.createElement('style');
  styleSheet.id = 'notification-styles';
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

/**
 * Add spinner CSS styles
 */
function addSpinnerStyles() {
  if (document.querySelector('#spinner-styles')) return;

  const styles = `
    .loading-spinner {
      width: 18px;
      height: 18px;
      border: 2px solid transparent;
      border-top-color: currentColor;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `;

  const styleSheet = document.createElement('style');
  styleSheet.id = 'spinner-styles';
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}
