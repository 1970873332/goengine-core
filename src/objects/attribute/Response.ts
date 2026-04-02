import DuplicatableComponent from "../../components/fussy/Duplicatable";

/**
 * 响应属性
 */
export default class ResponseAttribute<T = any> extends DuplicatableComponent<
    Record<any, any>,
    Func.RecordCallBack<T>
> {
    protected _ancient?: Infer.Unite<T>;

    constructor(
        protected _value: Infer.Unite<T>,
        protected formatter?: (v: T) => T,
    ) {
        super();
    }

    /**
     * 值
     */
    public get value(): Infer.Unite<T> {
        return this._value;
    }
    public set value(v: T) {
        this.silentSetter(v);
        !this.same && this.trigger();
        this.ancient = v;
    }
    /**
     * 旧值
     */
    public get ancient(): Infer.Unite<T> | undefined {
        return this._ancient;
    }
    protected set ancient(v: T) {
        this._ancient = v as Infer.Unite<T>;
    }
    /**
     * 是否相同
     */
    public get same(): boolean {
        return this.ancient === this.value;
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
        this._value = (
            typeof this.formatter === "function" ? this.formatter(v) : v
        ) as Infer.Unite<T>;
        return this;
    }

    protected execute(callback: Func.RecordCallBack<T>): void {
        callback(this.ancient as T, this.value as T);
    }

    public copy(target: this, silend?: boolean): this {
        const value = target.value as T;
        this.formatter = target.formatter;
        return silend ? this.silentSetter(value) : this.setter(value);
    }
}
