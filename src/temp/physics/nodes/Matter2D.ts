import { Body, IBodyDefinition } from "matter-js";
import BasePhysicsNode, {
    BasePhysicsNodeConfig,
    BasePhysicsNodeEvent,
} from "../Base";

/**
 * Matter2D节点
 */
export default class Matter2D extends BasePhysicsNode<Body, IConfig, IEvent> {
    /**
     * 是否是Matter2D节点
     */
    public static isMatter2D: boolean = true;
}

interface IConfig
    extends BasePhysicsNodeConfig, Variant.Omit<IBodyDefinition, "position"> { }

interface IEvent extends BasePhysicsNodeEvent { }
