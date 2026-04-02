import {
    Camera,
    Clock,
    OrthographicCamera,
    PerspectiveCamera,
    Scene,
    WebGLRenderer,
} from "three";
import SceneComponent, {
    SceneComponentEvent,
} from "../../components/draw/Scene";
/**
 * 基础three场景
 */
export default abstract class BaseThreeMap<
    E extends IEvent = IEvent,
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
        canvas: this.element,
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
            this.element.width,
            this.element.height,
            false,
        );
        this.webglRenderer.setPixelRatio(devicePixelRatio ?? 1);
        if (this.camera instanceof OrthographicCamera) {
            this.camera.left = this.element.width / -2;
            this.camera.right = this.element.width / 2;
            this.camera.top = this.element.height / 2;
            this.camera.bottom = this.element.height / -2;
            this.camera.updateProjectionMatrix();
        } else if (this.camera instanceof PerspectiveCamera) {
            this.camera.aspect = this.aspect;
            this.camera.updateProjectionMatrix();
        }
    }
    public destroy(): void {
        super.destroy();
        this.webglRenderer.dispose();
        this.scene.clear();
    }

    /**
     * 渲染
     * @Super
     */
    protected render(): void {
        this.webglRenderer.render(this.scene, this.camera);
    }
}

interface IEvent extends SceneComponentEvent {}

export { IEvent as BaseThreeMapEvent };
