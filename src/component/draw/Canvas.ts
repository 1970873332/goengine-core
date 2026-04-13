import { Vector2 } from "@core/object/math/Index";
import SceneComponent, { SceneComponentEvent } from "./Scene";
/**
 * 画布组件
 */
export default class CanvasComponent<
    E extends IEvent = IEvent,
> extends SceneComponent<E> {
    declare protected ctx_source: TRenderingContext;

    constructor(
        element: HTMLCanvasElement,
        protected contextID: TContext,
    ) {
        super(element);
    }

    /**
     * 渲染缩放
     */
    public ratio: number = 1;
    /**
     * 视口坐标
     */
    public viewport: Vector2 = new Vector2();
    /**
     * 获取2d上下文
     */
    public get ctx2d(): CanvasRenderingContext2D | undefined {
        return this.ctx instanceof CanvasRenderingContext2D ? this.ctx : void 0;
    }
    /**
     * 获取gl上下文
     */
    public get gl(): WebGLRenderingContext | undefined {
        return this.ctx instanceof WebGLRenderingContext ||
            this.ctx instanceof WebGL2RenderingContext
            ? this.ctx
            : void 0;
    }
    /**
     * 获取gpu上下文
     */
    public get gpu(): GPUCanvasContext | undefined {
        return this.ctx instanceof GPUCanvasContext ? this.ctx : void 0;
    }
    /**
     * 获取上下文
     */
    public get ctx(): TRenderingContext | undefined {
        return (this.ctx_source ??=
            (this.element?.getContext(this.contextID, {
                alpha: true,
                depth: true,
                antialias: true,
                willReadFrequently: true,
            }) as TRenderingContext) ?? void 0);
    }
    /**
     * 清除画布(只是清除当前帧)
     */
    protected clear(): void {
        if (this.ctx instanceof CanvasRenderingContext2D)
            this.ctx.clearRect(0, 0, this.element.width, this.element.height);
        else if (
            this.ctx instanceof WebGLRenderingContext ||
            this.ctx instanceof WebGL2RenderingContext
        ) {
            this.ctx.clearColor(0, 0, 0, 0);
            this.ctx.clearDepth(1.0);
            this.ctx.clear(
                this.ctx.COLOR_BUFFER_BIT | this.ctx.DEPTH_BUFFER_BIT,
            );
        }
    }
    /**
     * 转换坐标
     * @param vector
     * @returns
     */
    public transVector(vector: Vector2): Vector2 {
        return vector.clone().multiplyScalar(this.ratio).add(this.viewport);
    }
    /**
     * 屏幕坐标转画布坐标
     * @param vector
     * @param target
     * @returns
     */
    public screenToCanvas(vector: Vector2): Vector2 {
        const { viewport, ratio } = this;
        return vector.clone().add(viewport).multiplyScalar(ratio);
    }
    /**
     * 画布坐标转屏幕坐标
     * @param vector
     * @param target
     * @returns
     */
    public canvasToScreen(vector: Vector2): Vector2 {
        const { viewport, ratio } = this;
        return vector.clone().sub(viewport).divideScalar(ratio);
    }
}

interface IEvent extends SceneComponentEvent { }

type TRenderingContext =
    | CanvasRenderingContext2D
    | GLSL.WebGLAllRenderingContext
    | GPUCanvasContext;

type TContext = "2d" | "webgl" | "webgl2" | "webgpu";

export { IEvent as CanvasComponentEvent };

