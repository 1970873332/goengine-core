import { CanvasUtils } from "./Canvas";

/**
 * id枚举
 */
enum EIDMap {
    /**
     * 根容器
     */
    ROOT_WRAP = "root-wrap",
    /**
     * 弹窗容器
     */
    POPUP_WRAP = "popup-wrap",
    /**
     * 弹窗消息容器
     */
    POPUP_ALERT_WRAP = "popup-alert-wrap",
    /**
     * 画布容器
     */
    CANVAS_WRAP = "canvas-wrap",
    /**
     * 基础画布
     */
    BASE_CANVAS = "base-canvas",
    /**
     * 模拟画布
     */
    SIMULATION_CANVAS = "simulation-canvas",
    /**
     * 指示画布
     */
    INSTRUCT_CANVAS = "instruct-canvas",
}

/**
 * 文档工具类
 */
export abstract class DocumentUtils {
    /**
     * 获取root容器
     * @returns
     */
    public static get rootWrap(): HTMLDivElement {
        return (
            this.getElement(EIDMap.ROOT_WRAP) ??
            this.setToElement(
                this.createElement("div", {
                    id: EIDMap.ROOT_WRAP,
                    className: "only-subitems-events absolute-full",
                }),
                {
                    zIndex: 1,
                    target: document.body,
                },
            )
        );
    }
    /**
     * 获取弹窗容器
     * @returns
     */
    public static get popupWrap(): HTMLDivElement {
        return (
            this.getElement(EIDMap.POPUP_WRAP) ??
            this.setToElement(
                this.createElement("div", {
                    id: EIDMap.POPUP_WRAP,
                    className: "only-subitems-events absolute-full",
                }),
                {
                    zIndex: 2,
                    target: document.body,
                },
            )
        );
    }
    /**
     * 获取消息容器
     * @returns
     */
    public static get alertWrap(): HTMLDivElement {
        return (
            this.getElement(EIDMap.POPUP_ALERT_WRAP) ??
            this.setToElement(
                this.createElement("div", {
                    id: EIDMap.POPUP_ALERT_WRAP,
                    className: "only-subitems-events absolute-full",
                }),
                {
                    zIndex: 3,
                    target: document.body,
                },
            )
        );
    }
    /**
     * 获取canvas容器
     * @returns
     */
    public static get canvasWrap(): HTMLDivElement {
        return (
            this.getElement(EIDMap.CANVAS_WRAP) ??
            this.setToElement(
                this.createElement("div", {
                    id: EIDMap.CANVAS_WRAP,
                    className: "only-subitems-events absolute-full",
                }),
                {
                    zIndex: 0,
                    target: document.body,
                },
            )
        );
    }
    /**
     * 获取基础canvas
     * @returns
     */
    public static get baseCanvas(): HTMLCanvasElement {
        return (
            this.getElement(EIDMap.BASE_CANVAS) ??
            this.setToElement(
                this.createElement("canvas", {
                    id: EIDMap.BASE_CANVAS,
                    className: "absolute-full",
                    oncontextmenu: () => false,
                }),
                {
                    target: this.canvasWrap,
                    zIndex: 0,
                    callback: CanvasUtils.syncCanvasSize,
                    style: { backgroundColor: "rgba(0, 0, 0, 1)" },
                },
            )
        );
    }
    /**
     * 获取模拟canvas
     * @returns
     */
    public static get simulationCanvas(): HTMLCanvasElement {
        return (
            this.getElement(EIDMap.SIMULATION_CANVAS) ??
            this.setToElement(
                this.createElement("canvas", {
                    id: EIDMap.SIMULATION_CANVAS,
                    className: "pointer-events-none absolute-full",
                }),
                {
                    zIndex: 1,
                    target: this.canvasWrap,
                    callback: CanvasUtils.syncCanvasSize,
                },
            )
        );
    }
    /**
     * 获取指示canvas
     * @returns
     */
    public static get instructCanvas(): HTMLCanvasElement {
        return (
            this.getElement(EIDMap.INSTRUCT_CANVAS) ??
            this.setToElement(
                this.createElement("canvas", {
                    id: EIDMap.INSTRUCT_CANVAS,
                    className: "pointer-events-none full-all absolute-full",
                }),
                {
                    zIndex: 2,
                    target: this.canvasWrap,
                    callback: CanvasUtils.syncCanvasSize,
                },
            )
        );
    }
    /**
     * 获取指示Box
     * @returns
     */
    public static get instructBox(): HTMLDivElement {
        return this.setToElement(
            this.createElement("div", {
                className: "pointer-events-none absolute invisible",
            }),
            {
                zIndex: -1,
                target: document.body,
            },
        );
    }

    /**
     * 获取元素
     * @param id
     * @returns
     */
    private static getElement<T extends HTMLElement>(id: string): T | null {
        return document.getElementById(id) as T;
    }
    /**
     * 创建元素
     * @returns
     */
    public static createElement<
        K extends keyof HTMLElementTagNameMap,
        T extends HTMLElementTagNameMap[K],
    >(name: K, options?: ICreateOptions & Partial<T>): T {
        const element = document.createElement(name) as T;
        return Object.assign(element, options);
    }
    /**
     * 添加到元素
     * @param id
     */
    public static setToElement<T extends HTMLElement>(
        element: T,
        options: ISetOptions<T> = {},
    ): T {
        if (typeof options.zIndex === "number") {
            element.style.zIndex = options.zIndex.toString();
            if (options.target instanceof HTMLElement) {
                const original: ChildNode | undefined =
                    options.target.childNodes[options.zIndex];
                if (original instanceof Node) {
                    options.target.insertBefore(element, original);
                    return element;
                }
            }
        }
        options.style && Object.assign(element.style, options.style);
        options.target?.appendChild(element);
        options.callback?.(element);
        return element;
    }
    /**
     * 创建纹理canvas
     */
    public static createTextureCanvas(
        options?: Partial<HTMLCanvasElement>,
    ): HTMLCanvasElement {
        const canvas: HTMLCanvasElement = this.createElement("canvas", options);
        options && CanvasUtils.syncCanvasSize(canvas);
        return canvas;
    }
}

/**
 * 创建元素配置
 */
interface ICreateOptions { }

/**
 * 设置元素配置
 */
interface ISetOptions<T extends HTMLElement = HTMLElement> {
    /**
     * 目标
     */
    target?: HTMLElement;
    /**
     * 层级
     */
    zIndex?: number;
    /**
     * 样式
     */
    style?: Partial<CSSStyleDeclaration>;
    /**
     * 回调
     * @param element
     * @returns
     */
    callback?: (element: T) => void;
}

/**
 * 调整字体大小
 * @param fontSize
 * @param designSize
 * @returns
 */
export function adjustFontSize(
    designSize: number = 1920,
    fontSize: number = 16,
): void {
    const docElement: HTMLElement = document.documentElement,
        offsetWidth: number = docElement.offsetWidth,
        scale: number = offsetWidth / designSize;
    docElement.style.fontSize = `${fontSize * scale}px`;
}
/**
 * 调整app高度
 */
export function adjustAppHeight(): void {
    const height: number = Math.min(screen.height, innerHeight);
    document.documentElement.style.setProperty("--app-height", `${height}px`);
}
