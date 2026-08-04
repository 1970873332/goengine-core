import SceneComponent, {
    SceneComponentEvent,
} from "@goengine/core/src/component/draw/Scene";
import {
    Camera,
    Clock,
    OrthographicCamera,
    PerspectiveCamera,
    Scene,
    WebGLRenderer,
} from "three";
/**
 * 基础three场景
 */
export default abstract class BaseThreeMap<
    E extends IEvent,
> extends SceneComponent<E> {
    /**
     * 相机
     */
    declare public readonly camera: Camera;

    /**
     * 渲染器
     */
    public readonly webglRenderer: WebGLRenderer = new WebGLRenderer({
        antialias: true,
        alpha: true,
        canvas: this.canvas,
    });
    /**
     * 场景
     */
    public readonly scene: Scene = new Scene();
    /**
     * 时钟锁
     */
    protected readonly clock: Clock = new Clock();

    protected update(time: number): void {
        super.update(time);

        this.render();
    }
    public resize(): void {
        super.resize();

        this.webglRenderer.setSize(
            this.canvas.width,
            this.canvas.height,
            false,
        );
        this.webglRenderer.setPixelRatio(devicePixelRatio ?? 1);
        if (this.camera instanceof OrthographicCamera) {
            this.camera.left = this.canvas.width / -2;
            this.camera.right = this.canvas.width / 2;
            this.camera.top = this.canvas.height / 2;
            this.camera.bottom = this.canvas.height / -2;
            this.camera.updateProjectionMatrix();
        } else if (this.camera instanceof PerspectiveCamera) {
            this.camera.aspect = this.aspect;
            this.camera.updateProjectionMatrix();
        }
    }
    public destroy(): void {
        this.scene.clear();
        this.webglRenderer.dispose();

        super.destroy();
    }

    /**
     * 渲染
     */
    protected render(): void {
        this.webglRenderer.render(this.scene, this.camera);
    }
}

interface IEvent extends SceneComponentEvent {}

export { IEvent as BaseThreeMapEvent };
