import { Vector3, PerspectiveCamera } from 'three';

/**
 * Initialize a simple camera and point it at the center of a scene
 *
 * @param {Vector3} [initialPosition]
 */
export function initCamera(initialPosition) {
    var position = initialPosition !== undefined ? initialPosition : new Vector3(0, 22, 50);

    var camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.copy(position);
    camera.lookAt(new Vector3(0, 0, 0));

    return camera;
}
