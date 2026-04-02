import IdentityComponent from "../../components/Identity";

/**
 * 程序状态
 */
export default class ProgramState<
    E extends IEvent = IEvent,
> extends IdentityComponent<E> {}

interface IEvent {}
