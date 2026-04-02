import DuplicatableComponent from "../../../components/fussy/Duplicatable";
import ResponseAttribute from "../../attribute/Response";

/**
 * 基础物理节点
 */
export default abstract class BasePhysicsNode<
    B extends Record<any, any>,
    C extends IConfig = IConfig,
    E extends IEvent = IEvent,
> extends DuplicatableComponent<E, Func.CallBack<BasePhysicsNode<B, C, E>>> {
    public readonly isPhysicsNode: boolean = true;

    constructor(config?: C) {
        super();
        this.config.setter(config);
    }

    declare protected _body: B;

    /**
     * 刚体
     */
    public get body(): B {
        return this._body;
    }
    protected set body(v: B) {
        this._body = v;
    }

    /**
     * 配置
     */
    protected config: ResponseAttribute<C | undefined> = new ResponseAttribute(
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

interface IEvent {}

interface IConfig {}

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
    IEvent as BasePhysicsNodeEvent,
    ISaveJSON as BasePhysicsNodeSaveJSON,
    IConfig as BasePhysicsNodeConfig,
};
