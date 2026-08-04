import { MathUtils } from "./Math";
import { ObjectUtils } from "./Object";

/**
 * 数组工具类
 */
export abstract class ArrayUtils {
    /**
     * 深度遍历
     * @param array 数组
     * @param callback 返回true时中断遍历，返回false时跳过子项继续遍历
     * @returns
     */
    public static traverse<T extends IItem<T>>(
        array: TGroup<T>,
        callback: (value: T, index: number, array: TGroup<T>) => boolean | void,
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
     * 深度查找
     * @param array 数组
     * @param filter 过滤函数
     * @returns
     */
    public static traverseFind<T extends IItem<T>>(
        array: TGroup<T>,
        filter: (value: T, index: number, array: TGroup<T>) => boolean,
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
     * @param array 数组
     * @param filter 过滤函数
     * @returns
     */
    public static traverseFindAll<T extends IItem<T>>(
        array: TGroup<T>,
        filter: (value: T, index: number, array: TGroup<T>) => boolean,
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
     * @param collection 集合
     * @returns
     */
    public static normalize<T>(collection?: TGroup<T>): T[] {
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
                return Object.values(collection as Record<Iteration, T>);
            return [];
        })();
        return result;
    }
    /**
     * 扁平化
     * @param array 数组
     * @returns
     */
    public static expand<T extends IItem<T>>(array: TGroup<T>): T[] {
        const list: T[] = [];
        this.traverse(array, (item) => {
            list.push(item);
        });
        return list;
    }
    /**
     * 随机项
     * @param array 数组
     * @returns
     */
    public static rn<T>(array: TGroup<T>): T {
        const list: T[] = this.normalize(array);
        return list[MathUtils.rn(list.length - 1)];
    }
}

interface IItem<T> {
    /**
     * 标识符
     */
    id?: string;
    /**
     * 子项
     */
    children?: TGroup<T>;
}

type TGroup<T> =
    | T[]
    | Set<T>
    | Map<Iteration, T>
    | Record<Iteration, T>
    | null
    | undefined;
