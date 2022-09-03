import { Vector2, Raycaster, CatmullRomCurve3, TubeGeometry, Mesh, Color, MeshBasicMaterial, MathUtils } from 'three';

import * as dat from 'dat.gui';

class SettingsPanel {
    constructor(camera, sceneManager, orbitControls, objectPicker) {
        this.camera = camera;
        this.scene = sceneManager.scene;
        this.materials = sceneManager.materials;

        this.gui = new dat.GUI();

        this.time = 0;
        this.skyLightColour = { h: 195, s: 0.9, v: 0.8 };
        this.bounceLightColour = { h: 27, s: 0.5, v: 0.6 };
        this.keyLightColour = { h: 50, s: 0.25, v: 0.9 };

        const mapRange = (value, x1, y1, x2, y2) => ((value - x1) * (y2 - x2)) / (y1 - x1) + x2;

        const cameraFolder = this.gui.addFolder('Camera');
        cameraFolder.add(this.camera.position, 'x', -500, 500);
        cameraFolder.add(this.camera.position, 'y', 0, 200);
        cameraFolder.add(this.camera.position, 'z', 0, 1000);
        cameraFolder.open();

        // const groundFolder = this.gui.addFolder('Ground folder');
        // const terrain = this.scene.getObjectByName('terrain');
        // if (terrain) {
        //     groundFolder.add(terrain.position, 'y', -200, 100).name('bg terrain y');
        //     groundFolder.add(terrain.position, 'x', -5000, 5000).name('bg terrain x');
        //     groundFolder.add(terrain.position, 'z', -5000, 5000).name('bg terrain z');
        // }
        // const groundPlane = this.scene.getObjectByName('midGround');
        // if (groundPlane) {
        //     groundFolder.add(groundPlane.position, 'y', -20, 5, 0.1).name('mid ground y');
        // }
        // groundFolder.open();

        const fillLight = this.scene.getObjectByName('skyLight');
        if (fillLight) {
            const fillControlsFolder = this.gui.addFolder('Fill light controls');

            fillControlsFolder.add(fillLight, 'intensity', 0, 1, 0.1).listen();

            fillControlsFolder
                .addColor(this, 'skyLightColour')
                .listen()
                .onChange((datHSV) => {
                    fillLight.color = this.datHSVtoColor(datHSV);
                });

            fillControlsFolder
                .addColor(this, 'bounceLightColour')
                .listen()
                .onChange((datHSV) => {
                    fillLight.groundColor = this.datHSVtoColor(datHSV);
                });

            // fillControlsFolder.open();
        }

        const keyLight = this.scene.getObjectByName('keyLight');
        const keyLightHelper = this.scene.getObjectByName('keyLight-helper');
        if (keyLight) {
            const lightControlsFolder = this.gui.addFolder('Key light controls');

            lightControlsFolder
                .add(keyLight.position, 'x', -1500, 1500)
                .name('azimuth (x)')
                .listen()
                .onChange(() => {
                    this.updateLight(keyLight, keyLightHelper);
                });
            lightControlsFolder
                .add(keyLight.position, 'y', 0, 700)
                .name('elevation (y)')
                .listen()
                .onChange(() => {
                    this.updateLight(keyLight, keyLightHelper);
                });

            lightControlsFolder.add(keyLight, 'intensity', 0, 10, 0.1).listen();

            lightControlsFolder
                .addColor(this, 'keyLightColour')
                .listen()
                .onChange((datHSV) => {
                    keyLight.color = this.datHSVtoColor(datHSV);

                    this.updateLight(keyLight, keyLightHelper);
                });

            // lightControlsFolder.open();
        }

        // TODO: wait for loaded
        // const ground = this.scene.getObjectByName('ground1');
        // if (ground) {
        //     const envControlsFolder = this.gui.addFolder('Env light controls');

        //     const groundMaterial = ground.children[0].material;
        //     envControlsFolder.add(groundMaterial, 'envMapIntensity', 0, 1, 0.1);

        //     envControlsFolder.open();
        // }

        // time
        const timeFolder = this.gui.addFolder('Time of day');

        timeFolder.add(this, 'time', 0, 1, 0.01).onChange(() => {
            const sinValue = Math.sin(Math.PI * this.time);

            if (keyLight) {
                keyLight.position.x = mapRange(this.time, 0, 1, -1500, 1500);
                keyLight.position.y = mapRange(sinValue, 0, 1, 50, 700);
                this.updateLight(keyLight, keyLightHelper);

                keyLight.intensity = mapRange(sinValue, 0, 1, 1, 9);

                this.keyLightColour.h = mapRange(sinValue, 0, 1, 15, 45);
                this.keyLightColour.s = mapRange(sinValue, 0, 1, 0.8, 0.3);
                this.keyLightColour.v = mapRange(sinValue, 0, 1, 0.5, 0.8);

                keyLight.color = this.datHSVtoColor(this.keyLightColour);
            }

            if (fillLight) {
                fillLight.intensity = mapRange(sinValue, 0, 1, 0.3, 0.1);

                this.skyLightColour.h = mapRange(sinValue, 0, 1, 230, 195);
                this.skyLightColour.s = mapRange(sinValue, 0, 1, 0.6, 0.3);
                this.skyLightColour.v = mapRange(sinValue, 0, 1, 0.5, 0.7);

                fillLight.color = this.datHSVtoColor(this.skyLightColour);

                // this.bounceLightColour.h = mapRange(sinValue, 0, 1, 240, 195);
                this.bounceLightColour.s = mapRange(sinValue, 0, 1, 0.3, 0.5);
                this.bounceLightColour.v = mapRange(sinValue, 0, 1, 0.2, 0.6);

                fillLight.groundColor = this.datHSVtoColor(this.bounceLightColour);
            }

            const terrain = this.scene.getObjectByName('terrain');
            if (terrain) {
                const terrainMaterial = terrain.material;
                terrainMaterial.envMapIntensity = mapRange(sinValue, 0, 1, 0.0, 0.1);
            }

            const midGround = this.scene.getObjectByName('midGround');
            if (midGround) {
                const midGroundMaterial = midGround.material;
                midGroundMaterial.envMapIntensity = mapRange(sinValue, 0, 1, 0, 0.1);
            }

            const ground = this.scene.getObjectByName('ground1');
            if (ground) {
                const groundMaterial = ground.children[0].material;
                groundMaterial.envMapIntensity = mapRange(sinValue, 0, 1, 0, 0.1);
            }
        });

        timeFolder.open();

        // debug
        // const debugFolder = this.gui.addFolder('Debug');
        // debugFolder.add(this, 'outputObjects');
        // debugFolder.add(window, 'innerWidth').listen();
        // debugFolder.add(window, 'innerHeight').listen();
        // debugFolder.add(window, 'devicePixelRatio').listen();
        // outputFolder.add(this.keyLightColour, 'h').name('hue').listen();
        // outputFolder.add(this.keyLightColour, 's').name('saturation').listen();
        // outputFolder.add(this.keyLightColour, 'v').name('value').listen();
        // debugFolder.open();
    }

    datHSVtoColor(datHSV) {
        const hue = datHSV.h.toFixed();
        const saturation = (datHSV.s * 100).toFixed();
        const lightness = (datHSV.v * 100).toFixed();

        return new Color(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
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
