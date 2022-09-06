import { Vector2, Raycaster, CatmullRomCurve3, TubeGeometry, Mesh, Color, MeshBasicMaterial, MathUtils } from 'three';

import * as dat from 'dat.gui';
import { mapRange } from './utils.js';

class SettingsPanel {
    constructor(renderer, camera, sceneManager, orbitControls, objectPicker) {
        this.gui = new dat.GUI();

        this.renderer = renderer;
        this.camera = camera;
        this.scene = sceneManager.scene;
        this.materials = sceneManager.materials;

        this.time = 0.03;
        this.skyLightColour = { h: 195, s: 0.9, v: 0.8 };
        this.bounceLightColour = { h: 27, s: 0.5, v: 0.6 };
        this.keyLightColour = { h: 50, s: 0.25, v: 0.9 };

        this.initObjects();

        this.cameraFolder();

        // this.layout();

        this.fillControlsFolder = this.gui.addFolder('Fill light controls');

        if (this.fillLight) {
            this.fillControlsFolder
                .addColor(this, 'skyLightColour')
                .listen()
                .onChange((datHSV) => {
                    this.fillLight.color = this.datHSVtoColor(datHSV);
                });

            this.fillControlsFolder
                .addColor(this, 'bounceLightColour')
                .listen()
                .onChange((datHSV) => {
                    this.fillLight.groundColor = this.datHSVtoColor(datHSV);
                });

            this.fillControlsFolder.add(this.fillLight, 'intensity', 0, 10, 0.1).listen().name('sky intensity');

            this.fillControlsFolder
                .add(this.terrainMesh.material, 'envMapIntensity', 0, 1, 0.01)
                .listen()
                .name('BG envMap');

            this.fillControlsFolder
                .add(this.midGroundMesh.material, 'envMapIntensity', 0, 1, 0.01)
                .listen()
                .name('MG envMap');

            this.fillControlsFolder.open();
        }

        this.keyLightGroup = this.scene.getObjectByName('keyLightGroup');
        this.keyLight = this.scene.getObjectByName('keyLight');
        this.keyLightHelper = this.scene.getObjectByName('keyLight-helper');

        if (this.keyLight) {
            const lightControlsFolder = this.gui.addFolder('Key light controls');

            var lightRotation = {
                x: 0,
                y: MathUtils.radToDeg(this.keyLightGroup.rotation.y),
                z: 0,
            };
            lightControlsFolder
                .add(lightRotation, 'y', -360, 0)
                .name('azimuth (x)')
                .onChange((deg) => {
                    this.keyLightGroup.rotation.y = MathUtils.degToRad(deg);
                    this.updateLight(this.keyLight, this.keyLightHelper);
                });
            lightControlsFolder
                .add(this.keyLight.position, 'y', 0, 1500)
                .name('elevation (y)')
                .listen()
                .onChange(() => {
                    this.updateLight(this.keyLight, this.keyLightHelper);
                });
            // lightControlsFolder
            //     .add(this.keyLight.position, 'z', -3000, 3000)
            //     .name('z')
            //     .listen()
            //     .onChange(() => {
            //         this.updateLight(this.keyLight, this.keyLightHelper);
            //     });

            lightControlsFolder.add(this.keyLight, 'intensity', 0, 20, 0.1).listen();

            lightControlsFolder
                .addColor(this, 'keyLightColour')
                .listen()
                .onChange((datHSV) => {
                    this.keyLight.color = this.datHSVtoColor(datHSV);

                    this.updateLight(this.keyLight, this.keyLightHelper);
                });

            lightControlsFolder.open();
        }

        this.timeSlider();

        // debug
        const debugFolder = this.gui.addFolder('Debug');
        debugFolder.add(this, 'outputObjects');
        // debugFolder.add(window, 'innerWidth').listen();
        // debugFolder.add(window, 'innerHeight').listen();
        // debugFolder.add(window, 'devicePixelRatio').listen();
        // outputFolder.add(this.keyLightColour, 'h').name('hue').listen();
        // outputFolder.add(this.keyLightColour, 's').name('saturation').listen();
        // outputFolder.add(this.keyLightColour, 'v').name('value').listen();
        debugFolder.open();
    }

    initObjects() {
        this.terrain = this.scene.getObjectByName('terrain');
        this.terrainMesh = this.terrain?.children[0];

        this.midGround = this.scene.getObjectByName('midGround');
        this.midGroundMesh = this.midGround?.children[0];

        this.foreGround = this.scene.getObjectByName('ground1');

        this.fillLight = this.scene.getObjectByName('skyLight');
    }

    cameraFolder() {
        const cameraFolder = this.gui.addFolder('Camera');

        // cameraFolder.add(this.camera.position, 'x', -500, 500);
        // cameraFolder.add(this.camera.position, 'y', 0, 200);
        // cameraFolder.add(this.camera.position, 'z', 0, 500);
        cameraFolder.add(this.renderer, 'toneMappingExposure', 0, 1, 0.01).listen().name('exposure');

        cameraFolder.open();
    }

