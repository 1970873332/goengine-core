import SceneComponent, { SceneComponentEvent } from "./Scene";
/**
 * 画布组件
 */
export default class CanvasComponent<
    E extends IEvent,
> extends SceneComponent<E> {
    constructor(
        canvas: HTMLCanvasElement,
        protected readonly contextType: Canvas.ContextType,
        protected readonly config:
            CanvasRenderingContext2DSettings | WebGLContextAttributes,
    ) {
        super(canvas);
    }

    /**
     * 画布上下文
     */
    declare protected _context: Canvas.Context;

    /**
     * 获取2d上下文
     */
    public get ctx(): Canvas.Context2D | undefined {
        return this.context instanceof CanvasRenderingContext2D ||
            this.context instanceof OffscreenCanvasRenderingContext2D
            ? this.context
            : void 0;
    }
    /**
     * 获取gl上下文
     */
    public get gl(): WebGLRenderingContext | undefined {
        return this.context instanceof WebGLRenderingContext ||
            this.context instanceof WebGL2RenderingContext
            ? this.context
            : void 0;
    }
    /**
     * 获取gpu上下文
     */
    public get gpu(): GPUCanvasContext | undefined {
        return this.context instanceof GPUCanvasContext ? this.context : void 0;
    }
    /**
     * 获取上下文
     */
    public get context(): Canvas.Context | undefined {
        return (this._context ??=
            (this.canvas?.getContext(
                this.contextType,
                this.config,
            ) as Canvas.Context) ?? void 0);
    }
    /**
     * 清除画布
     */
    protected clear(): void {
        if (
            this.context instanceof CanvasRenderingContext2D ||
            this.context instanceof OffscreenCanvasRenderingContext2D
        )
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        else if (
            this.context instanceof WebGLRenderingContext ||
            this.context instanceof WebGL2RenderingContext
        ) {
            this.context.clearColor(0, 0, 0, 0);
            this.context.clearDepth(1.0);
            this.context.clear(
                this.context.COLOR_BUFFER_BIT | this.context.DEPTH_BUFFER_BIT,
            );
        }
    }
}

interface IEvent extends SceneComponentEvent {}

export { IEvent as CanvasComponentEvent };
