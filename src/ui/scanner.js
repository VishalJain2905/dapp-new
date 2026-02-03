/**
 * Card Scanner Section Logic
 * Implements a horizontal infinite-ish card scroller with a scanner reveal effect
 */

const codeChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789(){}[]<>;:,._-+=!@#$%^&*|\\/\"'`~?";

const MOCK_PROJECTS = [
  { id: 1, tag: "Smart Contract", title: "Liquidity Protocol", status: "Verified", hash: "0x74a...82f" },
  { id: 2, tag: "Infrastructure", title: "Node Cluster X", status: "Healthy", hash: "0x91b...34e" },
  { id: 3, tag: "Analytics", title: "On-Chain Indexer", status: "Syncing", hash: "0x22c...11a" },
  { id: 4, tag: "Security", title: "Audit Engine", status: "Scanning", hash: "0x55d...99z" },
  { id: 5, tag: "Frontend", title: "DEX Interface", status: "Live", hash: "0x33e...77m" },
  { id: 6, tag: "Bridge", title: "Cross-Chain Hub", status: "Active", hash: "0x88f...55p" },
];

function generateCode(width, height) {
  let out = "";
  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      out += codeChars[Math.floor(Math.random() * codeChars.length)];
    }
    if (row < height - 1) out += "\n";
  }
  return out;
}

export function initCardScanner() {
  const section = document.querySelector('.card-scanner-section');
  if (!section) return;

  const scroller = section.querySelector('.card-scroller');
  const particleCanvas = section.querySelector('#particleCanvas');
  const scannerCanvas = section.querySelector('#scannerCanvas');
  
  if (!scroller || !particleCanvas || !scannerCanvas) return;

  // Track state
  let position = -2760;
  let isScanning = false;
  let asciiContents = MOCK_PROJECTS.map(() => generateCode(60, 20));
  let lastTime = 0;
  let lastAsciiUpdate = 0;

  // Particles state
  const particles = [];
  const scannerParticles = [];

  // Setup cards
  const streamProjects = [...MOCK_PROJECTS, ...MOCK_PROJECTS, ...MOCK_PROJECTS];
  scroller.innerHTML = '';
  
  const cardElements = streamProjects.map((project, idx) => {
    const cardWrapper = document.createElement('div');
    cardWrapper.className = 'scanner-card-wrapper';
    
    cardWrapper.innerHTML = `
      <div class="scanner-card card-face-ascii">
        <div class="ascii-code-content">${asciiContents[project.id - 1]}</div>
      </div>
      <div class="scanner-card card-face-normal">
        <div class="card-tag">${project.tag}</div>
        <h4 class="card-title-main">${project.title}</h4>
        <div class="card-status-pill">
           <span class="card-status-dot"></span>
           ${project.status}
        </div>
        <div class="card-bottom-row">
          <div class="card-hash">${project.hash}</div>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <path d="M16 4L26 28L16 22L6 28L16 4Z" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>
      </div>
    `;
    
    scroller.appendChild(cardWrapper);
    return {
      el: cardWrapper,
      asciiFace: cardWrapper.querySelector('.card-face-ascii'),
      normalFace: cardWrapper.querySelector('.card-face-normal'),
      asciiContentEl: cardWrapper.querySelector('.ascii-code-content'),
      projectId: project.id
    };
  });

  // Canvas setup
  const particleCtx = particleCanvas.getContext('2d', { alpha: false });
  const scannerCtx = scannerCanvas.getContext('2d');
  
  function resize() {
    particleCanvas.width = window.innerWidth;
    particleCanvas.height = 350;
    scannerCanvas.width = window.innerWidth;
    scannerCanvas.height = 450;
    
    // Reset background particles
    particles.length = 0;
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * particleCanvas.width,
        y: Math.random() * particleCanvas.height,
        vx: Math.random() * 0.5 + 0.2,
        size: Math.random() * 2 + 1,
        alpha: Math.random() * 0.4 + 0.1
      });
    }
  }

  window.addEventListener('resize', resize);
  resize();

  function animate(time) {
    if (!lastTime) lastTime = time;
    const delta = time - lastTime;
    lastTime = time;

    // 1. Move position
    const speed = 120; // px per second
    position += (speed * delta) / 1000;
    if (position >= 0) position = -2760;
    
    scroller.style.transform = `translateX(${position}px)`;

    // 2. Update ASCII contents
    if (time - lastAsciiUpdate > 200) {
      lastAsciiUpdate = time;
      cardElements.forEach(card => {
        if (Math.random() < 0.1) {
          const newCode = generateCode(60, 20);
          card.asciiContentEl.textContent = newCode;
        }
      });
    }

    // 3. Update Clip Paths
    const scannerX = window.innerWidth * 0.2;
    const cardWidth = 380;
    const cardGap = 80;
    const initialOffset = 100;
    
    let currentlyScanning = false;

    cardElements.forEach((card, index) => {
      const cardLeftGlobal = initialOffset + (index * (cardWidth + cardGap)) + position;
      const relX = scannerX - cardLeftGlobal;
      
      let clipNormal = "inset(0 0 0 0%)";
      let clipAscii = "inset(0 100% 0 0)";

      if (relX > 0 && relX < cardWidth) {
        const percent = (relX / cardWidth) * 100;
        clipNormal = `inset(0 0 0 ${percent}%)`;
        clipAscii = `inset(0 ${100 - percent}% 0 0)`;
        currentlyScanning = true;
      } else if (relX >= cardWidth) {
        clipNormal = "inset(0 0 0 100%)";
        clipAscii = "inset(0 0% 0 0)";
      }
      
      card.normalFace.style.clipPath = clipNormal;
      card.asciiFace.style.clipPath = clipAscii;
    });
    
    isScanning = currentlyScanning;

    // 4. Render Background Particles
    particleCtx.fillStyle = "#000000";
    particleCtx.fillRect(0, 0, particleCanvas.width, particleCanvas.height);
    
    particles.forEach(p => {
      p.x += p.vx;
      if (p.x > particleCanvas.width) p.x = -10;
      particleCtx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
      particleCtx.beginPath();
      particleCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      particleCtx.fill();
    });

    // 5. Render Scanner Particles
    scannerCtx.clearRect(0, 0, scannerCanvas.width, scannerCanvas.height);
    
    if (isScanning) {
      const centerX = scannerCanvas.width * 0.2;
      for (let i = 0; i < 2; i++) {
        scannerParticles.push({
          x: centerX + (Math.random() - 0.5) * 4,
          y: Math.random() * scannerCanvas.height,
          vx: Math.random() * 2 + 1,
          vy: (Math.random() - 0.5) * 0.5,
          life: 1.0,
          decay: Math.random() * 0.03 + 0.02,
          size: Math.random() * 1.5 + 0.5
        });
      }
    }

    for (let i = 0; i < scannerParticles.length; i++) {
      const p = scannerParticles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= p.decay;

      if (p.life <= 0) {
        scannerParticles.splice(i, 1);
        i--;
        continue;
      }

      scannerCtx.globalAlpha = p.life;
      scannerCtx.fillStyle = "#ffffff";
      scannerCtx.beginPath();
      scannerCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      scannerCtx.fill();
    }

    requestAnimationFrame(animate);
  }

  // Intersection Observer to run animation only when visible
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      requestAnimationFrame(animate);
    }
  }, { threshold: 0.1 });
  
  observer.observe(section);
}
