import DuplicatableComponent, { DuplicatableSaveJSON } from "@core/component/fussy/Duplicatable";
import Value from "@core/object/attribute/Value";

/**
 * 基础物理节点
 */
export default abstract class BasePhysicsNode<
    T extends {},
    C extends IConfig,
    E extends IEvent,
> extends DuplicatableComponent<Func.CallBack<BasePhysicsNode<T, C, E>>, E> {
    /**
     * 是否是物理节点
     */
    public readonly isPhysicsNode: boolean = true;

    constructor(config?: C) {
        super();
    }

    /**
     * 刚体
     */
    public readonly body = new Value<T | undefined>(void 0);

    public toJSON(): ISaveJSON {
        return {
            ...super.toJSON()
        };
    }
}

interface IEvent { }

interface IConfig { }

interface ISaveJSON extends DuplicatableSaveJSON { }

export {
    IConfig as BasePhysicsNodeConfig,
    IEvent as BasePhysicsNodeEvent,
    ISaveJSON as BasePhysicsNodeSaveJSON
};

