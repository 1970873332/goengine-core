import { BaseNodeSaveJSON } from "../../Base";
import BaseGLNode, { BaseGLNodeConfig } from "../Base";

/**
 * 场景
 */
export default class Scene extends BaseGLNode<IConfig> {
    public readonly isScene: boolean = true;

    constructor(config?: IConfig) {
        super();
        config && this.setConfig(config);
    }
}

interface IConfig extends BaseGLNodeConfig {}

interface ISaveJSON extends BaseNodeSaveJSON {}

export { ISaveJSON as SceneSaveJSON };
