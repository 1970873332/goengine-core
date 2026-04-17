import { CanvasUtils } from "@core/util/Canvas";
import Stats from "three/examples/jsm/libs/stats.module";
import TaskComponent, { TaskComponentEvent } from "../Task";
/**
 * 场景组件
 */
export default class SceneComponent<
    E extends IEvent = IEvent,
> extends TaskComponent<E> {
    /**
     * @param element 画布
     */
    constructor(public element: HTMLCanvasElement) {
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
        this.resize.bind(this)
    );
    /**
     * 性能统计
     */
    public stats?: Stats;

    /**
     * 画布宽度
     */
    public get width(): number {
        return this.element.clientWidth;
    }
    /**
     * 画布高度
     */
    public get height(): number {
        return this.element.clientHeight;
    }
    /**
     * 画布宽高比
     */
    public get aspect(): number {
        return this.width / this.height;
    }
    /**
     * 画布宽度的一半
     */
    public get halfWidth(): number {
        return this.width / 2;
    }
    /**
     * 画布高度的一半
     */
    public get halfHeight(): number {
        return this.height / 2;
    }

    /**
     * 重置尺寸
     * @Super
     */
    public resize(): void {
        CanvasUtils.syncCanvasSize(this.element);
    }

    /**
     * @Super
     */
    protected main(): void {
        if (this.needStats) {
            this.stats = new Stats();
            document.body.appendChild(this.stats.dom);
        }
    }
    /**
     * @Super
     */
    protected addEvents(): void {
        this.obsever.observe(this.element);
    }

    protected update(time: DOMHighResTimeStamp): void {
        super.update(time);
        this.stats?.update();
    }

    public destroy(): void {
        super.destroy();
        this.obsever.disconnect();
        this.element.remove();
    }
}

interface IEvent extends TaskComponentEvent { }

export { IEvent as SceneComponentEvent };

