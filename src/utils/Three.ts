import {
    Camera,
    LinearFilter,
    RGBAFormat,
    Texture,
    TextureLoader,
    Vector2,
    Vector3,
} from "three";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

/**
 * Three工具
 */
export abstract class ThreeUtils {
    /**
     * GLTF加载器
     */
    public static readonly gltfLoader: GLTFLoader = new GLTFLoader();
    /**
     * 纹理加载器
     */
    public static readonly textureLoader: TextureLoader = new TextureLoader();

    /**
     * 场景坐标转屏幕坐标
     * @param position
     * @param element
     * @param camera
     * @returns
     */
    public static sceneToScreen(
        position: Vector3,
        element: HTMLCanvasElement,
        camera: Camera,
    ): Vector2 {
        const vector: Vector3 = new Vector3(position.x, position.y, 1).project(
            camera,
        );
        const a: number = element.width / 2;
        const b: number = element.height / 2;
        return new Vector2(vector.x * a + a, -vector.y * b + b);
    }
    /**
     * 屏幕坐标转场景坐标
     * @param position
     * @param element
     * @param camera
     * @returns
     */
    public static screenToScene(
        position: Vector2,
        element: HTMLCanvasElement,
        camera: Camera,
    ): Vector2 {
        const vector: Vector3 = new Vector3(
            (position.x / element.width) * 2 - 1,
            -(position.y / element.height) * 2 + 1,
            1,
        );
        vector.unproject(camera).applyMatrix4(camera.matrixWorldInverse);
        return new Vector2(vector.x, vector.y);
    }

    /**
     * 重新设置纹理属性
     * @param texture
     * @returns
     */
    public static resetTexture(texture: Texture): Texture {
        texture.needsPMREMUpdate = true;
        texture.needsUpdate = true;
        texture.format = RGBAFormat;
        texture.magFilter = LinearFilter;
        texture.minFilter = LinearFilter;
        return texture;
    }
    /**
     * 加载纹理
     * @param url
     * @returns
     */
    public static loadTexture(
        url: string,
        onLoad?: (data: Texture) => void,
        onProgress?: (event: ProgressEvent) => void,
        onError?: (err: unknown) => void,
    ): Texture {
        return this.textureLoader.load(
            url,
            (data) => onLoad?.(data),
            onProgress,
            onError,
        );
    }
    /**
     * 异步加载纹理
     * @param url
     * @returns
     */
    public static async loadAsyncTexture(
        url: string,
        onProgress?: (event: ProgressEvent) => void,
    ): Promise<Texture> {
        return this.textureLoader.loadAsync(url, onProgress);
    }
    /**
     * 加载gltf
     * @param url
     * @param onLoad
     * @param onProgress
     * @param onError
     */
    public static loadGLTF(
        url: string,
        onLoad: (data: GLTF) => void,
        onProgress?: (event: ProgressEvent) => void,
        onError?: (err: unknown) => void,
    ): void {
        this.gltfLoader.load(url, onLoad, onProgress, onError);
    }
    /**
     * 异步加载gltf
     * @param url
     * @param onProgress
     * @returns
     */
    public static async loadAsyncGLTF(
        url: string,
        onProgress?: (event: ProgressEvent) => void,
    ): Promise<GLTF> {
        return this.gltfLoader.loadAsync(url, onProgress);
    }
}
