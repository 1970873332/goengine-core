import TaskComponent, { TaskComponentEvent } from "../Task";
/**
 * 场景组件
 */
export default class SceneComponent<E extends IEvent> extends TaskComponent<E> {
    /**
     * @param canvas 画布
     */
    constructor(public canvas: HTMLCanvasElement) {
        super();
    }

    /**
     * 尺寸监听
     */
    protected readonly obsever: ResizeObserver = new ResizeObserver(
        this.resize.bind(this),
    );
    /**
     * 画布宽度
     */
    public readonly width: number = 0;
    /**
     * 画布高度
     */
    public readonly height: number = 0;
    /**
     * 画布宽高比
     */
    public readonly aspect: number = 0;
    /**
     * 画布宽度的一半
     */
    public readonly halfWidth: number = 0;
    /**
     * 画布高度的一半
     */
    public readonly halfHeight: number = 0;
    /**
     * 画布宽度
     */
    public get clientWidth(): number {
        return this.canvas.clientWidth;
    }
    /**
     * 画布高度
     */
    public get clientHeight(): number {
        return this.canvas.clientHeight;
    }

    /**
     * 重置尺寸
     */
    public resize(): void {
        const { clientWidth: width, clientHeight: height } = this;

        Object.assign(this.canvas, {
            width,
            height,
        });
        Object.assign(this, {
            width,
            height,
            aspect: width / height,
            halfWidth: width / 2,
            halfHeight: height / 2,
        });
    }

    protected addEvents(): void {
        this.obsever.observe(this.canvas);
    }

    public destroy(): void {
        this.canvas.remove();
        this.obsever.disconnect();

        super.destroy();
    }
}

interface IEvent extends TaskComponentEvent {}

export { IEvent as SceneComponentEvent };
