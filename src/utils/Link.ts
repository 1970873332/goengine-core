/**
 * Link工具
 */
export class LinkUtils {
    /**
     * 获取query
     */
    public static get query(): Record<string, string> {
        return Object.fromEntries(Array.from(this.usp));
    }
    /**
     * 获取当前URLSearchParams
     */
    public static get usp(): URLSearchParams {
        const { hash, search } = location;
        return new URLSearchParams(
            decodeURIComponent(search || hash).split("?")[1],
        );
    }
    /**
     * 获取哈希路由
     */
    public static get hashRoutes(): string[] {
        return (
            decodeURIComponent(location.hash)
                .match(/#\/([^?#]*)/)?.[1]
                ?.split("/")
                .filter((segment) => !!segment) ?? []
        );
    }
    /**
     * 生成query
     * @param params
     * @param forHash
     */
    public static generateQuery(params: Record<string, string>): string {
        const param: string = Object.entries(params)
            .map(([key, value]) => `${key}=${value}`)
            .join("&");
        return param;
    }
    /**
     * 补充query
     * @param params
     * @param forHash
     */
    public static renewQuery(params: Record<string, string>): string {
        return this.generateQuery({
            ...this.query,
            ...params,
        });
    }
}
