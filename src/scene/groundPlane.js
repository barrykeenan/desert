import { PlaneGeometry, Mesh, MeshStandardMaterial, sRGBEncoding, RepeatWrapping } from 'three';

class GroundPlane {
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
            displacementMap: this.loadTiledTexture('surfaces/sandy-ground/vl0macqn_4K_Displacement.jpg', 10),
            displacementScale: 25.0,
            normalMap: this.loadTiledTexture('surfaces/sandy-ground/vl0macqn_4K_Normal.jpg', 10),
            roughnessMap: this.loadTiledTexture('surfaces/sandy-ground/vl0macqn_4K_Roughness.jpg', 10),
            // wireframe: true,
            // color: 0x666666,
            map: this.loadTiledTexture('surfaces/sandy-ground/vl0macqn_4K_Albedo.jpg', 10),
            envMapIntensity: 0.0, // increases to 0.1 at midday
        });
        this.materials.default.map.encoding = sRGBEncoding;
        // texture1.anisotropy = maxAnisotropy;
    }

    loadTiledTexture(path, repeat) {
        return this.textureLoader.load(path, function (texture) {
            texture.wrapS = texture.wrapT = RepeatWrapping;
            texture.offset.set(0, 0);
            texture.repeat.set(repeat, repeat);
        });
    }

    /**
     * Create or load geometry
     */
    initGeo() {
        const planeGeometry = new PlaneGeometry(5000, 5000, 2000, 2000);
        // planeGeometry.computeVertexNormals();
        planeGeometry.rotateX(-Math.PI / 2);

        this.rootObject = new Mesh(planeGeometry, this.materials.default);
        this.rootObject.name = 'groundPlane';
        this.rootObject.castShadow = true;
        this.rootObject.receiveShadow = true;
    }

    /**
     * Updated on every frame
     */
    update() {}
}

export { GroundPlane };
