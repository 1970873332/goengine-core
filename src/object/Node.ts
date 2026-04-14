import DuplicatableComponent from "@core/component/fussy/Duplicatable";
import { TaskComponentEvent } from "@core/component/Task";
import MessageQueueManager, { MessageQueueManagerEvent } from "@core/manager/MessageQueue";
import ResponseAttribute from "@core/object/attribute/Response";
import { Quaternion, Vector3 } from "@core/object/math/Index";
import Euler, { EulerType } from "@core/object/math/transfrom/Euler";
import { Vector3Type } from "@core/object/math/vector/Vector3";
import { ArrayUtils } from "@core/util/Array";

/**
 * 基础节点
 */
export default abstract class BaseNode<
    C extends IConfig,
    E extends IEvent,
> extends DuplicatableComponent<Func.CallBack<BaseNode<C, E>>, E> {
    /**
     * 是否是节点
     */
    public readonly isNode: boolean = true;

    /**
     * 是否禁用辅助
     */
    public disableHelper: boolean = true;
    /**
     * 是否是指示元素
     */
    public instruct: boolean = false;
    /**
     * 受控
     */
    public controlled: boolean = false;
    /**
     * 父节点
     */
    public readonly parent = new ResponseAttribute<BaseNode<any, any> | undefined>(void 0);
    /**
     * 消息队列
     */
    public readonly messageQueue = new ResponseAttribute<MessageQueueManager | undefined>(void 0);
    /**
     * 位置
     */
    public readonly position = new Vector3().bindCallback(
        this.positionCallback.bind(this),
    );
    /**
     * 锚点
     */
    public readonly anchor = new Vector3().bindCallback(
        this.anchorCallback.bind(this),
    );
    /**
     * 缩放
     */
    public readonly scale = new Vector3(1, 1, 1).bindCallback(
        this.scaleCallback.bind(this),
    );
    /**
     * 旋转
     */
    public readonly rotation = new Euler().bindCallback(
        this.rotationCallback.bind(this),
    );
    /**
     * 四元数
     */
    public readonly quaternion = new Quaternion().bindCallback(
        this.quaternionCallback.bind(this),
    );
    /**
     * 子项
     */
    public readonly children = new Map<string, BaseNode<any, any>>();
    /**
     * 是否可见
     */
    public readonly visible = new ResponseAttribute(
        true,
    ).bindCallback(this.visibleCallback.bind(this));

    /**
     * 世界位置
     */
    public get worldPosition(): Vector3 {
        if (!this.parent?.value) return this.position.clone();
        return this.parent.value.worldPosition.add(this.position);
    }
    public set worldPosition(v: Vector3) {
        if (!this.parent?.value) this.position.copy(v);
        else this.position.copy(v.clone().sub(this.parent.value.worldPosition));
    }

    /**
     * 设置配置
     * @param config
     */
    public setConfig(config: C): void {
        const {
            scale,
            anchor,
            position,
            rotation,
            visible,
            instruct,
            controlled,
            disableHelper,
        } = config;
        scale && this.scale.copy(scale);
        anchor && this.anchor.copy(anchor);
        position && this.position.copy(position);
        rotation && this.rotation.copy(rotation);
        this.instruct = instruct ?? this.instruct;
        this.controlled = controlled ?? this.controlled;
        this.disableHelper = disableHelper ?? this.disableHelper;
        typeof visible === "boolean" && this.visible.setter(visible);
    }
    /**
     * 绑定父节点
     * @param parent
     */
    public bindParent(parent: BaseNode<any, any>): this {
        this.parent.setter(parent);
        parent.messageQueue.value &&
            this.bindMessageQueue(parent.messageQueue.value);
        return this;
    }
    /**
     * 解绑父节点
     */
    public unbindParent(): this {
        delete this.parent.value;
        this.unbindMessageQueue();
        return this;
    }
    /**
     * 绑定消息队列
     */
    public bindMessageQueue(messageQueue: MessageQueueManager): this {
        this.messageQueue.value = messageQueue;
        return this;
    }
    /**
     * 解绑消息队列
     */
    public unbindMessageQueue(): this {
        delete this.messageQueue.value;
        this.children.forEach((child: BaseNode<any, any>) => child.unbindMessageQueue());
        return this;
    }
    /**
     * 旋转回调
     */
    protected rotationCallback(): void {
        this.quaternion.fromEuler(this.rotation, true);
        this.addMessageQueue({ rotation: this.rotation.toArray() });
    }
    /**
     * 四元数回调
     */
    protected quaternionCallback(): void {
        this.rotation.fromQuaternion(
            this.quaternion,
            this.rotation.order,
            true,
        );
        this.addMessageQueue({ quaternion: this.quaternion.toArray() });
    }
    /**
     * 位置回调
     */
    protected positionCallback(): void {
        this.addMessageQueue({ position: this.position.toArray() });
    }
    /**
     * 缩放回调
     */
    protected scaleCallback(): void {
        this.addMessageQueue({ scale: this.scale.toArray() });
    }
    /**
     * 锚点回调
     */
    protected anchorCallback(): void {
        this.addMessageQueue({ anchor: this.anchor.toArray() });
    }
    /**
     * 可见回调
     */
    protected visibleCallback(): void {
        this.addMessageQueue({ visible: this.visible.value });
    }
    /**
     * 添加子项
     * @param node
     */
    public add(...nodes: BaseNode<any, any>[]): this {
        nodes.forEach((item: BaseNode<any, any>) => {
            item.bindParent(this as BaseNode<any, any>);
            this.children.set(item.uuid, item);
        });
        return this;
    }
    /**
     * 移除子项
     * @param node
     * @param destory
     */
    public remove(node: BaseNode<any, any>, destory?: boolean): this {
        node.unbindParent();
        this.children.delete(node.uuid);
        destory && node.destroy();
        return this;
    }
    /**
     * 转换本地坐标为世界位置
     * @param v
     * @returns
     */
    public transLocalToWorldPosition(v: Vector3): Vector3 {
        return this.worldPosition.add(v);
    }
    /**
     * 转换世界坐标为本地位置
     * @param v
     * @returns
     */
    public transWorldToLocalPosition(v: Vector3): Vector3 {
        return v.clone().sub(this.worldPosition);
    }
    /**
     * 遍历子项
     * @param callback
     */
    public traverse(callback: (node: BaseNode<any, any>) => void): void {
        ArrayUtils.traverse(this.children, callback);
    }
    /**
     * 添加消息队列
     */
    public addMessageQueue(
        data: Record<any, unknown>,
        type: MessageQueueManagerEvent = MessageQueueManagerEvent.NodeInfo,
    ): void {
        !this.controlled &&
            this.messageQueue.value?.add(type, { id: this.uuid, ...data });
    }
    /**
     * 获取节点
     * @param id
     * @returns
     */
    public getNodeByID(id: string): BaseNode<any, any> | undefined {
        let node: BaseNode<any, any> | undefined = this.children.get(id);
        !node && this.traverse((item) => item.uuid === id && (node = item));
        return node;
    }
    /**
     * 清理
     * @param destory
     */
    public clear(destory?: boolean): void {
        this.children.forEach((item: BaseNode<any, any>) =>
            destory ? item.destroy() : item.unbindParent(),
        );
        this.children.clear();
    }
    /**
     * 销毁
     */
    public destroy(): void {
        this.clear(true);
        this.parent.value?.remove(this as BaseNode<any, any>);
    }

    public toJSON(): ISaveJSON {
        const children: string[] = [];
        this.children.forEach((item) => children.push(item.uuid));
        return {
            uuid: this.uuid,
            type: this.constructor.name,
            visible: this.visible.value,
            disableHelper: this.disableHelper,
            instruct: this.instruct,
            controlled: this.controlled,
            children: children,
            position: this.position.toArray(),
            anchor: this.anchor.toArray(),
            scale: this.scale.toArray(),
            rotation: this.rotation.toArray(),
        };
    }

    public reInit(): void {
        this.anchor.reBindCallback(true, this.anchorCallback.bind(this));
        this.position.reBindCallback(true, this.positionCallback.bind(this));
        this.scale.reBindCallback(true, this.scaleCallback.bind(this));
        this.rotation.reBindCallback(true, this.rotationCallback.bind(this));
        this.quaternion.reBindCallback(true, this.quaternionCallback.bind(this));
        this.visible.reBindCallback(true, this.visibleCallback.bind(this));
    }
}

interface IConfig extends Partial<
    Pick<
        BaseNode<any, any>,
        | "uuid"
        | "position"
        | "anchor"
        | "rotation"
        | "scale"
        | "disableHelper"
        | "instruct"
        | "controlled"
    >
> {
    /**
     * 是否可见
     */
    visible?: boolean;
}

interface ISaveJSON extends Partial<
    Pick<BaseNode<any, any>, "uuid" | "disableHelper" | "instruct" | "controlled">
> {
    /**
     * 类型
     */
    type: string;
    /**
     * 是否可见
     */
    visible: boolean;
    /**
     * 子项
     */
    children: string[];
    /**
     * 位置
     */
    position: Vector3Type;
    /**
     * 锚点
     */
    anchor: Vector3Type;
    /**
     * 缩放
     */
    scale: Vector3Type;
    /**
     * 旋转
     */
    rotation: EulerType;
}

interface IEvent extends TaskComponentEvent { }

export {
    IConfig as BaseNodeConfig,
    IEvent as BaseNodeEvent,
    ISaveJSON as BaseNodeSaveJSON
};

