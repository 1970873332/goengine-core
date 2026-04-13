import CallBackComponent from "@core/component/CallBack";
import { PolyUtils } from "@core/util/Poly";

/**
 * 值
 */
export default class Value<T, E extends Record<any, any>> extends CallBackComponent<
    Func.CallBack<T>,
    E
> {
    constructor(
        /**
         * 值
         */
        private source: T,
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
        return this.options?.get(this.source) ?? PolyUtils.func(this.source);
    }

    protected set value(v: T) {
        this.source = this.options?.set(v) ?? v;
    }

    protected execute(callback: (v: T) => void): void {
        callback(this.value);
    }
}
