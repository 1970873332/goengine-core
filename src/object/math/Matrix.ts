import DuplicatableComponent from "@core/component/fussy/Duplicatable";

/**
 * 矩阵
 */
export default abstract class Matrix<
    T extends number[],
    E extends {},
> extends DuplicatableComponent<Func.CallBack<Matrix<T, E>>, E> {
    /**
     * 是否是矩阵
     */
    public readonly isMatrix: boolean = true;

    /**
     * 矩阵
     */
    public declare m: T;

    /**
     * 设置
     * @param array
     * @param silend
     * @returns
     */
    public set(array: T, silend?: boolean): this {
        const same: boolean = array.toString() === this.m.toString();
        this.m = array;
        !silend && !same && this.trigger();
        return this;
    }
    /**
     * 数组转为矩阵
     * @returns
     */
    public toArray(): T {
        return [...this.m] as T;
    }
    /**
     * 重置为单位矩阵
     * @returns
     */
    public identity(): this {
        throw new Error("未实现identity");
    }

    protected execute(callback: Func.CallBack<Matrix<T, E>>): void {
        callback(this);
    }

    public copy(target: this, silend?: boolean): this {
        return this.set(target.toArray(), silend);
    }
}
