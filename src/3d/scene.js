/**
 * DappStudio — Full-site 3D Background Scene (Three.js)
 * Fixed behind all content; scroll and mouse driven. Production-ready.
 */

import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import waveTexture from '../assets/textures/fifth.png';

gsap.registerPlugin(ScrollTrigger);

const CONFIG = {
  camera: {
    fov: 50,
    near: 0.1,
    far: 3000,
  },
  quality: {
    pixelRatio: Math.min(window.devicePixelRatio, 2),
  },
  particles: {
    count: 2500,
    size: 2.5,
    speed: 0.0008,
  },
};

let scene, camera, renderer, clock;
let scrollProgress = 0;
let targetScrollProgress = 0;
let mouseX = 0, mouseY = 0;
let targetMouseX = 0, targetMouseY = 0;
let animationId;

let backgroundMesh;
let particles;

// ============================================================================
// INITIALIZATION
// ============================================================================

function isWebGLSupported() {
  try {
    const canvas = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
  } catch (e) {
    return false;
  }
}

/**
 * Initialize the full-site 3D background. Call once after DOM ready.
 * Requires an element with id="canvas-container" in the page.
 */
export function initScene() {
  const container = document.getElementById('canvas-container');
  if (!container) {
    console.warn('[3D Scene] No #canvas-container found.');
    return;
  }

  if (!isWebGLSupported()) {
    container.classList.add('canvas-fallback');
    return;
  }

  initRenderer(container);
  initCamera();
  initSceneObject();
  setupScrollCamera();
  setupMouseInteraction();
  setupResizeHandler();
  animate();
}

function initRenderer(container) {
  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: false,
    powerPreference: 'high-performance',
    stencil: false,
    depth: true,
  });

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(CONFIG.quality.pixelRatio);
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const canvas = renderer.domElement;
  canvas.setAttribute('aria-hidden', 'true');
  canvas.style.display = 'block';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  container.appendChild(canvas);
}

function initCamera() {
  camera = new THREE.PerspectiveCamera(
    CONFIG.camera.fov,
    window.innerWidth / window.innerHeight,
    CONFIG.camera.near,
    CONFIG.camera.far
  );
  
  camera.position.set(0, 0, 300);
  camera.lookAt(0, 0, 0);
}

function initSceneObject() {
  scene = new THREE.Scene();
  clock = new THREE.Clock();

  createBackgroundTransition();
  createParticles();
}

function createParticles() {
  const count = CONFIG.particles.count;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const velocities = new Float32Array(count * 3);
  
  // Color palette: cyan, blue, purple, white
  const colorPalette = [
    new THREE.Color(0x60efff), // Cyan
    new THREE.Color(0x0061ff), // Blue
    new THREE.Color(0x8b5cf6), // Purple
    new THREE.Color(0xffffff), // White
    new THREE.Color(0x00d4ff), // Light cyan
  ];
  
  for (let i = 0; i < count; i++) {
    // Distribute particles in a sphere-like pattern
    const radius = 800 + Math.random() * 1200;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    
    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = radius * Math.cos(phi);
    
    // Random velocities for organic movement
    velocities[i * 3] = (Math.random() - 0.5) * 0.5;
    velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.5;
    velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.5;
    
    // Random colors from palette
    const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
    
    // Varied sizes
    sizes[i] = Math.random() * 3 + 0.5;
  }
  
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
  geometry.userData.velocities = velocities;
  
  const material = new THREE.PointsMaterial({
    size: CONFIG.particles.size,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true,
    depthWrite: false,
    vertexColors: true,
  });
  
  particles = new THREE.Points(geometry, material);
  scene.add(particles);
}

/**
 * Rolling Wave Background System
 * Single wavy texture with scroll-driven rolling effect
 */
