/**
 * 资源组件
 */
export class ResourceComponent<
    T extends IJSON = IJSON,
    C extends ResourcePathConfig = ResourcePathConfig,
> {
    /**
     * @param config 资源配置
     */
    constructor(public config: C) {}

    /**
     * 获取资源路径
     */
    public get path(): string {
        return `${this.config.serverPath ?? ""}${this.config.rootPath}`;
    }

    /**
     * 获取资源路径
     * @param path
     * @param montage
     * @returns
     */
    public gr<U extends T["default"][number]>(
        path: U,
        montage: boolean = this.config.defaultFolder,
    ): string {
        return `${this.path}${!path.includes("/") && montage ? "default/" : ""}${path}`;
    }
}

/**
 * 资源路径配置类
 */
export abstract class ResourcePathConfig {
    /**
     * 资源配置
     */
    declare public JSON: IJSON;
    /**
     * 是否有默认文件夹
     */
    public defaultFolder: boolean = false;
    /**
     * 根路径
     */
    declare public rootPath: string;
    /**
     * 服务器路径
     */
    public serverPath?: string;
}

interface IJSON {
    /**
     * 默认
     */
    default: readonly string[];
}

export { IJSON as ResourceComponentJSON };
