import {
    ResourceComponent,
    ResourceComponentJSON,
    ResourcePathConfig,
} from "./Resource";

/**
 * 状态资源组件
 */
export default class ResourceStatusComponent<
    T extends IJSON = IJSON,
    C extends ResourceStatusConfig = ResourceStatusConfig,
> extends ResourceComponent<T, C> {
    /**
     * 获取资源路径
     * @param sign
     * @param path
     * @returns
     */
    public g<
        K extends keyof T["toggle"],
        U extends T["toggle"][K][number] | T["shared"][number],
    >(sign: K, path: U): string {
        const signPath = sign as keyof typeof this.config.JSON.toggle;
        return `${this.path}${signPath}/${path}`;
    }
    /**
     * 获取资源路径
     * @param path
     * @param sign
     * @returns
     */
    public gs<U extends T["shared"][number], K extends keyof T["toggle"]>(
        path: U,
        sign: K | undefined,
    ): string | undefined {
        return sign ? this.g(sign, path) : void 0;
    }
}

/**
 * 资源状态配置类
 */
export abstract class ResourceStatusConfig extends ResourcePathConfig {
    public declare  JSON: IJSON;
}

interface IJSON extends ResourceComponentJSON {
    /**
     * 切换
     */
    toggle: Record<any, readonly string[]>;
    /**
     * 共享
     */
    shared: readonly string[];
}
