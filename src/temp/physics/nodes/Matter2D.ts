import { Body, IBodyDefinition } from "matter-js";
import BasePhysicsNode, {
    BasePhysicsNodeConfig,
    BasePhysicsNodeEvent,
} from "../Base";

/**
 * Matter2D节点
 */
export default class Matter2D<C extends IConfig, E extends IEvent> extends BasePhysicsNode<Body, C, E> {
    /**
     * 是否是Matter2D节点
     */
    public static isMatter2D: boolean = true;

    protected reBody(v?: C): void {
        this.body = Body.create(v ?? {});
    }

    protected formatConfig(v: C): C {
        return {
            ...v,
            inertia: v.inertia ?? Infinity,
        };
    }
}

interface IEvent extends BasePhysicsNodeEvent { }

interface IConfig
    extends BasePhysicsNodeConfig, Variant.Omit<IBodyDefinition, "position"> { }
