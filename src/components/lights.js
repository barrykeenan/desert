import {
    EquirectangularReflectionMapping,
    sRGBEncoding,
    Color,
    Group,
    MathUtils,
    DirectionalLight,
    DirectionalLightHelper,
    CameraHelper,
    HemisphereLight,
} from 'three';

class Lights {
    constructor(scene, textureLoader, gizmo) {
        this.scene = scene;
        this.textureLoader = textureLoader;
        this.gizmo = gizmo;

        this.keyLight();
        this.skyLight();
        this.environmentMap();
    }

    environmentMap() {
        this.textureLoader.load('environments/goegap_4k.exr', (texture) => {
            texture.mapping = EquirectangularReflectionMapping;
            texture.encoding = sRGBEncoding;

            this.scene.environment = texture;
            this.scene.background = texture; // skybox
        });
    }

    skyLight() {
        const skyLight = new HemisphereLight();
        skyLight.name = 'skyLight';

        // dawn
        skyLight.color = new Color('hsl(230, 100%, 40%)');
        skyLight.groundColor = new Color('hsl(10, 100%, 20%)');
        skyLight.intensity = 1;

        // day
        // skyLight.color = new Color('hsl(195, 90%, 80%)');
        // skyLight.groundColor = new Color('hsl(27, 50%, 60%)');
        // skyLight.intensity = 0.1;

        this.scene.add(skyLight);
    }

    keyLight() {
        const group = new Group();
        group.name = 'keyLightGroup';

        const keyLight = new DirectionalLight();
        keyLight.name = 'keyLight';

        keyLight.color = new Color('hsl(15, 80%, 50%)');
        keyLight.intensity = 8;

        group.rotation.y = MathUtils.degToRad(-15);
        keyLight.position.set(0, 0, -1000);
        keyLight.target.position.set(0, 0, 0);

        keyLight.castShadow = true;
        keyLight.shadow.camera.left = -500;
        keyLight.shadow.camera.right = 500;
        keyLight.shadow.camera.bottom = -500;
        keyLight.shadow.camera.top = 500;
        keyLight.shadow.camera.near = 500;
        keyLight.shadow.camera.far = 1500;
        keyLight.shadow.mapSize.width = 4096; // 512 default
        keyLight.shadow.mapSize.height = 4096; // 512 default

        group.add(keyLight);
        this.scene.add(keyLight.target);

        const helper = new DirectionalLightHelper(keyLight);
        helper.name = 'keyLight-helper';
        this.scene.add(helper);

        const shadowHelper = new CameraHelper(keyLight.shadow.camera);
        // this.scene.add(shadowHelper);

        this.scene.add(group);
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
