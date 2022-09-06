import { PlaneGeometry, Mesh, MeshStandardMaterial, sRGBEncoding, MathUtils, Group } from 'three';

class Terrain {
    constructor(textureLoader) {
        this.textureLoader = textureLoader;

        this.materials = {};
        this.rootObject = null;

        this.initMaterials();
        this.initGeo();
    }

    /**
     * Create materials and load textures
     */
    initMaterials() {
        this.materials.default = new MeshStandardMaterial({
            displacementMap: this.textureLoader.load('surfaces/gigantic-terrain/vd5sdas_4K_Displacement.jpg'),
            displacementScale: 200.0,

            normalMap: this.textureLoader.load('surfaces/gigantic-terrain/vd5sdas_4K_Normal.jpg'),
            roughnessMap: this.textureLoader.load('surfaces/gigantic-terrain/vd5sdas_4K_Roughness.jpg'),
            // wireframe: true,
            // color: 0x666666,
            map: this.textureLoader.load('surfaces/sandy-ground/vl0macqn_4K_Albedo.jpg'),
            envMapIntensity: 0, // increases to 0.1 at midday
        });
        this.materials.default.map.encoding = sRGBEncoding;
        // texture1.anisotropy = maxAnisotropy;
    }

    /**
     * Create or load geometry
     */
    initGeo() {
        this.rootObject = new Group();
        this.rootObject.name = 'terrain';

        const planeGeometry = new PlaneGeometry(10000, 10000, 1000, 1000);
        planeGeometry.rotateX(-Math.PI / 2);

        const mesh = new Mesh(planeGeometry, this.materials.default);
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        mesh.rotation.y = MathUtils.degToRad(204);

        this.rootObject.add(mesh);

        this.rootObject.position.y = -110;
        this.rootObject.position.x = 1660;
        this.rootObject.position.z = 340;
    }

    /**
     * Updated on every frame
     */
    update() {}
}

export { Terrain };
