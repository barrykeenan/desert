import { WebGLRenderer, PCFSoftShadowMap, ACESFilmicToneMapping, sRGBEncoding } from 'three';

/**
 * Initialize a simple default renderer and binds it to the body dom element.
 *
 * @param additionalProperties Additional properties to pass into the renderer
 */
export function initRenderer(additionalProperties) {
    const renderer = new WebGLRenderer({
        powerPreference: "high-performance",
        alpha: true,
        // antialias: true, // perf hit mobile
    });
    // renderer.setPixelRatio(window.devicePixelRatio); // perf hit

    renderer.setSize(window.innerWidth, window.innerHeight);

    renderer.shadowMap.enabled = true;
    renderer.shadowMapSoft = true;
    renderer.shadowMap.type = PCFSoftShadowMap;
    renderer.physicallyCorrectLights = true;

    renderer.toneMapping = ACESFilmicToneMapping;
    renderer.gammaFactor = 2.2;
    renderer.outputEncoding = sRGBEncoding;

    // TODO if dom element param, otherwise document.body.appendChild(renderer.domElement)
    document.getElementById('webgl-output').appendChild(renderer.domElement);

    return renderer;
}
