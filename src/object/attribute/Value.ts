import CallBackComponent from "@core/component/CallBack";

/**
 * 值
 */
export default class Value<T, E extends Record<any, any>> extends CallBackComponent<
    Func.CallBack<Value<T, E>>,
    E
> {
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
            get: (v: T) => T,
            /**
             * 设置值
             * @param v 
             * @returns 
             */
            set: (v: T) => T
        }) {
        super();
    }

    public get value(): T {
        return this.options?.get ? this.options.get(this.value_source) : this.value_source;
    }

    protected set value(v: T) {
        if (this.options?.set) {
            v = this.options.set(v);
        }
        this.value_source = v;
    }

    protected execute(callback: Func.CallBack<Value<T, E>>): void {
        callback(this);
    }
}
