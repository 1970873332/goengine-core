import {
    ResourceComponent,
    ResourceComponentJSON,
    ResourcePathConfig,
} from "./Resource";

/**
 * 双向资源组件
 */
export default class ResourceTwinComponent<
    T extends IJSON = IJSON,
    C extends ResourceTwinConfig = ResourceTwinConfig,
> extends ResourceComponent<T, C> {
    /**
     * 获取资源路径
     * @param path
     * @param former
     * @returns
     */
    public g<U extends T["toggle"][number]>(
        path: U,
        former: boolean = true,
    ): string {
        return `${this.path}${former ? this.config.latter : this.config.former}${path}`;
    }
    /**
     * 获取资源路径
     * @param path
     * @returns
     */
    public gf<U extends T["former"][number]>(path: U): string {
        return `${path}${this.config.former}${path}`;
    }
    /**
     * 获取资源路径
     * @param path
     * @returns
     */
    public gl<U extends T["latter"][number]>(path: U): string {
        return `${this.path}${this.config.latter}${path}`;
    }
}

/**
 * 双向资源配置类
 */
export abstract class ResourceTwinConfig extends ResourcePathConfig {
    public declare  JSON: IJSON;
    /**
     * 前者
     */
    public declare  readonly former: string;
    /**
     * 后者
     */
    public declare  readonly latter: string;
}

interface IJSON extends ResourceComponentJSON {
    /**
     * 切换
     */
    toggle: readonly string[];
    /**
     * 前者
     */
    former: readonly string[];
    /**
     * 后者
     */
    latter: readonly string[];
}
