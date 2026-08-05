import DuplicatableComponent from "@goengine/core/src/component/fussy/Duplicatable";
import { TaskComponentEvent } from "@goengine/core/src/component/Task";
import MessageQueueManager, {
    MessageQueueManagerEvent,
} from "@goengine/core/src/manager/MessageQueue";
import Euler from "@goengine/core/src/object/math/transfrom/Euler";
import Matrix4 from "./math/matrix/Matrix4";
import Quaternion from "./math/transfrom/Quaternion";
import Vector3 from "./math/vector/Vector3";

/**
 * 基础节点
 */
export default abstract class BaseNode<
    C extends IConfig,
    E extends IEvent,
    T extends BaseNode<any, any, T>,
> extends DuplicatableComponent<Func.CallBack<T>, E> {
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
     * 是否禁用辅助
     */
    public disableHelper: boolean = true;
    /**
     * 是否可见
     */
    public visible: boolean = true;
    /**
     * 受控
     */
    public controlled: boolean = true;
    /**
     * 子项
     */
    public readonly children = new Map<string, T>();
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
     * 旋转
     */
    public readonly rotation = Euler.zero().bindCallback(
        this.rotationCallback.bind(this),
    );
    /**
     * 位置
     */
    public readonly position = Vector3.zero().bindCallback(
        this.positionCallback.bind(this),
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
     * 世界旋转
     */
    public readonly worldRotation = Euler.zero();
    /**
     * 世界位置
     */
    public readonly worldPosition = Vector3.zero();
    /**
     * 世界四元数
     */
    public readonly worldQuaternion = Quaternion.identity();

    /**
     * 是否接受事件
     */
    public get pointEvent(): boolean {
        return this.visible && this.controlled;
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

            visible = this.visible,
            instruct = this.instruct,
            controlled = this.controlled,
            disableHelper = this.disableHelper,
        } = config;

        Object.assign(this, {
            visible,
            instruct,
            controlled,
            disableHelper,
        });

        scale && this.scale.set(scale.x, scale.y, scale.z, true);
        anchor && this.anchor.set(anchor.x, anchor.y, anchor.z, true);
        position && this.position.set(position.x, position.y, position.z, true);
        rotation &&
            (this.rotation.set(
                rotation.x,
                rotation.y,
                rotation.z,
                this.rotation.order,
                true,
            ),
            this.quaternion.fromEuler(this.rotation, true));

        this.updateMatrix();
    }
    /**
     * 更新矩阵
     * @returns
     */
    public updateMatrix(): void {
        this.matrix.copy(
            Matrix4.compose(this.position, this.quaternion, this.scale),
        );
        this.updateWorldMatrix();
    }
    /**
     * 更新世界矩阵
     */
    public updateWorldMatrix(): void {
        if (this.parent) {
            this.worldMatrix
                .copy(this.parent.worldMatrix)
                .multiply(this.matrix);
        } else this.worldMatrix.copy(this.matrix);

        this.worldScale.fromMatrix(this.worldMatrix, "scale");
        this.worldPosition.fromMatrix(this.worldMatrix, "position");
        this.worldRotation.fromMatrix(this.worldMatrix);
        this.worldQuaternion.fromMatrix(this.worldMatrix);

        this.children.forEach((child) => child.updateWorldMatrix());
    }
    /**
     * 绑定父节点
     * @param parent
     */
    public bindParent(parent: T): this {
        this.parent = parent;
        parent.messageQueue && this.bindMessageQueue(parent.messageQueue);
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
     * 添加子项
     * @param node
     */
    public add(...nodes: T[]): this {
        nodes.forEach((item) => {
            item.bindParent(this as unknown as T);
            this.children.set(item.uuid, item);
        });
        return this;
    }
    /**
     * 移除子项
     * @param node
     * @param destroy
     */
    public remove(node: T, destroy?: boolean): this {
        node.unbindParent();
        this.children.delete(node.uuid);
        destroy && node.destroy();
        return this;
    }
    /**
     * 添加消息队列
     */
    public addMessageQueue(
        data: Record<Iteration, unknown>,
        type: MessageQueueManagerEvent = MessageQueueManagerEvent.NodeInfo,
    ): void {
        !this.controlled &&
            this.messageQueue?.add(type, { id: this.uuid, ...data });
    }
    /**
     * 清理
     * @param destroy
     */
    public clear(destroy?: boolean): void {
        this.children.forEach((item) =>
            destroy ? item.destroy() : item.unbindParent(),
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

    public copy(target: this, silence?: boolean): this {
        const {
            scale,
            anchor,
            position,
            rotation,
            quaternion,

            matrix,
            worldMatrix,

            visible,
            instruct,
            controlled,
            disableHelper,
        } = target;

        Object.assign(this, {
            visible,
            instruct,
            controlled,
            disableHelper,
        });

        this.scale.copy(scale, true);
        this.anchor.copy(anchor, true);
        this.position.copy(position, true);
        this.rotation.copy(rotation, true);
        this.quaternion.copy(quaternion, true);

        this.matrix.copy(matrix, true);
        this.worldMatrix.copy(worldMatrix, true);

        return super.copy(target, silence);
    }
}

interface IConfig extends Partial<
    Pick<IAny, "visible" | "instruct" | "controlled" | "disableHelper">
> {
    /**
     * 锚点
     */
    anchor?: Partial<VectorObject.Vector3>;
    /**
     * 缩放
     */
    scale?: Partial<VectorObject.Vector3>;
    /**
     * 位置
     */
    position?: Partial<VectorObject.Vector3>;
    /**
     * 旋转
     */
    rotation?: Partial<VectorObject.Vector3>;
}

interface IEvent extends TaskComponentEvent {}

type IAny = BaseNode<any, any, IAny>;

export {
    IAny as BaseNodeAny,
    IConfig as BaseNodeConfig,
    IEvent as BaseNodeEvent,
};
