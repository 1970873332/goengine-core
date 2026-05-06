import { EventTarget } from "../supplement/Event";

/**
 * 回调组件
 */
export default class CallBackComponent<
    T extends Function,
    E extends {},
> extends EventTarget<E> {
    /**
     * 回调
     */
    protected callBacks: Set<T> = new Set();

    /**
     * 绑定回调
     * @param callback 
     * @param execute 
     * @returns 
     */
    public bindCallback(callback: T, execute?: boolean): this {
        this.callBacks.add(callback);
        execute && this.execute(callback);
        return this;
    }
    /**
     * 解绑回调
     * @param callback 
     * @returns 
     */
    public unbindCallback(callback: T): this {
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
     * 重新绑定回调
     * @param callback 
     * @param execute 
     * @returns 
     */
    public reBindCallback(clear: boolean, callback: T, execute?: boolean): this {
        clear ? this.clearCallback() : this.unbindCallback(callback);
        this.bindCallback(callback, execute);
        return this;

    }
    /**
     * 触发
     * @returns 
     */
    public trigger(): this {
        this.callBacks.forEach((callback) => this.execute(callback));
        return this;
    }
    /**
     * 执行
     * @param callback
     */
    protected execute(callback: T): void {
        callback();
    }
}
