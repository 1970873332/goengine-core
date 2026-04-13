enum EEvent {
    /**
     * 通知
     */
    Notice = 0x0,
    /**
     * 警告
     */
    Warning = 0x1,
    /**
     * 错误
     */
    Error = 0x2,
    /**
     * 信息
     */
    Info = 0x3,
    /**
     * 节点信息
     */
    NodeInfo = 0x100,
}

/**
 * 消息队列管理类
 */
export default class MessageQueueManager<T extends EEvent = EEvent> {
    /**
     * 消息映射
     */
    protected messageMaping: Map<T, TMessage[]> = new Map<T, TMessage[]>();

    /**
     * 添加消息
     * @param type 消息类型
     * @param message 消息
     * @param submit 是否提交
     */
    public add(type: T, message: TMessage, submit?: boolean): void {
        if (this.messageMaping.has(type)) {
            this.messageMaping.get(type)?.push(message);
        } else {
            this.messageMaping.set(type, [message]);
        }
        submit && this.submit(type);
    }
    /**
     * 删除消息
     * @param type
     */
    public remove(type: T, message: TMessage, full?: boolean): void {
        const messages = this.messageMaping.get(type);
        if (messages) {
            if (full) {
                this.messageMaping.set(
                    type,
                    messages.filter((item) => item !== message),
                );
            } else {
                const index = messages.indexOf(message);
                index > -1 && messages.splice(index, 1);
            }
        }
    }
    /**
     * 提交消息
     */
    public submit(type: T): IData | undefined {
        const messages = this.messageMaping.get(type);
        this.clean(type);
        return messages ? { type, messages } : void 0;
    }
    /**
     * 清理消息
     */
    public clean(type: T): void {
        this.messageMaping.delete(type);
    }
}

interface IData {
    /**
     * 事件类型
     */
    type: EEvent;
    /**
     * 消息列表
     */
    messages: TMessage[];
}

type TMessage = string | Record<any, any>;

export {
    IData as MessageQueueManagerData,
    EEvent as MessageQueueManagerEvent,
    TMessage as MessageQueueManagerMessage,
};
