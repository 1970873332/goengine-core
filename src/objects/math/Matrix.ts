import DuplicatableComponent from "../../components/fussy/Duplicatable";

/**
 * 矩阵
 */
export default abstract class Matrix<
    T extends number[],
> extends DuplicatableComponent<Record<any, any>, Func.CallBack<Matrix<T>>> {
    /**
     * 矩阵
     */
    declare public m: T;

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

    protected execute(callback: Func.CallBack<Matrix<T>>): void {
        callback(this);
    }

    public copy(target: this, silend?: boolean): this {
        return this.set(target.toArray(), silend);
    }
}
