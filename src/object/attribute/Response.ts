import CallBackComponent from "@core/component/CallBack";

/**
 * 响应属性
 */
export default class ResponseAttribute<T, E extends Record<any, any>> extends CallBackComponent<
    Func.RecordCallBack<T>,
    E
> {
    /**
     * 旧值
     */
    protected ancient_source?: T;

    constructor(
        /**
         * 值
         */
        protected value_source: T,
        /**
         * 格式化
         */
        protected formatter?: Func.CallBack<T, T>,
    ) {
        super();
    }

    /**
     * 是否相同
     */
    public get same(): boolean {
        return this.ancient === this.value;
    }
    /**
     * 值
     */
    public get value(): T {
        return this.value_source;
    }
    public set value(v: T) {
        this.silentSetter(v);
        !this.same && this.trigger() && this.sync();
    }
    /**
     * 旧值
     */
    public get ancient(): T | undefined {
        return this.ancient_source;
    }
    protected set ancient(v: T) {
        this.ancient_source = v;
    }

    /**
     * 设置
     * @param v
     */
    public setter(v: T): this {
        this.value = v;
        return this;
    }
    /**
     * 静默设置
     * @param v
     */
    public silentSetter(v: T): this {
        this.value_source = (
            typeof this.formatter === "function" ? this.formatter(v) : v
        );
        return this;
    }
    /**
     * 同步
     */
    public sync(): this {
        this.ancient = this.value;
        return this;
    }

    protected execute(callback: Func.RecordCallBack<T>): void {
        callback(this.ancient, this.value);
    }
}
