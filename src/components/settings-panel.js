import { Vector2, Raycaster, CatmullRomCurve3, TubeGeometry, Mesh, Color, MeshBasicMaterial, MathUtils } from 'three';

import * as dat from 'dat.gui';

class SettingsPanel {
    constructor(camera, sceneManager, orbitControls, objectPicker) {
        this.camera = camera;
        this.scene = sceneManager.scene;
        this.materials = sceneManager.materials;

        this.gui = new dat.GUI();

        this.time = 0;

        const mapRange = (value, x1, y1, x2, y2) => ((value - x1) * (y2 - x2)) / (y1 - x1) + x2;

        // const cameraFolder = this.gui.addFolder('Camera');
        // cameraFolder.add(this.camera.position, 'x', -500, 500);
        // cameraFolder.add(this.camera.position, 'y', 0, 500);
        // cameraFolder.add(this.camera.position, 'z', 0, 1000);
        // cameraFolder.open();

        const keyLight = this.scene.getObjectByName('keyLight');
        const keyLightHelper = this.scene.getObjectByName('keyLight-helper');
        if (keyLight) {
            const lightControlsFolder = this.gui.addFolder('Light controls');

            lightControlsFolder.add(keyLight.position, 'x', -1500, 1500).onChange(() => {
                this.updateLight(keyLight, keyLightHelper);
            });
            lightControlsFolder.add(keyLight.position, 'y', 0, 700).onChange(() => {
                this.updateLight(keyLight, keyLightHelper);
            });

            lightControlsFolder.add(keyLight, 'intensity', 0, 10, 0.1);

            lightControlsFolder.open();

            // time
            const timeFolder = this.gui.addFolder('Time of day');

            timeFolder.add(this, 'time', 0, 1, 0.01).onChange(() => {
                const sinValue = Math.sin(Math.PI * this.time);

                keyLight.position.x = mapRange(this.time, 0, 1, -1500, 1500);
                keyLight.position.y = mapRange(sinValue, 0, 1, 100, 700);
                keyLight.intensity = mapRange(sinValue, 0, 1, 2, 10);

                this.updateLight(keyLight, keyLightHelper);
            });

            timeFolder.open();

            // output
            const outputFolder = this.gui.addFolder('Sun position');

            outputFolder.add(keyLight.position, 'x').name('azimuth (x)').listen();
            outputFolder.add(keyLight.position, 'y').name('zenith (y)').listen();

            outputFolder.open();
        }

        // const debugFolder = this.gui.addFolder('Debug');
        // debugFolder.add(this, 'outputObjects');
        // debugFolder.add(window, 'innerWidth').listen();
        // debugFolder.add(window, 'innerHeight').listen();
        // debugFolder.add(window, 'devicePixelRatio').listen();
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
