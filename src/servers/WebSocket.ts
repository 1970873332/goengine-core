import { EventTarget } from "../supplements/Event";

/**
 * WebSocket服务器
 */
export default class WebSocketServer<
    E extends IEvent = IEvent,
> extends EventTarget<E> {
    constructor(protected url: string) {
        super();
    }

    /**
     * 连接
     */
    protected webSocket?: WebSocket;

    /**
     * 绑定事件
     * @param webSocket
     */
    protected bindEvents(): void {
        if (!this.webSocket) return;
        this.webSocket.onopen = (event: Event) =>
            this.dispatchCustomEvent("open", event);
        this.webSocket.onmessage = (event: MessageEvent) =>
            this.dispatchCustomEvent("message", event);
        this.webSocket.onerror = (error: Event) => {
            this.dispatchCustomEvent("error", error);
            this.breakConnect();
            delete this.webSocket;
        };
        this.webSocket.onclose = (event: CloseEvent) => {
            this.dispatchCustomEvent("close", event);
            delete this.webSocket;
        };
    }
    /**
     * 连接
     * @returns
     */
    public connect(): void {
        this.webSocket ??= new WebSocket(this.url);
        this.bindEvents();
    }
    /**
     * 断开连接
     */
    public breakConnect() {
        this.webSocket?.close();
    }
    /**
     * 发送数据
     * @param data
     */
    public async send(
        data?: string | ArrayBufferLike | Blob | ArrayBufferView,
    ): Promise<void> {
        data &&
            this.webSocket?.readyState === WebSocket.OPEN &&
            this.webSocket?.send(data);
    }
}

interface IEvent {
    /**
     * 消息
     */
    message: MessageEvent;
    /**
     * 开启
     */
    open: Event;
    /**
     * 关闭
     */
    close: CloseEvent;
    /**
     * 异常
     */
    error: Event;
}