function createBackgroundTransition() {
  const loader = new THREE.TextureLoader();
  const waveTex = loader.load(waveTexture);
  
  // Enable texture repeat for seamless rolling
  waveTex.wrapS = THREE.RepeatWrapping;
  waveTex.wrapT = THREE.RepeatWrapping;
  waveTex.colorSpace = THREE.SRGBColorSpace;
  waveTex.minFilter = THREE.LinearFilter;
  waveTex.magFilter = THREE.LinearFilter;
  
  const geometry = new THREE.PlaneGeometry(3500, 2200);
  
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTexture: { value: waveTex },
      uScroll: { value: 0 },
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) }
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform sampler2D uTexture;
      uniform float uScroll;
      uniform float uTime;
      uniform vec2 uMouse;
      varying vec2 vUv;
      
      void main() {
        vec2 uv = vUv;
        
        // === ROLLING WAVE EFFECT ===
        // The middle section rolls based on scroll
        
        // Calculate distance from center (vertical)
        float centerDist = abs(uv.y - 0.5);
        
        // Create a smooth mask - strongest in the middle, fades at edges
        float rollMask = 1.0 - smoothstep(0.0, 0.5, centerDist);
        rollMask = pow(rollMask, 0.8); // Adjust curve for smoother falloff
        
        // Apply rolling offset based on scroll (middle moves more)
        float rollAmount = uScroll * 2.0; // How much the texture rolls
        uv.y += rollAmount * rollMask;
        
        // Add subtle horizontal wave motion
        uv.x += sin(uv.y * 3.0 + uTime * 0.3) * 0.01 * rollMask;
        
        // Add gentle breathing animation
        float breathe = sin(uTime * 0.5) * 0.005;
        uv += breathe * rollMask;
        
        // Mouse interaction - subtle displacement
        float mouseDist = distance(uv, vec2(0.5 + uMouse.x * 0.1, 0.5 + uMouse.y * 0.1));
        float mouseEffect = smoothstep(0.5, 0.0, mouseDist) * 0.02;
        uv += mouseEffect * (uMouse - vec2(0.5));
        
        // Sample the wave texture
        vec4 color = texture2D(uTexture, uv);
        
        // === ENHANCE THE WAVE COLORS ===
        
        // Boost contrast slightly
        color.rgb = pow(color.rgb, vec3(0.95));
        
        // Add subtle color variation based on scroll position
        vec3 tint1 = vec3(0.1, 0.15, 0.2); // Deep blue tint
        vec3 tint2 = vec3(0.15, 0.1, 0.2); // Purple tint
        vec3 tint = mix(tint1, tint2, uScroll);
        color.rgb += tint * 0.1 * (1.0 - color.r);
        
        // Add glow in the rolling area
        float glowIntensity = rollMask * 0.15;
        vec3 glowColor = vec3(0.3, 0.4, 0.6);
        color.rgb = mix(color.rgb, color.rgb + glowColor * glowIntensity, rollMask * 0.5);
        
        // Very subtle vignette - keeps edges visible
        float dist = distance(uv, vec2(0.5));
        float vignette = smoothstep(0.8, 0.3, dist);
        color.rgb *= mix(0.85, 1.0, vignette);
        
        gl_FragColor = color;
      }
    `,
    side: THREE.DoubleSide,
    depthWrite: false,
    depthTest: false
  });
  
  backgroundMesh = new THREE.Mesh(geometry, material);
  backgroundMesh.position.z = -1000;
  scene.add(backgroundMesh);
}

// ============================================================================
// ANIMATION & CONTROLS
// ============================================================================
function setupScrollCamera() {
  ScrollTrigger.create({
    trigger: 'body',
    start: 'top top',
    end: 'bottom bottom',
    scrub: 0,
    onUpdate: (self) => {
      targetScrollProgress = self.progress;
    }
  });
}

function updateCamera() {
  scrollProgress += (targetScrollProgress - scrollProgress) * 0.05;
  mouseX += (targetMouseX - mouseX) * 0.05;
  mouseY += (targetMouseY - mouseY) * 0.05;
}

function animate() {
  animationId = requestAnimationFrame(animate);
  const elapsed = clock.getElapsedTime();
  updateCamera();
  
  // Animate particles with organic movement
  if (particles) {
    const positions = particles.geometry.attributes.position.array;
    const velocities = particles.geometry.userData.velocities;
    
    for (let i = 0; i < positions.length; i += 3) {
      // Add sine wave motion
      positions[i] += Math.sin(elapsed * 0.5 + i) * 0.1;
      positions[i + 1] += Math.cos(elapsed * 0.3 + i) * 0.1;
      positions[i + 2] += velocities[i + 2] * (1 + scrollProgress * 2);
      
      // Reset particles that go too far
      if (positions[i + 2] > 1000) positions[i + 2] = -1000;
    }
    
    particles.geometry.attributes.position.needsUpdate = true;
    particles.rotation.y += CONFIG.particles.speed;
    particles.rotation.x += CONFIG.particles.speed * 0.5;
    
    // Mouse influence on particles
    particles.rotation.y += mouseX * 0.0002;
    particles.rotation.x += mouseY * 0.0002;
  }

  if (backgroundMesh) {
    backgroundMesh.material.uniforms.uScroll.value = scrollProgress;
    backgroundMesh.material.uniforms.uTime.value = elapsed;
    backgroundMesh.material.uniforms.uMouse.value.set(mouseX, mouseY);
    
    // Subtle zoom effect on scroll
    let zoom = 1.0 + (scrollProgress * 0.15);
    backgroundMesh.scale.setScalar(zoom);
    
    backgroundMesh.position.copy(camera.position);
    backgroundMesh.position.z -= 1000; 
    backgroundMesh.lookAt(camera.position);

    // Subtle tilt based on mouse
    backgroundMesh.rotation.x = mouseY * 0.015;
    backgroundMesh.rotation.y = mouseX * 0.015;
  }
  
  renderer.render(scene, camera);
}

function setupMouseInteraction() {
  document.addEventListener('mousemove', (e) => {
    targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });
}

function setupResizeHandler() {
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

export function destroyScene() {
  cancelAnimationFrame(animationId);
  if (renderer && renderer.domElement) renderer.domElement.remove();
  ScrollTrigger.getAll().forEach(t => t.kill());
}
