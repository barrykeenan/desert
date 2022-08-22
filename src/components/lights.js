import {
    EquirectangularReflectionMapping,
    sRGBEncoding,
    Color,
    DirectionalLight,
    DirectionalLightHelper,
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
        this.keyLight();
    }

    environmentMap() {
        this.textureLoader.load('environments/goegap_4k.exr', (tx) => {
            tx.mapping = EquirectangularReflectionMapping;
            tx.encoding = sRGBEncoding;
            // linear? also try 4k demo
            this.scene.environment = tx;
            this.scene.background = tx; // skybox
        });
    }

    keyLight() {
        const keyLight = new DirectionalLight();
        keyLight.name = 'keyLight';

        keyLight.color = new Color('rgb(255, 245, 200)');
        keyLight.intensity = 9;

        keyLight.position.set(-500, 250, -1000);
        keyLight.target.position.set(0, 0, 0);

        keyLight.castShadow = true;
        keyLight.shadow.camera.left = -400;
        keyLight.shadow.camera.right = 400;
        keyLight.shadow.camera.bottom = -400;
        keyLight.shadow.camera.top = 400;
        keyLight.shadow.camera.near = 800;
        keyLight.shadow.camera.far = 2000;
        keyLight.shadow.mapSize.width = 2048; // 512 default
        keyLight.shadow.mapSize.height = 2048; // 512 default

        this.scene.add(keyLight);
        this.scene.add(keyLight.target);

        const helper = new DirectionalLightHelper(keyLight);
        helper.name = 'keyLight-helper';
        this.scene.add(helper);

        const shadowHelper = new CameraHelper(keyLight.shadow.camera);
        this.scene.add(shadowHelper);
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
