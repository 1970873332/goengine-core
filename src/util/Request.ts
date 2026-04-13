/**
 * 请求工具类
 */
export abstract class RequestUtils {
    /**
     * 格式化查询参数
     * @param url
     * @param format
     * @returns
     */
    public static fetch<T>(
        url: string | URL | Promise<string>,
        init?: RequestInit,
        format: (res: Response) => Promise<T> = (res) => res.json(),
    ): Promise<T> {
        return new Promise(async (resolve, reject) => {
            fetch(await url, init).then((res) => {
                if (res.status !== 200) return reject(res);
                return resolve(format(res));
            });
        });
    }
}
