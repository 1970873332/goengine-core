import { DocumentUtils } from "@goengine/core/temporary/util/Document";
import SceneComponent, {
    SceneComponentEvent,
} from "@goengine/core/src/component/draw/Scene";
import {
    Body,
    Composite,
    Constraint,
    Engine,
    MouseConstraint,
    Render,
    Runner,
    Vector,
    World,
} from "matter-js";

// import "pathseg";
// Common.setDecomp(PolyDecompES);
/**
 * 基础matter场景
 */
export default class BaseMatterMap extends SceneComponent<SceneComponentEvent> {
    declare protected _render: Render;

    constructor() {
        super(DocumentUtils.simulationCanvas);
    }

    protected readonly needStats: boolean = false;

    /**
     * 是否渲染matter
     */
    public readonly renderMatter: boolean = true;
    /**
     * 引擎
     */
    public engine: Engine = Engine.create();
    /**
     * 运行器
     */
    public runner: Runner = Runner.create();

    /**
     * 世界
     */
    public get world(): World {
        return this.engine.world;
    }
    /**
     * 偏移
     */
    public get translate(): Vector {
        return Vector.create(this.canvas.width / 2, this.canvas.height / 2);
    }

    /**
     * 渲染
     */
    public get render(): Render {
        return (this._render ??= Render.create({
            canvas: this.canvas,
            engine: this.engine,
            options: {
                width: this.canvas.width,
                height: this.canvas.height,
                wireframeBackground: void 0,
            },
        }));
    }

    /**
     * 添加
     * @param node
     */
    public add(...nodes: TNode[]): void {
        World.add(this.world, nodes);
    }
    /**
     * 移除
     * @param nodes
     */
    public remove(...nodes: TNode[]): void {
        World.remove(this.world, nodes);
    }
    /**
     * 看向
     * @param vector
     */
    public lookAt(vector: Vector): void {
        Render.lookAt(this.render, {
            min: Vector.sub(vector, this.translate),
            max: Vector.add(vector, this.translate),
        });
    }

    protected init(): void {
        this.engine.gravity.y = 1;
        this.lookAt(Vector.create());
    }

    protected async applyScript(): Promise<void> {
        Runner.run(this.runner, this.engine);
        this.renderMatter && Render.run(this.render);
    }

    protected update(time: DOMHighResTimeStamp): void {
        super.update(time);

        Engine.update(this.engine);
    }

    public resize(): void {
        super.resize();

        this.render.options.width = this.canvas.width;
        this.render.options.height = this.canvas.height;
        this.renderMatter && Render.world(this.render);
    }

    public destroy(): void {
        World.clear(this.world, false);
        Engine.clear(this.engine);
        Runner.stop(this.runner);
        Render.stop(this.render);

        super.destroy();
    }
}

type TNode = Body | Composite | Constraint | MouseConstraint;
