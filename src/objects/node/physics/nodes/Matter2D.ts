import { Body, IBodyDefinition } from "matter-js";
import BasePhysicsNode, {
    BasePhysicsNodeConfig,
    BasePhysicsNodeEvent,
} from "../Base";

/**
 * Matter2D节点
 */
export default class Matter2D extends BasePhysicsNode<Body, IConfig, IEvent> {
    protected reBody(v?: IConfig): void {
        this.body = Body.create(v ?? {});
    }

    protected formatConfig(v: IConfig): IConfig {
        return {
            ...v,
            inertia: v.inertia ?? Infinity,
        };
    }
}

interface IEvent extends BasePhysicsNodeEvent {}

interface IConfig
    extends BasePhysicsNodeConfig, Variant.Omit<IBodyDefinition, "position"> {}
