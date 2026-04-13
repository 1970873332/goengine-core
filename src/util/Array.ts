import { MathUtils } from "./Math";
import { ObjectUtils } from "./Object";

/**
 * 数组工具
 */
export abstract class ArrayUtils {
    /**
     * 深度遍历
     * @param array
     * @param callback
     * @param filter
     * @returns
     */
    public static traverse<T extends IIdentityGroup<T>>(
        array: TGroupCollection<T>,
        callback: (
            value: T,
            index: number,
            array: TGroupCollection<T>,
        ) => boolean | void,
    ): void {
        const list: T[] = this.normalize(array);
        for (let index = 0; index < list.length; index++) {
            const item: T = list[index],
                result: boolean | void = callback(item, index, array);
            if (typeof result === "boolean") {
                if (result) break;
                else continue;
            }
            item.children && this.traverse(item.children, callback);
        }
    }
    /**
     * 深度过滤
     * @param item 过滤对象
     * @param selects 存有过滤id组
     * @param del 是否删除
     * @param peers 过滤组
     * @returns
     */
    public static traverseFilter<T extends IIdentityGroup<T>>(
        item: T,
        selects: string[],
        del: boolean,
        peers?: TGroupCollection<T>,
    ): string[] {
        const set: Set<string> = new Set(selects);
        item.id && (del ? set.delete(item.id) : set.add(item.id));
        Array.isArray(peers) &&
            this.traverse(
                peers,
                (smallItem: T, _, array: TGroupCollection<T>) => {
                    if (smallItem.id == item.id) {
                        this.normalize(array).forEach(
                            (smallSmallItem) =>
                                smallSmallItem.id &&
                                smallSmallItem.id != item.id &&
                                set.delete(smallSmallItem.id),
                        );
                        return true;
                    }
                },
            );
        return Array.from(set);
    }
    /**
     * 深度查找
     * @param array
     * @param filter
     * @returns
     */
    public static traverseFind<T extends IIdentityGroup<T>>(
        array: TGroupCollection<T>,
        filter: (
            value: T,
            index: number,
            array: TGroupCollection<T>,
        ) => boolean,
    ): T | undefined {
        const list: T[] = this.normalize(array);
        for (let index = 0; index < list.length; index++) {
            const item: T = list[index];
            if (filter(item, index, array)) return item;
            if (item.children) {
                const result: T | undefined = this.traverseFind(
                    item.children,
                    filter,
                );
                if (result) return result;
            }
        }
    }
    /**
     * 深度查找所有
     * @param array
     * @param filter
     * @returns
     */
    public static traverseFindAll<T extends IIdentityGroup<T>>(
        array: TGroupCollection<T>,
        filter: (
            value: T,
            index: number,
            array: TGroupCollection<T>,
        ) => boolean,
    ): T[] {
        const results: T[] = [],
            list: T[] = this.normalize(array);
        for (let index = 0; index < list.length; index++) {
            const item: T = list[index];
            if (filter(item, index, array)) results.push(item);
            if (item.children) {
                const result: T | undefined = this.traverseFind(
                    item.children,
                    filter,
                );
                if (result) results.push(result);
            }
        }
        return results;
    }
    /**
     * 标准化
     * @param collection
     * @returns
     */
    public static normalize<T>(
        collection?: TGroupCollection<T>,
        filter?: (
            value: T,
            index: number,
            array: TGroupCollection<T>,
        ) => boolean,
    ): T[] {
        if (!collection) return [];
        const result: T[] = (() => {
            // 数组直接返回
            if (Array.isArray(collection)) return collection;
            // 映射转为数组
            else if (collection instanceof Map)
                return Array.from(collection.values());
            // 集合转为数组
            else if (collection instanceof Set) return Array.from(collection);
            // 对象转为数组
            else if (ObjectUtils.isObject(collection))
                return Object.values(collection as Record<any, T>);
            return [];
        })();
        return filter ? result.filter(filter) : result;
    }
    /**
     * 扁平化
     * @param array
     * @returns
     */
    public static expand<T extends IIdentityGroup<T>>(
        array: TGroupCollection<T>,
    ): T[] {
        const list: T[] = [];
        this.traverse(array, (item) => {
            list.push(item);
        });
        return list;
    }
    /**
     * 随机项
     * @param array
     * @returns
     */
    public static rnItem<T>(array: T[]): T {
        return array[MathUtils.rn(array.length - 1)];
    }
}

interface IIdentityGroup<T> {
    id?: string;
    children?: TGroupCollection<T>;
}

type TGroupCollection<T> =
    | T[]
    | Map<any, T>
    | Set<T>
    | Record<any, T>
    | null
    | undefined;
