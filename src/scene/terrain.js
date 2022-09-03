import { PlaneGeometry, Mesh, MeshStandardMaterial, sRGBEncoding, RepeatWrapping } from 'three';

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
        const planeGeometry = new PlaneGeometry(10000, 10000, 2000, 2000);
        // planeGeometry.computeVertexNormals();
        planeGeometry.rotateX(-Math.PI / 2);

        this.rootObject = new Mesh(planeGeometry, this.materials.default);
        this.rootObject.name = 'terrain';
        this.rootObject.castShadow = true;
        this.rootObject.receiveShadow = true;
    }

    /**
     * Updated on every frame
     */
    update() {}
}

export { Terrain };
