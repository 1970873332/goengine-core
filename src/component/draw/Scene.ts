import Stats from "three/examples/jsm/libs/stats.module";
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
     * 需要性能统计
     */
    protected readonly needStats: boolean = true;
    /**
     * 尺寸监听
     */
    protected readonly obsever: ResizeObserver = new ResizeObserver(
        this.resize.bind(this),
    );
    /**
     * 性能统计
     */
    public stats?: Stats;
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

    protected main(): void {
        if (this.needStats) {
            this.stats = new Stats();
            document.body.appendChild(this.stats.dom);
        }
    }

    protected addEvents(): void {
        this.obsever.observe(this.canvas);
    }

    protected update(time: DOMHighResTimeStamp): void {
        super.update(time);

        this.stats?.update();
    }

    public destroy(): void {
        if (this.stats) {
            this.stats.end();
            this.stats.dom.remove();
        }
        this.canvas.remove();
        this.obsever.disconnect();

        super.destroy();
    }
}

interface IEvent extends TaskComponentEvent {}

export { IEvent as SceneComponentEvent };
