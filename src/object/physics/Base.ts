import DuplicatableComponent from "@core/component/fussy/Duplicatable";
import ResponseAttribute from "@core/object/attribute/Response";

/**
 * 基础物理节点
 */
export default abstract class BasePhysicsNode<
    T extends Record<any, any>,
    C extends IConfig,
    E extends IEvent,
> extends DuplicatableComponent<Func.CallBack<BasePhysicsNode<T, C, E>>, E> {
    /**
     * 是否是物理节点
     */
    public readonly isPhysicsNode: boolean = true;

    constructor(config?: C) {
        super();
        this.config.setter(config);
    }

    /**
     * 刚体
     */
    protected declare body_source: T;

    /**
     * 刚体
     */
    public get body(): T {
        return this.body_source;
    }
    protected set body(v: T) {
        this.body_source = v;
    }

    /**
     * 配置
     */
    protected config = new ResponseAttribute<C | undefined>(
        void 0,
        this.formatConfig.bind(this),
    ).bindCallback(this.reBody.bind(this));

    /**
     * 重置刚体
     */
    protected reBody(v?: C): void {
        throw new Error("未实现reBody");
    }
    /**
     * 格式化配置
     * @param config
     * @returns
     */
    protected formatConfig(config?: C): C | undefined {
        return config;
    }

    public toJSON(): ISaveJSON {
        return {
            uuid: this.uuid,
            type: this.constructor.name,
            config: this.config.value ?? {},
        };
    }
}

interface IEvent { }

interface IConfig { }

interface ISaveJSON {
    /**
     * 唯一标识
     */
    uuid: string;
    /**
     * 类型
     */
    type: string;
    /**
     * 配置
     */
    config: Record<any, unknown>;
}

export {
    IConfig as BasePhysicsNodeConfig, IEvent as BasePhysicsNodeEvent,
    ISaveJSON as BasePhysicsNodeSaveJSON
};

