import DuplicatableComponent from "@core/component/fussy/Duplicatable";

/**
 * 数组属性
 */
export default class ArrayAttribute<
    T extends TSource,
> extends DuplicatableComponent<
    Func.CallBack<ArrayAttribute<T>>,
    {}
> {
    /**
     * @param array 数组
     * @param size 尺寸
     */
    constructor(
        public array: T,
        public size: number = 0,
    ) {
        super();
    }

    /**
     * 长度
     */
    public get length(): number {
        return this.array.length;
    }

    public clone(): this {
        return new ArrayAttribute<T>(this.array, this.size) as this;
    }

    public copy(target: this): this {
        this.array = target.array;
        this.size = target.size;
        return this;
    }

    protected execute(callback: Func.CallBack<ArrayAttribute<T>>): void {
        callback(this);
    }
}

type TSource =
    | Float32Array
    | Float64Array
    | Int8Array
    | Int16Array
    | Int32Array
    | Uint8Array
    | Uint16Array
    | Uint32Array
    | Uint8ClampedArray;
