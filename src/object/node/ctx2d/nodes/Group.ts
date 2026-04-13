import BaseCTXNode from "../Base";

/**
 * 组
 */
export default class Group extends BaseCTXNode<Record<any, any>, Record<any, any>, Record<any, any>> {
    /**
     * 是否是组
     */
    public readonly isGroup: boolean = true;
}
