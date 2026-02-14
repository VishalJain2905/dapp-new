/**
 * 3D background: HDR + GLTF model. Orbit 360° on scroll + cursor moves the view.
 */

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { HDRLoader } from 'three/examples/jsm/loaders/HDRLoader.js';

const HDR_URL = 'https://cdn.apewebapps.com/threejs/161/examples/textures/equirectangular/royal_esplanade_1k.hdr';
const MODEL_URL = 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/DamagedHelmet/glTF-Binary/DamagedHelmet.glb';

const CAMERA_RADIUS = 3.2;
const SCENE_CENTER = new THREE.Vector3(0, 0, 0);
const MOUSE_INFLUENCE = Math.PI * 0.4;

// Presentation controls: min/max angles (radians)
const MIN_AZIMUTH = -Math.PI * 0.9;
const MAX_AZIMUTH = Math.PI * 0.9;
const MIN_POLAR = 0.15;
const MAX_POLAR = 0.65;

let camera, scene, renderer;
let currentModel, mixer;
let clock;
let animationId;
let scrollAngle = 0;
let currentAzimuth = 0;
let currentPolar = 0.35;
let mouseX = 0;
let targetMouseX = 0;
let mouseY = 0;
let targetMouseY = 0;
const LERP = 0.08;
const MOUSE_LERP = 0.05;
const POLAR_INFLUENCE = 0.25;

function getScrollProgress() {
  const scrollY = window.scrollY;
  const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  return Math.max(0, Math.min(1, scrollY / maxScroll));
}

function onScroll() {
  scrollAngle = getScrollProgress() * Math.PI * 2;
}

function onMouseMove(e) {
  targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
  targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
}

function isWebGLSupported() {
  try {
    const canvas = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
  } catch (e) {
    return false;
  }
}

export function initScene() {
  const container = document.getElementById('canvas-container');
  if (!container) {
    console.warn('[3D GLTF Background] No #canvas-container found.');
    return;
  }

  if (!isWebGLSupported()) {
    container.classList.add('canvas-fallback');
    return;
  }

  clock = new THREE.Clock();

  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.25, 20);
  updateCameraPosition(0, currentPolar);

  scene = new THREE.Scene();

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const canvas = renderer.domElement;
  canvas.setAttribute('aria-hidden', 'true');
  canvas.style.display = 'block';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  container.appendChild(canvas);

  const hdrLoader = new HDRLoader();
  hdrLoader.load(HDR_URL, (texture) => {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.background = null;
    scene.environment = texture;
    loadModel();
  }, undefined, () => {
    console.warn('[3D GLTF Background] HDR failed.');
    scene.background = null;
    loadModel();
  });

  window.addEventListener('resize', onWindowResize);
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('mousemove', onMouseMove, { passive: true });
  onScroll();
  animate();
}

function loadModel() {
  const loader = new GLTFLoader();
  loader.load(MODEL_URL, (gltf) => {
    currentModel = gltf.scene;
    scene.add(currentModel);

    if (gltf.animations.length > 0) {
      mixer = new THREE.AnimationMixer(currentModel);
      gltf.animations.forEach((clip) => mixer.clipAction(clip).play());
    }
  }, undefined, (err) => {
    console.warn('[3D GLTF Background] Model load failed:', err);
  });
}

function updateCameraPosition(azimuth, polar) {
  const r = CAMERA_RADIUS;
  camera.position.x = r * Math.cos(polar) * Math.sin(azimuth);
  camera.position.y = r * Math.sin(polar);
  camera.position.z = r * Math.cos(polar) * Math.cos(azimuth);
  camera.lookAt(SCENE_CENTER);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  animationId = requestAnimationFrame(animate);
  const delta = clock.getDelta();

  if (mixer) mixer.update(delta);

  mouseX += (targetMouseX - mouseX) * MOUSE_LERP;
  mouseY += (targetMouseY - mouseY) * MOUSE_LERP;

  const targetAzimuth = Math.max(MIN_AZIMUTH, Math.min(MAX_AZIMUTH, scrollAngle + mouseX * MOUSE_INFLUENCE));
  const targetPolar = Math.max(MIN_POLAR, Math.min(MAX_POLAR, 0.35 + mouseY * POLAR_INFLUENCE));

  currentAzimuth += (targetAzimuth - currentAzimuth) * LERP;
  currentPolar += (targetPolar - currentPolar) * LERP;

  updateCameraPosition(currentAzimuth, currentPolar);

  renderer.render(scene, camera);
}

export function destroyScene() {
  if (animationId) cancelAnimationFrame(animationId);
  window.removeEventListener('resize', onWindowResize);
  window.removeEventListener('scroll', onScroll);
  window.removeEventListener('mousemove', onMouseMove);
  if (renderer && renderer.domElement) renderer.domElement.remove();
}
