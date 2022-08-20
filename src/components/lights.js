import {
    EquirectangularReflectionMapping,
    sRGBEncoding,
    Color,
    SpotLight,
    SpotLightHelper,
    CameraHelper,
    Group,
    MathUtils,
} from 'three';

class Lights {
    constructor(scene, textureLoader, gizmo) {
        this.scene = scene;
        this.textureLoader = textureLoader;
        this.gizmo = gizmo;

        this.environmentMap();

        this.createLight(scene, 0, MathUtils.degToRad(0), 10000, true);

        // this.createLight(scene, 1.41, 1.35, 20000);
        // this.createLight(scene, 0.6, 1.15, 30000);
        // this.createLight(scene, -0.43, 1.09, 20000);
        // this.createLight(scene, -1.2, 1.3, 40000); // shadow

        // this.createLight(scene, -2.6, 1.1, 30000);
        // this.createLight(scene, -2.99, 0.87, 40000);
        // this.createLight(scene, 2.1, 0.78, 40000);
    }

    environmentMap() {
        this.textureLoader.load('environments/CT-office-2k-sharper-90.webp', (tx) => {
            tx.mapping = EquirectangularReflectionMapping;
            tx.encoding = sRGBEncoding;
            // linear? also try 4k demo
            this.scene.environment = tx;
        });
    }

    createLight(scene, rotate, height, intensity, castShadow, gizmo) {
        const distance = 500; // far distance of env sphere
        const pivotRotate = new Group();
        pivotRotate.rotateY(rotate);
        scene.add(pivotRotate);

        const pivotHeight = new Group();
        pivotHeight.rotateX(height);
        pivotRotate.add(pivotHeight);

        const arm = new Group();
        arm.position.set(0, distance, 0); // scene origin is 1.5m off ground
        pivotHeight.add(arm);

        const spotLight = new SpotLight();
        spotLight.color = new Color('rgb(255, 245, 200)');
        spotLight.intensity = intensity;
        spotLight.decay = 2;
        spotLight.angle = 0.3;
        // spotLight.distance = 550;

        if (castShadow) {
            spotLight.castShadow = true;
            spotLight.shadow.camera.near = 400;
            spotLight.shadow.camera.far = 600;
            spotLight.shadow.focus = 1.3;
        }

        arm.add(spotLight);

        if (gizmo) {
            pivotRotate.name = 'pivotRotate';
            pivotHeight.name = 'pivotHeight';
            arm.name = 'lightArm';
            spotLight.name = 'spotLight1';

            gizmo.attach(pivotHeight);
            gizmo.setMode('rotate');
            gizmo.setSpace('local');
            scene.add(gizmo);

            this.spotLightHelper = new SpotLightHelper(spotLight);
            scene.add(this.spotLightHelper);

            this.shadowHelper = new CameraHelper(spotLight.shadow.camera);
            scene.add(this.shadowHelper);
        } else {
            // scene.add(new SpotLightHelper(spotLight));
            // scene.add(new CameraHelper(spotLight.shadow.camera));
        }
    }

    update() {
        if (this.spotLightHelper) {
            this.spotLightHelper.update();
        }
        if (this.shadowHelper) {
            this.shadowHelper.update();
        }
    }
}

export { Lights };
