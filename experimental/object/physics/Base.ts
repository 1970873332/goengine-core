import DuplicatableComponent from "@goengine/core/src/component/fussy/Duplicatable";
import Value from "@goengine/core/src/object/attribute/Value";

/**
 * 基础物理节点
 */
export default abstract class BasePhysicsNode<
    T extends {},
    C extends IConfig,
    E extends IEvent,
> extends DuplicatableComponent<Func.CallBack<BasePhysicsNode<T, C, E>>, E> {
    /**
     * 刚体
     */
    public readonly body = new Value<T | undefined>(void 0);
}

interface IEvent {}

interface IConfig {}

export { IConfig as BasePhysicsNodeConfig, IEvent as BasePhysicsNodeEvent };
