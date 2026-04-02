import { EventTarget } from "../supplements/Event";

/**
 * 回调组件
 */
export default class CallBackComponent<
    E extends Record<any, any>,
    B extends Function,
> extends EventTarget<E> {
    /**
     * 回调
     */
    protected callBacks: Set<B> = new Set();

    /**
     * 绑定回调
     * @param callback
     */
    public bindCallback(callback: B, execute: boolean = false): this {
        this.callBacks.add(callback);
        execute && this.execute(callback);
        return this;
    }
    /**
     * 解绑回调
     * @param callback
     */
    public unbindCallback(callback: B): this {
        this.callBacks.delete(callback);
        return this;
    }
    /**
     * 清空
     */
    public clearCallback(): void {
        this.callBacks.clear();
    }
    /**
     * 重新绑定
     * @param callback
     * @returns
     */
    public reBindCallback(callback: B): this {
        this.clearCallback();
        this.bindCallback(callback);
        return this;
    }
    /**
     * 触发
     */
    public trigger(): this {
        this.callBacks.forEach((callback) => this.execute(callback));
        return this;
    }
    /**
     * 执行
     * @param callback
     */
    protected execute(callback: B): void {
        callback();
    }
}
