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

        const cameraFolder = this.gui.addFolder('Camera');
        cameraFolder.add(this.camera.position, 'x', -50, 50);
        cameraFolder.add(this.camera.position, 'y', -50, 200);
        cameraFolder.add(this.camera.position, 'z', 20, 100);
        cameraFolder.open();

        const pivotRotate = this.scene.getObjectByName('pivotRotate');
        if (pivotRotate) {
            this.gui
                .add(pivotRotate.rotation, 'y', -MathUtils.degToRad(360), MathUtils.degToRad(360))
                .name('rotate y')
                .step(0.001);

            const pivotHeight = this.scene.getObjectByName('pivotHeight');
            this.gui.add(pivotHeight.rotation, 'x', 0, MathUtils.degToRad(360)).name('height').step(0.001);

            const lightArm = this.scene.getObjectByName('lightArm');
            this.gui.add(lightArm.position, 'y', 150, 500).name('arm distance');

            const spotLight = this.scene.getObjectByName('spotLight1');

            const lightControls = new (function () {
                this.pointColor = spotLight.color.getStyle();
            })();

            this.gui.addColor(lightControls, 'pointColor').onChange(function (e) {
                spotLight.color = new Color(e);
            });
            this.gui.add(spotLight, 'intensity', 1000, 100000).step(1000);
            this.gui.add(spotLight, 'angle', 0, Math.PI * 2).step(0.1);
            this.gui.add(spotLight, 'penumbra', 0, 1).step(0.01);
            this.gui.add(spotLight, 'castShadow', true);
            this.gui
                .add(spotLight.shadow.camera, 'near', 400, 500)
                .onChange(() => spotLight.shadow.camera.updateProjectionMatrix());
            this.gui
                .add(spotLight.shadow.camera, 'far', 500, 1000)
                .onChange(() => spotLight.shadow.camera.updateProjectionMatrix());
            this.gui.add(spotLight.shadow, 'focus', 0, 10);
        }

        const debugFolder = this.gui.addFolder('Debug');
        // debugFolder.add(this, 'outputObjects');
        debugFolder.add(window, 'innerWidth').listen();
        debugFolder.add(window, 'innerHeight').listen();
        debugFolder.add(window, 'devicePixelRatio').listen();
        // debugFolder.open();
    }

    outputObjects() {
        console.log(this.scene);
    }
}

export { SettingsPanel };
