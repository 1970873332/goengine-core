import BaseGLNode, { BaseGLNodeConfig } from "../Base";

/**
 * 组
 */
export default class Group extends BaseGLNode<IConfig> {
    public readonly isGroup: boolean = true;

    constructor(config?: IConfig) {
        super();
        config && this.setConfig(config);
    }
}

interface IConfig extends BaseGLNodeConfig {}
