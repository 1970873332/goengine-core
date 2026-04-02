/**
 * 资源工具
 */
export abstract class ResourceUtils {
    /**
     * 预加载图片
     * @param list
     * @param finallyCallback
     * @returns
     */
    public static preloadingImages(
        list: string[],
        finallyCallback?: (progress: number) => void,
    ): Promise<unknown[]> {
        let loadedCount = 0;
        const totalCount = list.length;
        return Promise.all(
            list.map(async (item) => {
                return new Promise((resolve, reject) => {
                    const img = new Image();
                    img.src = item;
                    img.onload = () => resolve(void 0);
                    img.onerror = () =>
                        reject(new Error(`Failed to load image: ${item}`));
                }).finally(() => {
                    loadedCount++;
                    const progress = Math.round(
                        (loadedCount / totalCount) * 100,
                    );
                    finallyCallback?.(progress);
                });
            }),
        );
    }
}
