import DuplicatableComponent, { DuplicatableSaveJSON } from "@core/component/fussy/Duplicatable";
import { TaskComponentEvent } from "@core/component/Task";
import MessageQueueManager, { MessageQueueManagerEvent } from "@core/manager/MessageQueue";
import { Matrix4, Quaternion, Vector3 } from "@core/object/math/Index";
import Euler, { EulerType } from "@core/object/math/transfrom/Euler";
import { Vector3Type } from "@core/object/math/vector/Vector3";
import { ArrayUtils } from "@core/util/Array";
import Value from "./attribute/Value";

/**
 * 基础节点
 */
export default abstract class BaseNode<
    C extends IConfig,
    E extends IEvent,
    T extends BaseNode<C, E, T>
> extends DuplicatableComponent<Func.CallBack<BaseNode<C, E, T>>, E> {
    /**
     * 是否是节点
     */
    public readonly isNode: boolean = true;

    /**
     * 父节点
     */
    public parent?: T;
    /**
     * 消息队列
     */
    public messageQueue?: MessageQueueManager;

    /**
     * 是否是指示元素
     */
    public instruct: boolean = false;
    /**
     * 受控
     */
    public controlled: boolean = true;
    /**
     * 是否禁用辅助
     */
    public disableHelper: boolean = true;
    /**
     * 子项
     */
    public readonly children = new Map<string, T>();
    /**
     * 是否可见
     */
    public readonly visible = new Value<boolean>(
        true,
    ).bindCallback(this.visibleCallback.bind(this));
    /**
     * 锚点
     */
    public readonly anchor = Vector3.zero().bindCallback(
        this.anchorCallback.bind(this),
    );
    /**
     * 缩放
     */
    public readonly scale = Vector3.one().bindCallback(
        this.scaleCallback.bind(this),
    );
    /**
     * 位置
     */
    public readonly position = Vector3.zero().bindCallback(
        this.positionCallback.bind(this),
    );
    /**
     * 旋转
     */
    public readonly rotation = Euler.zero().bindCallback(
        this.rotationCallback.bind(this),
    );
    /**
     * 四元数
     */
    public readonly quaternion = Quaternion.identity().bindCallback(
        this.quaternionCallback.bind(this),
    );
    /**
     * 矩阵
     */
    public readonly matrix = new Matrix4();
    /**
     * 世界矩阵
     */
    public readonly worldMatrix = new Matrix4();
    /**
     * 世界缩放
     */
    public readonly worldScale = Vector3.one();
    /**
     * 世界位置
     */
    public readonly worldPosition = Vector3.zero();
    /**
     * 世界旋转
     */
    public readonly worldRotation = Euler.zero();
    /**
     * 世界四元数
     */
    public readonly worldQuaternion = Quaternion.identity();

    /**
     * 更新矩阵
     * @returns
     */
    public updateMatrix(): void {
        this.matrix.copy(
            Matrix4.compose(this.position, this.quaternion, this.scale)
        );
        this.updateWorldMatrix();
    }
    /**
     * 更新世界矩阵
     */
    public updateWorldMatrix(): void {
        if (this.parent) {
            this.worldMatrix.copy(this.parent.worldMatrix).multiply(this.matrix);
        } else this.worldMatrix.copy(this.matrix);

        this.worldScale.fromMatrix(this.worldMatrix, "scale");
        this.worldPosition.fromMatrix(this.worldMatrix, "position");
        this.worldRotation.fromMatrix(this.worldMatrix);
        this.worldQuaternion.fromMatrix(this.worldMatrix);

        this.children.forEach((child) => child.updateWorldMatrix());
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

            instruct,
            controlled,
            disableHelper,

            visible,
        } = config;
        scale && this.scale.copy(scale, true);
        anchor && this.anchor.copy(anchor, true);
        position && this.position.copy(position, true);
        rotation && this.rotation.copy(rotation, true);

        this.instruct = instruct ?? this.instruct;
        this.controlled = controlled ?? this.controlled;
        this.disableHelper = disableHelper ?? this.disableHelper;

        this.visible.setter(visible ?? this.visible.value);

        this.quaternion.fromEuler(this.rotation, true);
        this.updateMatrix();
    }
    /**
     * 绑定父节点
     * @param parent
     */
    public bindParent(parent: T): this {
        this.parent = parent;
        parent.messageQueue &&
            this.bindMessageQueue(parent.messageQueue);
        this.updateWorldMatrix();
        return this;
    }
    /**
     * 解绑父节点
     */
    public unbindParent(): this {
        delete this.parent;
        this.unbindMessageQueue();
        return this;
    }
    /**
     * 绑定消息队列
     */
    public bindMessageQueue(messageQueue: MessageQueueManager): this {
        this.messageQueue = messageQueue;
        return this;
    }
    /**
     * 解绑消息队列
     */
    public unbindMessageQueue(): this {
        delete this.messageQueue;
        this.children.forEach((child: T) => child.unbindMessageQueue());
        return this;
    }
    /**
     * 缩放回调
     */
    protected scaleCallback(): void {
        this.addMessageQueue({ scale: this.scale.toArray() });
        this.updateMatrix();
    }
    /**
     * 位置回调
     */
    protected positionCallback(): void {
        this.addMessageQueue({ position: this.position.toArray() });
        this.updateMatrix();
    }
    /**
     * 旋转回调
     */
    protected rotationCallback(): void {
        this.addMessageQueue({ rotation: this.rotation.toArray() });
        this.quaternion.fromEuler(this.rotation, true);
        this.updateMatrix();
    }
    /**
     * 四元数回调
     */
    protected quaternionCallback(): void {
        this.addMessageQueue({ quaternion: this.quaternion.toArray() });
        this.rotation.fromQuaternion(
            this.quaternion,
            this.rotation.order,
            true,
        );
        this.updateMatrix();
    }
    /**
     * 锚点回调
     */
    protected anchorCallback(): void {
        this.addMessageQueue({ anchor: this.anchor.toArray() });
        this.updateMatrix();
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
    public add(...nodes: T[]): this {
        nodes.forEach((item: T) => {
            item.bindParent(this as unknown as T);
            this.children.set(item.uuid, item);
        });
        return this;
    }
    /**
     * 移除子项
     * @param node
     * @param destory
     */
    public remove(node: T, destory?: boolean): this {
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
    public traverse(callback: (node: T) => void): void {
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
            this.messageQueue?.add(type, { id: this.uuid, ...data });
    }
    /**
     * 获取节点
     * @param id
     * @returns
     */
    public getNodeByID(id: string): T | undefined {
        let node: T | undefined = this.children.get(id);
        !node && this.traverse((item) => item.uuid === id && (node = item));
        return node;
    }
    /**
     * 清理
     * @param destory
     */
    public clear(destory?: boolean): void {
        this.children.forEach((item: T) =>
            destory ? item.destroy() : item.unbindParent(),
        );
        this.children.clear();
    }
    /**
     * 销毁
     */
    public destroy(): void {
        this.clear(true);
        this.parent?.remove(this as unknown as T);
    }

    protected execute(callback: Func.CallBack<BaseNode<C, E, T>, void>): void {
        callback(this);
    }

    public toJSON(): ISaveJSON {
        const children: string[] = [];
        this.children.forEach((item) => children.push(item.uuid));
        return {
            ...super.toJSON(),

            children: children,

            scale: this.scale.toArray(),
            anchor: this.anchor.toArray(),
            position: this.position.toArray(),
            rotation: this.rotation.toArray(),

            instruct: this.instruct,
            controlled: this.controlled,
            disableHelper: this.disableHelper,

            visible: this.visible.value,
        };
    }

    public reInit(): void {
        this.scale.reBindCallback(true, this.scaleCallback.bind(this));
        this.anchor.reBindCallback(true, this.anchorCallback.bind(this));
        this.position.reBindCallback(true, this.positionCallback.bind(this));
        this.rotation.reBindCallback(true, this.rotationCallback.bind(this));
        this.quaternion.reBindCallback(true, this.quaternionCallback.bind(this));

        this.visible.reBindCallback(true, this.visibleCallback.bind(this));
    }

    public copy(target: this): this {
        const {
            scale,
            anchor,
            position,
            rotation,
            quaternion,

            matrix,
            worldMatrix,

            instruct,
            controlled,
            disableHelper,

            visible,
        } = target;

        this.scale.copy(scale, true);
        this.anchor.copy(anchor, true);
        this.position.copy(position, true);
        this.rotation.copy(rotation, true);
        this.quaternion.copy(quaternion, true);

        this.matrix.copy(matrix, true);
        this.worldMatrix.copy(worldMatrix, true);

        Object.assign(this, {
            instruct,
            controlled,
            disableHelper
        });

        this.visible.setter(visible.value);

        return this;
    }
}

interface IConfig extends Partial<
    Pick<
        BaseNode<any, any, any>,
        | "scale"
        | "anchor"
        | "position"
        | "rotation"

        | "instruct"
        | "controlled"
        | "disableHelper"
    >
> {
    /**
     * 是否可见
     */
    visible?: boolean;
}

interface ISaveJSON extends DuplicatableSaveJSON, Partial<
    Pick<BaseNode<any, any, any>, "instruct" | "controlled" | "disableHelper">
> {
    /**
     * 子项
     */
    children: string[];
    /**
     * 锚点
    */
    anchor: Vector3Type;
    /**
     * 缩放
    */
    scale: Vector3Type;
    /**
     * 位置
     */
    position: Vector3Type;
    /**
     * 旋转
     */
    rotation: EulerType;
    /**
     * 是否可见
     */
    visible: boolean;
}

interface IEvent extends TaskComponentEvent { }

export {
    IConfig as BaseNodeConfig,
    IEvent as BaseNodeEvent,
    ISaveJSON as BaseNodeSaveJSON
};