    layout() {
        this.layoutFolder = this.gui.addFolder('Layout folder');
        this.layoutFolder.open();

        if (this.terrain) {
            const terrainMaterial = this.terrainMesh.material;

            // this.layoutFolder.add(terrain.position, 'y', -500, 100).name('bg terrain y');
            // this.layoutFolder.add(terrain.position, 'x', -5000, 5000).name('bg terrain x');
            // this.layoutFolder.add(terrain.position, 'z', -5000, 5000).name('bg terrain z');

            var terrainRotation = {
                x: 0,
                y: MathUtils.radToDeg(this.terrainMesh.rotation.y),
                z: 0,
            };
            this.layoutFolder
                .add(terrainRotation, 'y', 0, 360)
                .name('BG rotation y')
                .onChange((deg) => {
                    this.terrainMesh.rotation.y = MathUtils.degToRad(deg);
                });

            this.layoutFolder.add(terrainMaterial, 'roughness', 0, 1, 0.01).name('BG roughness');
        }

        if (this.midGround) {
            this.layoutFolder.add(this.midGround.position, 'y', -20, 5, 0.1).name('MG y');
            this.layoutFolder.add(this.midGroundMesh.material, 'roughness', 0.5, 1.5, 0.01).name('MG roughness');
        }

        if (this.foreGround) {
            // const foreGroundMesh = this.foreGround.children[0];

            var foreGroundRotation = {
                x: 0,
                y: MathUtils.radToDeg(this.foreGround.rotation.y),
                z: 0,
            };
            this.layoutFolder
                .add(foreGroundRotation, 'y', 0, 360)
                .name('FG rotation y')
                .onChange((deg) => {
                    this.foreGround.rotation.y = MathUtils.degToRad(deg);
                });
        }
    }

    onLoad() {
        const foreGround = this.scene.getObjectByName('ground1');
        if (foreGround) {
            const foreGroundMesh = foreGround.children[0];
            const foreGroundMaterial = foreGroundMesh.material;

            // this.layoutFolder.add(foreGroundMaterial, 'roughness', 0, 1, 0.01).name('FG roughness');
            this.fillControlsFolder.add(foreGroundMaterial, 'envMapIntensity', 0, 1, 0.01).listen().name('FG envMap');
        }

        this.updateTime();
    }

    timeSlider() {
        const timeFolder = this.gui.addFolder('Time of day');

        timeFolder.add(this, 'time', 0, 1, 0.001).onChange(() => {
            this.updateTime();
        });

        timeFolder.open();
    }

    updateTime() {
        const sinValue = Math.sin(Math.PI * this.time);

        this.renderer.toneMappingExposure = sinValue;

        if (this.keyLight) {
            this.keyLightGroup.rotation.y = mapRange(this.time, 0, 1, MathUtils.degToRad(-15), MathUtils.degToRad(-90));

            this.keyLight.position.y = mapRange(sinValue, 0, 1, 0, 500);
            this.updateLight(this.keyLight, this.keyLightHelper);

            this.keyLight.intensity = mapRange(sinValue, 0, 1, 8, 2);

            this.keyLightColour.h = mapRange(sinValue, 0, 1, 10, 30);
            this.keyLightColour.s = mapRange(sinValue, 0, 1, 0.9, 0.7);
            this.keyLightColour.v = mapRange(sinValue, 0, 1, 0.3, 0.8);

            this.keyLight.color = this.datHSVtoColor(this.keyLightColour);
        }

        if (this.fillLight) {
            this.fillLight.intensity = mapRange(sinValue, 0, 1, 1, 0.1);

            this.skyLightColour.h = mapRange(sinValue, 0, 1, 230, 195);
            this.skyLightColour.s = mapRange(sinValue, 0, 1, 1.0, 1.0);
            this.skyLightColour.v = mapRange(sinValue, 0, 1, 0.4, 1.0);

            this.fillLight.color = this.datHSVtoColor(this.skyLightColour);

            this.bounceLightColour.h = mapRange(sinValue, 0, 1, 27, 40);
            this.bounceLightColour.s = mapRange(sinValue, 0, 1, 0.3, 0.5);
            this.bounceLightColour.v = mapRange(sinValue, 0, 1, 0.2, 0.6);

            this.fillLight.groundColor = this.datHSVtoColor(this.bounceLightColour);
        }

        const terrain = this.scene.getObjectByName('terrain');
        if (terrain) {
            const terrainMesh = terrain.children[0];
            const terrainMaterial = terrainMesh.material;
            terrainMaterial.envMapIntensity = mapRange(sinValue, 0, 1, 0.0, 0.1);
        }

        const midGround = this.scene.getObjectByName('midGround');
        if (midGround) {
            const midGroundMesh = midGround.children[0];
            const midGroundMaterial = midGroundMesh.material;
            midGroundMaterial.envMapIntensity = mapRange(sinValue, 0, 1, 0.0, 0.15);
        }

        const foreGround = this.scene.getObjectByName('ground1');
        if (foreGround) {
            const foreGroundMesh = foreGround.children[0];
            const foreGroundMaterial = foreGroundMesh.material;
            foreGroundMaterial.envMapIntensity = mapRange(sinValue, 0, 1, 0.0, 0.4);
        }
    }

    updateLight(keyLight, keyLightHelper) {
        keyLight.target.updateMatrixWorld();
        keyLightHelper?.update();
    }

    datHSVtoColor(datHSV) {
        const hue = datHSV.h.toFixed();
        const saturation = (datHSV.s * 100).toFixed();
        const lightness = (datHSV.v * 100).toFixed();

        return new Color(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
    }

    outputObjects() {
        console.log(this.scene);
    }
}

export { SettingsPanel };
