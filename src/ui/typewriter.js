// Typewriter Effect Utility
export function initTypewriter() {
  // Typewriter configuration
  const config = {
    speed: 40, // milliseconds per character
    delay: 0, // no delay – show text fast
    cursor: true, // show blinking cursor
  };

  // Find all elements with typewriter class
  const elements = document.querySelectorAll('[data-typewriter]');
  
  elements.forEach((element, index) => {
    const text = element.textContent;
    const speed = parseInt(element.getAttribute('data-speed')) || config.speed;
    const delay = parseInt(element.getAttribute('data-delay')) || config.delay;
    const showCursor = element.getAttribute('data-cursor') !== 'false';
    
    // Clear the element
    element.textContent = '';
    element.style.opacity = '1';
    
    // Add cursor if enabled
    if (showCursor) {
      element.classList.add('typewriter-cursor');
    }
    
    // Start typewriter after delay
    setTimeout(() => {
      typeText(element, text, speed, showCursor);
    }, delay);
  });
}

function typeText(element, text, speed, showCursor) {
  let index = 0;
  
  function type() {
    if (index < text.length) {
      element.textContent += text.charAt(index);
      index++;
      setTimeout(type, speed);
    } else if (showCursor) {
      // Remove cursor after completion
      setTimeout(() => {
        element.classList.remove('typewriter-cursor');
      }, 1000);
    }
  }
  
  type();
}

// Intersection Observer for scroll-triggered typewriter
export function initScrollTypewriter() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.classList.contains('typed')) {
        entry.target.classList.add('typed');
        
        const text = entry.target.getAttribute('data-typewriter-text') || entry.target.textContent;
        const speed = parseInt(entry.target.getAttribute('data-speed')) || 50;
        const showCursor = entry.target.getAttribute('data-cursor') !== 'false';
        
        entry.target.textContent = '';
        entry.target.style.opacity = '1';
        
        if (showCursor) {
          entry.target.classList.add('typewriter-cursor');
        }
        
        typeText(entry.target, text, speed, showCursor);
      }
    });
  }, {
    threshold: 0.5,
    rootMargin: '0px'
  });
  
  // Observe scroll typewriter elements
  document.querySelectorAll('[data-scroll-typewriter]').forEach(el => {
    observer.observe(el);
  });
}

// Word-by-word typewriter (for hero)
export function initWordTypewriter() {
  const elements = document.querySelectorAll('[data-word-typewriter]');
  
  elements.forEach(element => {
    const words = element.textContent.trim().split(' ');
    const speed = parseInt(element.getAttribute('data-speed')) || 150;
    const delay = parseInt(element.getAttribute('data-delay')) || 0;
    
    element.textContent = '';
    element.style.opacity = '1';
    
    setTimeout(() => {
      typeWords(element, words, speed);
    }, delay);
  });
}

function typeWords(element, words, speed) {
  let index = 0;
  
  function type() {
    if (index < words.length) {
      const span = document.createElement('span');
      span.textContent = words[index] + ' ';
      span.style.opacity = '0';
      span.style.display = 'inline-block';
      span.style.animation = 'fadeInWord 0.3s ease-out forwards';
      span.style.animationDelay = '0s';
      
      element.appendChild(span);
      index++;
      setTimeout(type, speed);
    }
  }
  
  type();
}
