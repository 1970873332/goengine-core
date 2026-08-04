import { StringUtils } from "../util/String";

/**
 * 事件目标
 */
export class EventTarget<E extends {}> extends globalThis.EventTarget {
    /**
     * 唯一标识
     */
    public uuid: string = StringUtils.generateUUID();
    /**
     * 用户数据
     */
    public userData: Partial<Record<Iteration, unknown>> = {};

    /**
     * 添加自定义事件
     * @param type
     * @param callback
     * @param options
     * @returns
     */
    public addCustomEventListener<
        T extends keyof E & string,
        C extends (event: CustomEvent<E[T]>) => void,
    >(
        type: T,
        callback: C,
        options?: boolean | AddEventListenerOptions,
    ): EventState<E> {
        super.addEventListener(type, callback as any, options);

        return new EventState(this, type, callback);
    }
    /**
     * 移除自定义事件
     * @param type
     * @param callback
     * @param options
     */
    public removeCustomEventListener<
        T extends keyof E & string,
        C extends (event: CustomEvent<E[T]>) => void,
    >(type: T, callback: C, options?: boolean | EventListenerOptions): void {
        super.removeEventListener(type, callback as any, options);
    }
    /**
     * 触发自定义事件
     * @param type
     * @param data
     * @returns
     */
    public dispatchCustomEvent<T extends keyof E & string>(
        type: T,
        data: E[T],
    ): boolean {
        return super.dispatchEvent(new CustomEvent(type, { detail: data }));
    }
}

/**
 * 事件状态
 */
export class EventState<T extends {}> {
    constructor(
        protected target: TTarget<T>,
        protected type: keyof T & string,
        protected callback: (event: any) => void,
    ) {}

    /**
     * 休息
     */
    public break(): this {
        if (this.target instanceof EventTarget)
            this.target.removeCustomEventListener(this.type, this.callback);
        else this.target?.removeEventListener(this.type, this.callback);
        return this;
    }
    /**
     * 唤醒
     */
    public wake(): this {
        this.break();
        if (this.target instanceof EventTarget)
            this.target.addCustomEventListener(this.type, this.callback);
        else this.target?.addEventListener(this.type, this.callback);
        return this;
    }
}

type TTarget<T extends {}> = EventTarget<T> | EEventTarget | undefined | null;

type EEventTarget = HTMLElement | Window | WebSocket;
