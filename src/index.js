import './sass/styles.scss';

import { Vector3 } from 'three';

import { initStats } from './components/stats.js';
import { initRenderer } from './components/renderer.js';
import { initCamera } from './components/camera.js';
import { SceneManager } from './sceneManager.js';
import { SettingsPanel } from './components/settings-panel.js';

// initComponents
const stats = initStats();
const renderer = initRenderer();
// TODO: fit camera method here?
const camera = initCamera(new Vector3(-154, 50, 118));

const sceneManager = new SceneManager(renderer, camera);
// const scene = sceneManager.scene;

bindEvents();

// start loop
renderFrame();

function bindEvents() {
    window.addEventListener('resize', updateRenderSize, false);
}

function renderFrame() {
    stats.update();
    sceneManager.update();

    // render frame
    renderer.render(sceneManager.scene, camera);

    // keep looping
    window.requestAnimationFrame(renderFrame);
}

function updateRenderSize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
