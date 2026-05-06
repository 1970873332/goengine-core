import CallBackComponent from "@core/component/CallBack";

/**
 * 值
 */
export default class Value<T> extends CallBackComponent<
    Func.RecordCallBack<T>,
    {}
> {
    /**
     * 旧值
     */
    protected ancient_source?: T;

    constructor(
        /**
         * 值
         */
        private value_source: T,
        /**
         * 选项
         */
        private options?: {
            /**
             * 获取值
             * @param v 
             * @returns 
             */
            get?: (v: T) => T,
            /**
             * 设置值
             * @param v 
             * @returns 
             */
            set?: (nv: T, ov: T) => T
        }) {
        super();
    }

    /**
     * 值
     */
    public get value(): T {
        return this.options?.get ? this.options.get(this.value_source) : this.value_source;
    }
    public set value(v: T) {
        const
            ov = this.value_source,
            nv = this.options?.set ? this.options.set(v, ov) : v;
        if (nv === ov) return;
        this.setter(nv);
        this.trigger();
    }
    /**
     * 旧值
     */
    public get ancient(): T | undefined {
        return this.ancient_source;
    }
    /**
     * 相同
     */
    public get same(): boolean {
        return this.ancient_source === this.value_source;
    }

    /**
     * 设置值
     * @param v 
     */
    public setter(v: T): void {
        this.ancient_source = this.value_source;
        this.value_source = v;
    }

    protected execute(callback: Func.RecordCallBack<T>): void {
        callback(this.value_source, this.ancient_source);
    }
}
