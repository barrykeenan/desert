import { Group, MeshStandardMaterial, sRGBEncoding } from 'three';

class Ground1 {
    constructor(geoLoader, textureLoader) {
        this.geoLoader = geoLoader;
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
            normalMap: this.textureLoader.load('models/ground1/textures/vmoebgzqx_4K_Normal_LOD0.jpg'),
            roughnessMap: this.textureLoader.load('models/ground1/textures/vmoebgzqx_4K_Roughness.jpg'),
            map: this.textureLoader.load('models/ground1/textures/vmoebgzqx_4K_Albedo.jpg'),
            // envMapIntensity: 0.5,
        });
        this.materials.default.map.encoding = sRGBEncoding;
    }

    /**
     * Create or load geometry
     */
    initGeo() {
        this.rootObject = new Group();
        this.rootObject.name = 'ground1';

        this.geoLoader.load('models/ground1/vmoebgzqx_LOD0.fbx', (group) => {
            const mesh = group.children[0];
            mesh.geometry.attributes.uv2 = mesh.geometry.attributes.uv; // second UV set needed for aoMap
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            mesh.material = this.materials.default;

            this.rootObject.add(mesh);
        });
    }

    /**
     * Updated on every frame
     */
    update() {}
}

export { Ground1 };