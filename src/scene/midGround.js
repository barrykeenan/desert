import { PlaneGeometry, Mesh, MeshStandardMaterial, sRGBEncoding, RepeatWrapping, Group } from 'three';

class MidGround {
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
            displacementScale: 20.0,

            normalMap: this.loadTiledTexture('surfaces/sandy-ground/vl0macqn_4K_Normal.jpg', 10),
            roughnessMap: this.loadTiledTexture('surfaces/sandy-ground/vl0macqn_4K_Roughness.jpg', 10),
            roughness: 1.05,
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
        this.rootObject = new Group();
        this.rootObject.name = 'midGround';

        const planeGeometry = new PlaneGeometry(3000, 3000, 2000, 2000);
        planeGeometry.rotateX(-Math.PI / 2);

        const mesh = new Mesh(planeGeometry, this.materials.default);
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        this.rootObject.add(mesh);

        this.rootObject.position.y = -8.5;
    }

    /**
     * Updated on every frame
     */
    update() {}
}

export { MidGround };
