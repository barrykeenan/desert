import { MathUtils, Vector3, Box3, Scene, TextureLoader, LoadingManager, AxesHelper } from 'three';

import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import { LoadingScreen } from './components/loading-screen.js';
import { Ground1 } from './components/ground1.js';
import { ShadowCatcher } from './components/shadow-catcher';
import { Lights } from './components/lights';

class SceneManager {
    constructor(renderer, camera) {
        this.renderer = renderer;
        this.camera = camera;
        this.scene = new Scene();
        this.loadingManager = new LoadingManager();
        this.materials = {};
        this.pickableMeshes = [];

        // this.objLoader = new OBJLoader(this.loadingManager);
        // this.objLoader.setPath('assets/');

        this.fbxLoader = new FBXLoader(this.loadingManager);
        this.fbxLoader.setPath('assets/');

        this.textureLoader = new TextureLoader(this.loadingManager);
        this.textureLoader.setPath('assets/');

        this.orbitControls = this.initControls();

        this.addObjects();
        this.lights = new Lights(this.scene, this.textureLoader);

        this.initComponents();
        this.bindEvents();
    }

    initControls() {
        const orbitControls = new OrbitControls(this.camera, this.renderer.domElement);
        orbitControls.enablePan = false;

        // Vertical orbit limits.
        orbitControls.minPolarAngle = MathUtils.degToRad(40);
        orbitControls.maxPolarAngle = MathUtils.degToRad(75);

        orbitControls.autoRotate = false;
        orbitControls.enableDamping = true;

        return orbitControls;
    }

    /**
     * Add objects to the scene
     */
    addObjects() {
        const axesHelper = new AxesHelper(5);
        this.scene.add(axesHelper);

        this.ground1 = new Ground1(this.fbxLoader, this.textureLoader);
        this.scene.add(this.ground1.rootObject);

        // this.shadowCatcher = new ShadowCatcher(this.textureLoader);
        // this.scene.add(this.shadowCatcher.rootObject);
    }

    initComponents() {
        this.loadingScreen = new LoadingScreen();
    }

    bindEvents() {
        this.loadingManager.onLoad = this.onLoad.bind(this);
    }

    onLoad() {
        // this.fitCameraToSelection(this.camera, this.orbitControls, this.ground1.rootObject.children);

        this.loadingScreen.hide();
    }

    /**
     * Call update() on all scene children that need it
     */
    update() {
        this.orbitControls.update();
        // this.ground1.update();
    }

    fitCameraToSelection(camera, controls, selection, fitOffset = 1.1) {
        const box = new Box3();

        for (const object of selection) {
            box.expandByObject(object);
        }

        const size = box.getSize(new Vector3());
        const center = box.getCenter(new Vector3());

        const maxSize = Math.max(size.x, size.y, size.z);
        const fitHeightDistance = maxSize / (2 * Math.atan((Math.PI * camera.fov) / 360));
        const fitWidthDistance = fitHeightDistance / camera.aspect;
        const distance = fitOffset * Math.max(fitHeightDistance, fitWidthDistance);

        const direction = controls.target.clone().sub(camera.position).normalize().multiplyScalar(distance);

        controls.minDistance = distance / 2;
        controls.maxDistance = distance * 3;
        controls.target.copy(center);
        controls.target.y = -4; // pan up

        camera.near = distance / 100;
        camera.far = distance * 100;
        camera.updateProjectionMatrix();

        camera.position.copy(controls.target).sub(direction);

        controls.update();
    }
}

export { SceneManager };
