import { Vector2, Raycaster, CatmullRomCurve3, TubeGeometry, Mesh, Color, MeshBasicMaterial, MathUtils } from 'three';

import * as dat from 'dat.gui';

class SettingsPanel {
    constructor(camera, sceneManager, orbitControls, objectPicker) {
        this.camera = camera;
        this.scene = sceneManager.scene;
        this.materials = sceneManager.materials;

        this.gui = new dat.GUI();

        this.heightScale = 0.2;
        this.bouncingSpeed = 0.04;

        this.showRay = false;

        // const cameraFolder = this.gui.addFolder('Camera');
        // cameraFolder.add(this.camera.position, 'x', -500, 500);
        // cameraFolder.add(this.camera.position, 'y', 0, 500);
        // cameraFolder.add(this.camera.position, 'z', 0, 1000);
        // cameraFolder.open();

        const keyLight = this.scene.getObjectByName('keyLight');
        const keyLightHelper = this.scene.getObjectByName('keyLight-helper');
        if (keyLight) {
            const lightsFolder = this.gui.addFolder('Lights');

            lightsFolder.add(keyLight, 'intensity', 0, 10, 0.1);

            lightsFolder.add(keyLight.position, 'x', -1000, 1000).onChange(() => {
                this.updateLight(keyLight, keyLightHelper);
            });
            lightsFolder.add(keyLight.position, 'y', 0, 1000).onChange(() => {
                this.updateLight(keyLight, keyLightHelper);
            });
            lightsFolder.add(keyLight.position, 'z', -1000, 1000).onChange(() => {
                this.updateLight(keyLight, keyLightHelper);
            });

            lightsFolder.open();
        }

        const debugFolder = this.gui.addFolder('Debug');
        debugFolder.add(this, 'outputObjects');
        debugFolder.add(window, 'innerWidth').listen();
        debugFolder.add(window, 'innerHeight').listen();
        debugFolder.add(window, 'devicePixelRatio').listen();
        // debugFolder.open();
    }

    updateLight(keyLight, keyLightHelper) {
        keyLight.target.updateMatrixWorld();
        keyLightHelper.update();
    }

    outputObjects() {
        console.log(this.scene);
    }
}

export { SettingsPanel };
