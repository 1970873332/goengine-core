import CallBackComponent from "../CallBack";

/**
 * 复制组件
 */
export default abstract class DuplicatableComponent<
    T extends Function,
    E extends {},
> extends CallBackComponent<T, E> {
    /**
     * 克隆
     * @returns
     */
    public clone(): this {
        const Constructor = this.constructor as new (...args: any[]) => this;
        return (new Constructor() as this).copy(this, true);
    }
    /**
     * 复制
     * @param target 目标
     * @param silence 静默
     */
    public copy(target: this, silence?: boolean): this {
        !silence && this.trigger();
        return this;
    }
    /**
     * 复制
     * @param target 目标
     */
    public liveCopy(target: this): this {
        this.copy(target, true);
        this.trigger();
        return this;
    }
    /**
     * 转换为JSON
     * @returns
     */
    public toJSON(): ISaveJSON {
        return {
            uuid: this.uuid,
            type: this.constructor.name,
        };
    }
    /**
     * 转换为字符串
     */
    public toString(): string {
        throw new Error("未实现toString");
    }
}

interface ISaveJSON extends Partial<Pick<IAny, "uuid">> {
    /**
     * 类型
     */
    type: string;
}

type IAny = DuplicatableComponent<any, any>;

export { IAny as DuplicatableComponentAny, ISaveJSON as DuplicatableSaveJSON };
