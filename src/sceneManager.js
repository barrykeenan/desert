import {
    MathUtils,
    Vector3,
    Box3,
    Scene,
    TextureLoader,
    LoadingManager,
    GridHelper,
    AxesHelper,
    PlaneGeometry,
    MeshStandardMaterial,
    Mesh,
} from 'three';

import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import { LoadingScreen } from './components/loading-screen.js';
import { Lights } from './components/lights';

import { Ground1 } from './scene/ground1.js';
import { Cube } from './scene/cube.js';

class SceneManager {
    constructor(renderer, camera) {
        this.renderer = renderer;
        this.camera = camera;
        this.scene = new Scene();
        this.loadingManager = new LoadingManager();
        this.materials = {};
        this.pickableMeshes = [];

        this.objLoader = new OBJLoader(this.loadingManager);
        this.objLoader.setPath('assets/');

        this.fbxLoader = new FBXLoader(this.loadingManager);
        this.fbxLoader.setPath('assets/');

        this.textureLoader = new TextureLoader(this.loadingManager);
        this.textureLoader.setPath('assets/');

        this.exrLoader = new EXRLoader(this.loadingManager);
        this.exrLoader.setPath('assets/');

        this.orbitControls = this.initControls();

        this.addObjects();
        this.lights = new Lights(this.scene, this.exrLoader);

        this.initComponents();
        this.bindEvents();
    }

    initControls() {
        const orbitControls = new OrbitControls(this.camera, this.renderer.domElement);

        orbitControls.target = new Vector3(0, 20, 0);

        orbitControls.enablePan = false;

        // Vertical orbit limits.
        orbitControls.minPolarAngle = MathUtils.degToRad(30); // 0 is looking straight down.
        orbitControls.maxPolarAngle = MathUtils.degToRad(80); // 90 is horizontal to ground

        // Dolly limits.
        orbitControls.minDistance = 30;
        orbitControls.maxDistance = 200;

        orbitControls.autoRotate = false;
        orbitControls.enableDamping = true;

        return orbitControls;
    }

    /**
     * Add objects to the scene
     */
    addObjects() {
        const helper = new GridHelper(500, 10);
        helper.material.transparent = true;
        helper.material.opacity = 0.25;
        this.scene.add(helper);

        const axesHelper = new AxesHelper(10);
        this.scene.add(axesHelper);

        this.ground1 = new Ground1(this.fbxLoader, this.textureLoader);
        this.scene.add(this.ground1.rootObject);

        // this.cube = new Cube(this.objLoader, this.textureLoader);
        // this.cube.rootObject.position.z = -100;
        // this.cube.rootObject.position.y = 50;
        // this.cube.rootObject.position.x = 100;
        // this.scene.add(this.cube.rootObject);

        //Create a plane that receives shadows (but does not cast them)
        // const planeGeometry = new PlaneGeometry(500, 500);
        // planeGeometry.rotateX(-Math.PI / 2);
        // const planeMaterial = new MeshStandardMaterial({ color: 0xcccccc });
        // const plane = new Mesh(planeGeometry, planeMaterial);
        // plane.receiveShadow = true;
        // this.scene.add(plane);

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
