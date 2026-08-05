import TaskComponent, { TaskComponentEvent } from "../Task";

/**
 * 模块组件
 */
export default abstract class ModComponent<
    M,
    C extends IConfig,
    E extends IEvent,
> extends TaskComponent<E> {
    constructor(
        public readonly manager: M,
        config?: C,
    ) {
        super();

        config && this.setConfig(config);
    }

    /**
     * 设置配置
     * @param config 配置
     */
    protected setConfig(config: C): void {}
}

interface IConfig {}

interface IEvent extends TaskComponentEvent {}

export { IConfig as ModComponentConfig, IEvent as ModComponentEvent };
