import { EventTarget } from "../supplement/Event";

/**
 * 任务组件
 */
export default abstract class TaskComponent<
    E extends IEvent,
> extends EventTarget<E> {
    /**
     * 动画帧id
     */
    protected animationID: number = requestAnimationFrame(
        this.implement.bind(this),
    );
    /**
     * nextTick
     */
    protected nextTick? = this.nextTickFunc();

    /**
     * 执行队列
     */
    protected *nextTickFunc(): IterableIterator<void | Promise<void>> {
        yield this.main();
        yield this.init();
        yield this.addEvents();
        yield new Promise((resolve) => {
            setTimeout(async () => {
                await this.applyScript();
                this.ready();
                resolve(void 0);
            }, 0);
        });
    }
    /**
     * 实施
     * @returns
     */
    protected implement(): number {
        if (this.nextTick?.next().done) {
            delete this.nextTick;
            cancelAnimationFrame(this.animationID);
            return requestAnimationFrame(this.update.bind(this));
        }
        return this.implement();
    }

    /**
     * 入口函数
     */
    protected main(): void {}
    /**
     * 初始化
     */
    protected init(): void {}
    /**
     * 事件处理
     */
    protected addEvents(): void {}
    /**
     * 后续脚本
     */
    protected async applyScript(): Promise<void> {}
    /**
     * 准备就绪
     */
    protected ready(): void {}
    /**
     * 更新
     * @param delta
     */
    protected update(time: DOMHighResTimeStamp): void {
        this.animationID = requestAnimationFrame(this.update.bind(this));
    }
    /**
     * 销毁
     */
    public destroy(): void {
        this.animationID && cancelAnimationFrame(this.animationID);
    }
}

interface IEvent {}

type IAny = TaskComponent<any>;

export { IAny as TaskComponentAny, IEvent as TaskComponentEvent };
