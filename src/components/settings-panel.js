import { Vector2, Raycaster, CatmullRomCurve3, TubeGeometry, Mesh, Color, MeshBasicMaterial, MathUtils } from 'three';

import * as dat from 'dat.gui';

class SettingsPanel {
    constructor(camera, sceneManager, orbitControls, objectPicker) {
        this.camera = camera;
        this.scene = sceneManager.scene;
        this.materials = sceneManager.materials;

        this.gui = new dat.GUI();

        this.time = 0;
        this.keyLightColour = { h: 50, s: 0.25, v: 0.9 };

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

            lightControlsFolder
                .addColor(this, 'keyLightColour')
                .listen()
                .onChange((color) => {
                    const hue = color.h.toFixed();
                    const saturation = (color.s * 100).toFixed();
                    const lightness = (color.v * 100).toFixed();

                    keyLight.color = new Color(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
                    this.updateLight(keyLight, keyLightHelper);
                });

            lightControlsFolder.open();

            // time
            const timeFolder = this.gui.addFolder('Time of day');

            timeFolder.add(this, 'time', 0, 1, 0.01).onChange(() => {
                const sinValue = Math.sin(Math.PI * this.time);

                keyLight.position.x = mapRange(this.time, 0, 1, -1500, 1500);
                keyLight.position.y = mapRange(sinValue, 0, 1, 50, 700);
                keyLight.intensity = mapRange(sinValue, 0, 1, 3, 10);

                this.keyLightColour.h = mapRange(sinValue, 0, 1, 15, 50);
                this.keyLightColour.s = mapRange(sinValue, 0, 1, 0.8, 0.25);
                this.keyLightColour.v = mapRange(sinValue, 0, 1, 0.6, 0.85);

                const hue = this.keyLightColour.h;
                const saturation = (this.keyLightColour.s * 100).toFixed();
                const lightness = (this.keyLightColour.v * 100).toFixed();
                keyLight.color = new Color(`hsl(${hue}, ${saturation}%, ${lightness}%)`);

                this.updateLight(keyLight, keyLightHelper);
            });

            timeFolder.open();

            // output
            const outputFolder = this.gui.addFolder('Sun position');

            outputFolder.add(keyLight.position, 'x').name('azimuth (x)').listen();
            outputFolder.add(keyLight.position, 'y').name('zenith (y)').listen();

            // outputFolder.add(this.keyLightColour, 'h').name('hue').listen();
            // outputFolder.add(this.keyLightColour, 's').name('saturation').listen();
            // outputFolder.add(this.keyLightColour, 'v').name('value').listen();

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
