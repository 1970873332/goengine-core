import CallBackComponent from "@goengine/core/src/component/CallBack";

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
    protected _ancient?: T;

    constructor(
        /**
         * 值
         */
        protected _value: T,
        /**
         * 选项
         */
        protected options?: {
            /**
             * 获取值
             * @param v
             * @returns
             */
            get?: (v: T) => T;
            /**
             * 设置值
             * @param v
             * @returns
             */
            set?: (nv: T, ov: T) => T;
        },
    ) {
        super();
    }

    /**
     * 值
     */
    public get value(): T {
        return this.options?.get ? this.options.get(this._value) : this._value;
    }
    public set value(v: T) {
        const ov = this._value,
            nv = this.options?.set ? this.options.set(v, ov) : v;
        if (nv === ov) return;
        this.setter(nv);
        this.trigger();
    }
    /**
     * 旧值
     */
    public get ancient(): T | undefined {
        return this._ancient;
    }
    /**
     * 相同
     */
    public get same(): boolean {
        return this._ancient === this._value;
    }

    /**
     * 设置值
     * @param v
     */
    public setter(v: T): void {
        this._ancient = this._value;
        this._value = v;
    }
    /**
     * 设置值
     * @param v
     */
    public set(v: T): void {
        this.value = v;
    }
    /**
     * 直接设置值
     * @param v
     */
    public liveset(v: T): void {
        this.setter(v);
        this.trigger();
    }

    protected execute(callback: Func.RecordCallBack<T>): void {
        callback(this._value, this._ancient);
    }
}
