import TaskComponent, { TaskComponentEvent } from "../Task";
/**
 * 模块组件
 */
export default class ModComponent<
    M,
    E extends IEvent = IEvent,
> extends TaskComponent<E> {
    /**
     * @param manager 管理器
     */
    constructor(public manager: M) {
        super();
    }
}

interface IEvent extends TaskComponentEvent {}
